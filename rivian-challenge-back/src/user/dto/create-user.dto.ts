import { IsEmail, IsEnum, IsInt, IsPositive, IsString } from "class-validator";
import { UserType } from "src/shared/enums";

export class CreateUserDto {
    @IsString()
    fullName: string;

    @IsEmail()
    email: string;

    @IsEnum(UserType)
    userType: UserType;

    @IsInt()
    @IsPositive()
    travelDistanceKm: number;
}
