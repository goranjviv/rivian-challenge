import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ChargingStation } from 'src/charging-station/entities/charging-station.entity';
import {
  ALREADY_CHARGED_TODAY_POINTS,
  DISTANCE_POINTS_FACTOR,
  END_OF_WORKDAY_HOURS,
  HIGH_DEMAND_HOURS_LIMIT,
  HIGH_DEMAND_TRESHOLD,
  PRIORITY_POINTS,
  QUEUE_ORDER_POINTS_FACTOR,
} from 'src/station-queuing/constants';
import { EnterChargingQueueDto } from 'src/station-queuing/dtos/enter-charging-queue.dto';
import { AssignedChargerTimeSlot } from 'src/station-queuing/entities/assigned-charger-time-slot.entity';
import { ChargingQueueMember } from 'src/station-queuing/entities/charging-queue-member.entity';
import { User } from 'src/user/entities/user.entity';
import { IsNull, LessThan, MoreThan, Not, Repository } from 'typeorm';

@Injectable()
export class StationQueuingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ChargingQueueMember)
    private readonly chargingQueueMemberRepo: Repository<ChargingQueueMember>,
    @InjectRepository(AssignedChargerTimeSlot)
    private readonly assignedChargerTimeSlotRepo: Repository<AssignedChargerTimeSlot>,
    @InjectRepository(ChargingStation)
    private readonly chargingStationRepo: Repository<ChargingStation>,
  ) {}

  async enterChargingQueue(
    { preferredChargingTimeInHours, isPriority }: EnterChargingQueueDto,
    employee: User,
  ) {
    const newChargingQueueMember = this.chargingQueueMemberRepo.create({
      preferredChargingTimeInHours,
      isPriority,
      employee,
    });

    return this.chargingQueueMemberRepo.save(newChargingQueueMember);
  }

  async getCurrentChargingSessions() {
    const now = new Date();

    const currentChargingSessions = await this.assignedChargerTimeSlotRepo.find(
      {
        relations: [
          'employee',
          'chargingStation'
        ],
        where: {
          startedAt: LessThan(now),
          assignedEndsAt: MoreThan(now),
        },
      },
    );

    return currentChargingSessions;
  }

  async getAvailableChargers() {
    const currentChargingSessions = await this.getCurrentChargingSessions();
    const takenChargers = currentChargingSessions.map(
      (session) => session.chargingStation,
    );
    const allChargers = await this.chargingStationRepo.find();

    const freeChargers = [];
    for (const charger of allChargers) {
      const isTaken = takenChargers.find((takenCharger) => {
        return takenCharger.id === charger.id;
      });

      if (!isTaken) {
        freeChargers.push(charger);
      }
    }

    return freeChargers;
  }

  // this is where most of the queuing magic happens.
  calculatePriorityPoints(
    positionInQueue: number, // starting with 1
    isPriority: boolean,
    travelDistanceKm: number,
    alreadyChargedToday?: boolean,
  ): number {
    const points =
      positionInQueue * QUEUE_ORDER_POINTS_FACTOR +
      travelDistanceKm * DISTANCE_POINTS_FACTOR +
      (isPriority ? PRIORITY_POINTS : 0) +
      (alreadyChargedToday ? ALREADY_CHARGED_TODAY_POINTS : 0);

    return points;
  }

  // If it runs more often, more chance for high priority people to not get a slot.
  // If it runs less often, we'll have more wasted charger time.
  @Cron(CronExpression.EVERY_10_MINUTES)
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async assignTimeSlotsForQueuedEntries() {
    const queueMembers = await this.chargingQueueMemberRepo.find({
      relations: ['employee'],
      where: {
        isProcessed: false,
      },
    });

    // needed for time calculations and for queries
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfWorkday = new Date();
    endOfWorkday.setHours(END_OF_WORKDAY_HOURS, 0, 0, 0);

    // We got nothing to do. No new requests.
    if (!queueMembers.length) {
      return;
    }

    // calculate priority points for each queue member
    const queueMembersWithPointsPromises = queueMembers.map(
      async (queueMember, index) => {
        const previousChargingSessionForEmployee =
          // await this.assignedChargerTimeSlotRepo
          //   .createQueryBuilder()
          //   .where('employeeId = :id', { id: queueMember.employee.id })
          //   .andWhere('startedAt > :startOfDay', { startOfDay })
          //   .execute();
          await this.assignedChargerTimeSlotRepo.findOne({
            where: {
              startedAt: MoreThan(startOfDay),
              employee: {
                id: queueMember.employee.id,
              }
            }
          });
        const alreadyChargedToday = !!previousChargingSessionForEmployee;

        const points = this.calculatePriorityPoints(
          index + 1,
          queueMember.isPriority,
          queueMember.employee.travelDistanceKm,
          alreadyChargedToday,
        );

        // convenient for further processing
        return {
          queueMember,
          points,
        };
      },
    );

    // using Promise.all to speed up parallel db requests
    // Might be better to create a one time query, but no time for that.
    const queueMembersWithPoints = await Promise.all(
      queueMembersWithPointsPromises,
    );

    // sort queue by points so that we'd know who gets to charge first
    const ascSortedQueue = queueMembersWithPoints.sort((a, b) => {
      return a.points - b.points;
    });

    const availableChargers = await this.getAvailableChargers();

    const isHighDemand =
      queueMembers.length / availableChargers.length > HIGH_DEMAND_TRESHOLD;

    // hours till the end of workday
    // needed to know max length of time slot
    const hoursTillEndOfWorkday = Math.abs(
      Math.floor((+endOfWorkday - +now) / (60 * 60 * 1000)),
    );

    // either determined by high demand limit or by end of workday
    let maxChargingTimeHours =
      isHighDemand && HIGH_DEMAND_HOURS_LIMIT < hoursTillEndOfWorkday
        ? HIGH_DEMAND_HOURS_LIMIT
        : hoursTillEndOfWorkday;

    const newTimeSlots = [];
    const processedQueueMembers = [];
    for (const charger of availableChargers) {
      // maybe we don't have any more reservations
      if (!ascSortedQueue.length) {
        break;
      }
  
      // pop them one by one, highest priority will be last in the list
      const queueMember = ascSortedQueue.pop().queueMember;

      const chargingTimeHours =
        maxChargingTimeHours > queueMember.preferredChargingTimeInHours
          ? queueMember.preferredChargingTimeInHours
          : maxChargingTimeHours;

      // generate timestamp for end
      const endsAt = new Date(now);
      endsAt.setHours(endsAt.getHours() + chargingTimeHours);

      newTimeSlots.push(this.assignedChargerTimeSlotRepo.create({
        assignedStartsAt: now,
        assignedEndsAt: endsAt,
        employee: queueMember.employee,
        chargingStation: charger,
      }));

      
      processedQueueMembers.push({
        ...queueMember,
        isProcessed: true
      });
    }

    // slots are saved.
    // employees need to connect their cars and start charging sessions.
    await this.assignedChargerTimeSlotRepo.save(newTimeSlots);

    await this.chargingQueueMemberRepo.save(processedQueueMembers);

    // would be a good place for the following:
    // - send notifs
    // - push the new data to WS channel
  }

  async startChargingSession(sessionId: number, employee: User) {
    const now = new Date();
    const session = await this.assignedChargerTimeSlotRepo.findOne({
      relations: [
        'employee',
        'chargingStation'
      ],
      where: {
        startedAt: null,
        assignedEndsAt: MoreThan(now),
        id: sessionId,
        employee: {
          id: employee.id
        }
      }
    });

    session.startedAt = now;
    return this.assignedChargerTimeSlotRepo.save(session);
  }

  async getEmployeesUnstartedSession(employee: User) {
    const now = new Date();
    const session = await this.assignedChargerTimeSlotRepo.findOne({
      relations: ['employee', 'chargingStation'],
      where: {
        startedAt: IsNull(),
        assignedEndsAt: MoreThan(now),
        employee: {
          id: employee.id
        },
      },
    });

    return session;
  }

  async getEmployeesQueuedEntry(employee: User) {
    const entry = await this.chargingQueueMemberRepo.findOne({
      where: {
        isProcessed: false,
        employee: {
          id: employee.id
        }
      },
    });

    return entry;
  }
}
