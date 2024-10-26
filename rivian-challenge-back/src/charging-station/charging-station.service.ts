import { ConflictException, Injectable } from '@nestjs/common';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { UpdateChargingStationDto } from './dto/update-charging-station.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ChargingStation } from 'src/charging-station/entities/charging-station.entity';

@Injectable()
export class ChargingStationService {
  constructor(
    @InjectRepository(ChargingStation)
    private readonly chargingStationRepo: Repository<ChargingStation>,
  ) {}

  async throwConflictIfNameTaken(name: string, idToExclude?: number) {
    const excludeIdQueryPart = idToExclude ? {
      id: Not(idToExclude)
    } : undefined;

    const chargingStationWithName = await this.chargingStationRepo.findOne({
      where: {
        name,
        ...excludeIdQueryPart
      }
    });

    if (chargingStationWithName) {
      throw new ConflictException('Name is already taken');
    }
  }

  async create(createChargingStationDto: CreateChargingStationDto) {
    await this.throwConflictIfNameTaken(createChargingStationDto.name);

    return this.chargingStationRepo.save(createChargingStationDto);
  }

  async findAll() {
    return this.chargingStationRepo.find();
  }

  async findOne(id: number) {
    return this.chargingStationRepo.findOneOrFail({
      where: {
        id
      }
    });
  }

  async update(id: number, updateChargingStationDto: UpdateChargingStationDto) {
    await this.throwConflictIfNameTaken(updateChargingStationDto.name, id);

    const chargingStation = await this.chargingStationRepo.findOneOrFail({
      where: {
        id
      }
    });

    const updatedStation = {
      ...chargingStation,
      ...updateChargingStationDto
    };

    return this.chargingStationRepo.save(updatedStation);
  }

  async remove(id: number) {
    const chargingStation = await this.chargingStationRepo.findOneOrFail({
      where: {
        id
      }
    });

    await this.chargingStationRepo.delete({ id });

    return chargingStation;
  }
}
