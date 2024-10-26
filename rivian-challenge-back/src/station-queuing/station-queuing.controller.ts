import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from 'src/shared/decorators/auth-user.decorator';
import { VeryWeaklyAuthenticatedGuard } from 'src/shared/guards/very-weakly-authenticated.guard';
import { EnterChargingQueueDto } from 'src/station-queuing/dtos/enter-charging-queue.dto';
import { StartChargingSessionDto } from 'src/station-queuing/dtos/start-charging-session.dto';
import { StationQueuingService } from 'src/station-queuing/station-queuing.service';
import { User } from 'src/user/entities/user.entity';

@Controller('station-queuing')
export class StationQueingController {
  constructor(private readonly stationQueuingService: StationQueuingService) {}
  // check in na posao + hoce li ti trebati punjac danas
  // imam broj ljudi kojima treba punjac u narednih 8 sati
  // Dok su stanice prazne - stavim te na stanicu sa otvorenim vremenom za punjenje.
  // Check inuj se na stanicu.
  // Kad su stanice popunjene - redom po stanicama prepolovljavam vreme punjenja (na 4h)
  //   i drugu polovinu vremena dajem sledecem
  // Obavestavam koga treba da skloni kola par sati unapred.
  // Check out sa stanice
  // check out sa posla

  //   @Post('start-charging-session/:timeSlotId')
  //   async startChargingSession(
  //     @Request() { user },
  //     @Param('timeSlotId', new ParseIntPipe()) timeSlotId: number,
  //   ) {
  //     // TODO: zapocni sesiju u time slotu koji si dobio
  //   }

  //   @Post('finish-charging-session/:chargingSessionId')
  //   async finishChargingSession(
  //     @Request() { user },
  //     @Param('chargingSessionId', new ParseIntPipe()) chargingSessionId: number,
  //   ) {
  //     // TODO: zavrsi sesiju
  //   }

  // @Get('charging-queue')
  // @UseGuards(VeryWeaklyAuthenticatedGuard)
  // async getSessionSchedule() {
  //   // reserved time: time from - time to
  //   // available time: time from - time to
  //   // raw query for this, easier that way
  // }

  @Get('my-queued-entry')
  @UseGuards(VeryWeaklyAuthenticatedGuard)
  async getMyQueuedEntry(@AuthUser() employee: User) {
    return this.stationQueuingService.getEmployeesQueuedEntry(employee);
  }

  @Post('enter-charging-queue')
  @UseGuards(VeryWeaklyAuthenticatedGuard)
  async enterChargingQueue(
    @Body() enterChargingQueueDto: EnterChargingQueueDto,
    @AuthUser() user: User,
  ) {
    return this.stationQueuingService.enterChargingQueue(
      enterChargingQueueDto,
      user,
    );
  }

  @Get('my-unstarted-session')
  @UseGuards(VeryWeaklyAuthenticatedGuard)
  async getMyUnstartedSession(@AuthUser() employee: User) {
    return this.stationQueuingService.getEmployeesUnstartedSession(employee);
  }

  @Post('start-charging-session')
  @UseGuards(VeryWeaklyAuthenticatedGuard)
  async startChargingSession(
    @Body() dto: StartChargingSessionDto,
    @AuthUser() employee: User,
  ) {
    return this.stationQueuingService.startChargingSession(
      dto.sessionId,
      employee,
    );
  }

  @Get('current-charging-sessions')
  @UseGuards(VeryWeaklyAuthenticatedGuard)
  async getCurrentChargingSessions() {
    return this.stationQueuingService.getCurrentChargingSessions();
  }

  @Get('available-chargers')
  @UseGuards(VeryWeaklyAuthenticatedGuard)
  async getAvailableChargers() {
    return this.stationQueuingService.getAvailableChargers();
  }
}
