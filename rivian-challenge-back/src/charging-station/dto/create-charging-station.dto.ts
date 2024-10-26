import { IsInt, IsString } from "class-validator";

export class CreateChargingStationDto {
    @IsString()
    name: string;
}
