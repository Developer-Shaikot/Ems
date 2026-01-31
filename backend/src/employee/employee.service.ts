import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeeService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateEmployeeDto) {
        return this.prisma.employee.create({
            data: {
                ...dto,
                joinDate: new Date(dto.joinDate),
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
            },
            include: {
                department: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }

    async findAll(page: number = 1, limit: number = 10, search?: string) {
        const skip = (page - 1) * limit;

        const where = search
            ? {
                OR: [
                    { name: { contains: search } },
                    { email: { contains: search } },
                    { position: { contains: search } },
                ],
            }
            : {};

        const [employees, total] = await Promise.all([
            this.prisma.employee.findMany({
                where,
                skip,
                take: limit,
                include: {
                    department: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.employee.count({ where }),
        ]);

        return {
            data: employees,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const employee = await this.prisma.employee.findUnique({
            where: { id },
            include: {
                department: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                attendances: {
                    take: 10,
                    orderBy: {
                        date: 'desc',
                    },
                },
                leaves: {
                    take: 10,
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        if (!employee) {
            throw new NotFoundException('Employee not found');
        }

        return employee;
    }

    async update(id: string, dto: UpdateEmployeeDto) {
        const employee = await this.findOne(id);

        return this.prisma.employee.update({
            where: { id },
            data: {
                ...dto,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
            },
            include: {
                department: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }

    async remove(id: string) {
        const employee = await this.findOne(id);

        return this.prisma.employee.delete({
            where: { id },
        });
    }

    async getStatistics() {
        const [total, active, byDepartment] = await Promise.all([
            this.prisma.employee.count(),
            this.prisma.employee.count({ where: { isActive: true } }),
            this.prisma.employee.groupBy({
                by: ['departmentId'],
                _count: true,
            }),
        ]);

        return {
            total,
            active,
            inactive: total - active,
            byDepartment,
        };
    }
}
