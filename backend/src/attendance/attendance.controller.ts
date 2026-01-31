import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto, UpdateAttendanceDto, CheckInDto, CheckOutDto } from './dto/attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('check-in')
    checkIn(@Body() dto: CheckInDto) {
        return this.attendanceService.checkIn(dto);
    }

    @Post('check-out')
    checkOut(@Body() dto: CheckOutDto) {
        return this.attendanceService.checkOut(dto);
    }

    @Post()
    @Roles(Role.ADMIN, Role.HR)
    create(@Body() createAttendanceDto: CreateAttendanceDto) {
        return this.attendanceService.create(createAttendanceDto);
    }

    @Get()
    findAll(
        @Query('employeeId') employeeId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.attendanceService.findAll(employeeId, startDate, endDate);
    }

    @Get('report')
    @Roles(Role.ADMIN, Role.HR)
    getReport(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return this.attendanceService.getReport(startDate, endDate);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.attendanceService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.HR)
    update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
        return this.attendanceService.update(id, updateAttendanceDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.HR)
    remove(@Param('id') id: string) {
        return this.attendanceService.remove(id);
    }
}
