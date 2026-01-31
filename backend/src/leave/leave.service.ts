import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaveDto, UpdateLeaveDto, ApproveLeaveDto, RejectLeaveDto } from './dto/leave.dto';
import { LeaveStatus } from '../common/enums';

@Injectable()
export class LeaveService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateLeaveDto) {
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);

        if (startDate > endDate) {
            throw new BadRequestException('Start date must be before end date');
        }

        return this.prisma.leave.create({
            data: {
                ...dto,
                startDate,
                endDate,
            },
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
    }

    async findAll(employeeId?: string, status?: LeaveStatus) {
        const where: any = {};

        if (employeeId) {
            where.employeeId = employeeId;
        }

        if (status) {
            where.status = status;
        }

        return this.prisma.leave.findMany({
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
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string) {
        const leave = await this.prisma.leave.findUnique({
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

        if (!leave) {
            throw new NotFoundException('Leave request not found');
        }

        return leave;
    }

    async update(id: string, dto: UpdateLeaveDto) {
        const leave = await this.findOne(id);

        if (leave.status !== LeaveStatus.PENDING) {
            throw new BadRequestException('Can only update pending leave requests');
        }

        return this.prisma.leave.update({
            where: { id },
            data: {
                ...dto,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
            },
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
    }

    async approve(id: string, dto: ApproveLeaveDto) {
        const leave = await this.findOne(id);

        if (leave.status !== LeaveStatus.PENDING) {
            throw new BadRequestException('Leave request is not pending');
        }

        return this.prisma.leave.update({
            where: { id },
            data: {
                status: LeaveStatus.APPROVED,
                approvedBy: dto.approvedBy,
                approvedAt: new Date(),
                notes: dto.notes,
            },
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
    }

    async reject(id: string, dto: RejectLeaveDto) {
        const leave = await this.findOne(id);

        if (leave.status !== LeaveStatus.PENDING) {
            throw new BadRequestException('Leave request is not pending');
        }

        return this.prisma.leave.update({
            where: { id },
            data: {
                status: LeaveStatus.REJECTED,
                rejectedBy: dto.rejectedBy,
                rejectedAt: new Date(),
                notes: dto.notes,
            },
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
    }

    async remove(id: string) {
        const leave = await this.findOne(id);

        if (leave.status !== LeaveStatus.PENDING) {
            throw new BadRequestException('Can only delete pending leave requests');
        }

        return this.prisma.leave.delete({
            where: { id },
        });
    }

    async getStatistics(employeeId?: string) {
        const where = employeeId ? { employeeId } : {};

        const [total, pending, approved, rejected] = await Promise.all([
            this.prisma.leave.count({ where }),
            this.prisma.leave.count({ where: { ...where, status: LeaveStatus.PENDING } }),
            this.prisma.leave.count({ where: { ...where, status: LeaveStatus.APPROVED } }),
            this.prisma.leave.count({ where: { ...where, status: LeaveStatus.REJECTED } }),
        ]);

        return {
            total,
            pending,
            approved,
            rejected,
        };
    }
}
