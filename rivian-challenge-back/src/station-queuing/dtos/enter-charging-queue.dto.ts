import { IsBoolean, IsInt, IsPositive } from "class-validator";

export class EnterChargingQueueDto {
    @IsPositive()
    @IsInt()
    preferredChargingTimeInHours: number;

    @IsBoolean()
    isPriority: boolean;
}

