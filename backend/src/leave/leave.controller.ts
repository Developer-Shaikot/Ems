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
import { LeaveService } from './leave.service';
import { CreateLeaveDto, UpdateLeaveDto, ApproveLeaveDto, RejectLeaveDto } from './dto/leave.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, LeaveStatus } from '../common/enums';

@Controller('leaves')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaveController {
    constructor(private readonly leaveService: LeaveService) { }

    @Post()
    create(@Body() createLeaveDto: CreateLeaveDto) {
        return this.leaveService.create(createLeaveDto);
    }

    @Get()
    findAll(
        @Query('employeeId') employeeId?: string,
        @Query('status') status?: LeaveStatus,
    ) {
        return this.leaveService.findAll(employeeId, status);
    }

    @Get('statistics')
    getStatistics(@Query('employeeId') employeeId?: string) {
        return this.leaveService.getStatistics(employeeId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.leaveService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateLeaveDto: UpdateLeaveDto) {
        return this.leaveService.update(id, updateLeaveDto);
    }

    @Post(':id/approve')
    @Roles(Role.ADMIN, Role.HR)
    approve(@Param('id') id: string, @Body() dto: ApproveLeaveDto) {
        return this.leaveService.approve(id, dto);
    }

    @Post(':id/reject')
    @Roles(Role.ADMIN, Role.HR)
    reject(@Param('id') id: string, @Body() dto: RejectLeaveDto) {
        return this.leaveService.reject(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.leaveService.remove(id);
    }
}
