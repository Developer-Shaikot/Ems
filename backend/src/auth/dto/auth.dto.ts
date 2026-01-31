import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../common/enums';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
