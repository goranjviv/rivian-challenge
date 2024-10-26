import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargingStation } from 'src/charging-station/entities/charging-station.entity';
import { AssignedChargerTimeSlot } from 'src/station-queuing/entities/assigned-charger-time-slot.entity';
import { ChargingQueueMember } from 'src/station-queuing/entities/charging-queue-member.entity';
import { StationQueingController } from 'src/station-queuing/station-queuing.controller';
import { StationQueuingService } from 'src/station-queuing/station-queuing.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssignedChargerTimeSlot, ChargingQueueMember, User, ChargingStation]),
  ],
  controllers: [StationQueingController],
  providers: [StationQueuingService],
})
export class StationQueuingModule {}
