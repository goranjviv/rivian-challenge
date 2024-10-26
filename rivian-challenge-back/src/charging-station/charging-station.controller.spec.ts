import { Test, TestingModule } from '@nestjs/testing';
import { ChargingStationController } from './charging-station.controller';
import { ChargingStationService } from './charging-station.service';

describe('ChargingStationController', () => {
  let controller: ChargingStationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChargingStationController],
      providers: [ChargingStationService],
    }).compile();

    controller = module.get<ChargingStationController>(ChargingStationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
