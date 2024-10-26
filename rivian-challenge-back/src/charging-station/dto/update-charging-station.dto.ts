import { PartialType } from '@nestjs/mapped-types';
import { CreateChargingStationDto } from './create-charging-station.dto';

export class UpdateChargingStationDto extends PartialType(CreateChargingStationDto) {}
