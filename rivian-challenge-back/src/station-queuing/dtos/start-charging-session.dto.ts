import { IsInt, IsPositive } from "class-validator";

export class StartChargingSessionDto {
    @IsPositive()
    @IsInt()
    sessionId: number;
}
