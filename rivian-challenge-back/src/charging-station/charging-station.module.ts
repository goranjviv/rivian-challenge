import { Module } from '@nestjs/common';
import { ChargingStationService } from './charging-station.service';
import { ChargingStationController } from './charging-station.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargingStation } from 'src/charging-station/entities/charging-station.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChargingStation])],
  controllers: [ChargingStationController],
  providers: [ChargingStationService],
})
export class ChargingStationModule {}
