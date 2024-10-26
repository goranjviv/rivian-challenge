import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ChargingStationModule } from './charging-station/charging-station.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationQueuingModule } from './station-queuing/station-queuing.module';
import { AuthUserMiddleware } from 'src/shared/middleware/auth-user.middleware';
import { User } from 'src/user/entities/user.entity';
import { ChargingQueueMember } from 'src/station-queuing/entities/charging-queue-member.entity';
import { AssignedChargerTimeSlot } from 'src/station-queuing/entities/assigned-charger-time-slot.entity';
import { ChargingStation } from 'src/charging-station/entities/charging-station.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: "127.0.0.1",
      port: 5432,
      database: "rivianchallenge",
      username: "rivianchallengeuser",
      password: "badpassword",
      entities: [User, ChargingQueueMember, AssignedChargerTimeSlot, ChargingStation],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]), // needed for auth user middleware
    ScheduleModule.forRoot(),
    UserModule,
    ChargingStationModule,
    StationQueuingModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthUserMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });

    consumer.apply();
  }
}
