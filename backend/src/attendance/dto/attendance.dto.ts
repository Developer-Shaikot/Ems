import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateAttendanceDto {
    @IsUUID()
    employeeId: string;

    @IsDateString()
    @IsOptional()
    date?: string;

    @IsDateString()
    @IsOptional()
    checkIn?: string;

    @IsDateString()
    @IsOptional()
    checkOut?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class UpdateAttendanceDto {
    @IsDateString()
    @IsOptional()
    checkOut?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class CheckInDto {
    @IsUUID()
    employeeId: string;
}

export class CheckOutDto {
    @IsUUID()
    employeeId: string;
}
