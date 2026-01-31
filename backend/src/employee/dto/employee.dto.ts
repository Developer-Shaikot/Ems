import { IsString, IsEmail, IsOptional, IsNumber, IsDateString, IsBoolean, IsUUID } from 'class-validator';

export class CreateEmployeeDto {
    @IsUUID()
    userId: string;

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    position: string;

    @IsUUID()
    departmentId: string;

    @IsNumber()
    salary: number;

    @IsDateString()
    joinDate: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsDateString()
    @IsOptional()
    dateOfBirth?: string;
}

export class UpdateEmployeeDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    position?: string;

    @IsUUID()
    @IsOptional()
    departmentId?: string;

    @IsNumber()
    @IsOptional()
    salary?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsString()
    @IsOptional()
    address?: string;

    @IsDateString()
    @IsOptional()
    dateOfBirth?: string;
}
