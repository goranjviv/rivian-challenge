import { Test, TestingModule } from '@nestjs/testing';
import { ChargingStationService } from './charging-station.service';

describe('ChargingStationService', () => {
  let service: ChargingStationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChargingStationService],
    }).compile();

    service = module.get<ChargingStationService>(ChargingStationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
