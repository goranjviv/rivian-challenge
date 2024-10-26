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
