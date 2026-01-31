import { IsString, IsDateString, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { LeaveType } from '../../common/enums';

export class CreateLeaveDto {
    @IsUUID()
    employeeId: string;

    @IsEnum(LeaveType)
    type: LeaveType;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsString()
    reason: string;
}

export class UpdateLeaveDto {
    @IsEnum(LeaveType)
    @IsOptional()
    type?: LeaveType;

    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    @IsString()
    @IsOptional()
    reason?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class ApproveLeaveDto {
    @IsUUID()
    approvedBy: string;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class RejectLeaveDto {
    @IsUUID()
    rejectedBy: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
