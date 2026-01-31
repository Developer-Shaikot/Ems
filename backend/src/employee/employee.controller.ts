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
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) { }

    @Post()
    @Roles(Role.ADMIN, Role.HR)
    create(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.employeeService.create(createEmployeeDto);
    }

    @Get()
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.employeeService.findAll(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 10,
            search,
        );
    }

    @Get('statistics')
    @Roles(Role.ADMIN, Role.HR)
    getStatistics() {
        return this.employeeService.getStatistics();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.employeeService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.HR)
    update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
        return this.employeeService.update(id, updateEmployeeDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.employeeService.remove(id);
    }
}
