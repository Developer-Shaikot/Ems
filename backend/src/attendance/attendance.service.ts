import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto, UpdateAttendanceDto, CheckInDto, CheckOutDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
    constructor(private prisma: PrismaService) { }

    async checkIn(dto: CheckInDto) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingAttendance = await this.prisma.attendance.findFirst({
            where: {
                employeeId: dto.employeeId,
                date: {
                    gte: today,
                },
            },
        });

        if (existingAttendance) {
            throw new BadRequestException('Already checked in today');
        }

        return this.prisma.attendance.create({
            data: {
                employeeId: dto.employeeId,
                date: new Date(),
                checkIn: new Date(),
                status: 'PRESENT',
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async checkOut(dto: CheckOutDto) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await this.prisma.attendance.findFirst({
            where: {
                employeeId: dto.employeeId,
                date: {
                    gte: today,
                },
            },
        });

        if (!attendance) {
            throw new NotFoundException('No check-in record found for today');
        }

        if (attendance.checkOut) {
            throw new BadRequestException('Already checked out');
        }

        return this.prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                checkOut: new Date(),
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async create(dto: CreateAttendanceDto) {
        return this.prisma.attendance.create({
            data: {
                ...dto,
                date: dto.date ? new Date(dto.date) : new Date(),
                checkIn: dto.checkIn ? new Date(dto.checkIn) : null,
                checkOut: dto.checkOut ? new Date(dto.checkOut) : null,
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findAll(employeeId?: string, startDate?: string, endDate?: string) {
        const where: any = {};

        if (employeeId) {
            where.employeeId = employeeId;
        }

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        return this.prisma.attendance.findMany({
            where,
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        department: true,
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
        });
    }

    async findOne(id: string) {
        const attendance = await this.prisma.attendance.findUnique({
            where: { id },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        department: true,
                    },
                },
            },
        });

        if (!attendance) {
            throw new NotFoundException('Attendance record not found');
        }

        return attendance;
    }

    async update(id: string, dto: UpdateAttendanceDto) {
        await this.findOne(id);

        return this.prisma.attendance.update({
            where: { id },
            data: {
                ...dto,
                checkOut: dto.checkOut ? new Date(dto.checkOut) : undefined,
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.attendance.delete({
            where: { id },
        });
    }

    async getReport(startDate: string, endDate: string) {
        const attendances = await this.prisma.attendance.findMany({
            where: {
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        department: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        const summary = attendances.reduce((acc, att) => {
            const status = att.status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            attendances,
            summary,
            total: attendances.length,
        };
    }
}
