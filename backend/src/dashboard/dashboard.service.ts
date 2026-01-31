import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getStats(userId: string, role: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (role === 'ADMIN' || role === 'HR') {
            const [
                totalEmployees,
                totalDepartments,
                todayAttendance,
                pendingLeaves
            ] = await Promise.all([
                this.prisma.employee.count(),
                this.prisma.department.count(),
                this.prisma.attendance.count({
                    where: {
                        date: {
                            gte: today,
                            lt: tomorrow,
                        },
                        status: 'PRESENT'
                    }
                }),
                this.prisma.leave.count({
                    where: {
                        status: { equals: 'PENDING' } // Explicitly checking for PENDING status
                    }
                })
            ]);

            return {
                totalEmployees,
                totalDepartments,
                todayAttendance,
                pendingLeaves,
            };
        } else {
            // Employee Stats
            // We need to find the employee record for this user first
            const employee = await this.prisma.employee.findUnique({
                where: { userId },
            });

            if (!employee) {
                return {
                    todayAttendance: 'N/A',
                    pendingLeaves: 0,
                };
            }

            const [todayAttendanceRecord, pendingLeaves] = await Promise.all([
                this.prisma.attendance.findUnique({
                    where: {
                        employeeId_date: {
                            employeeId: employee.id,
                            date: today,
                        }
                    }
                }),
                this.prisma.leave.count({
                    where: {
                        employeeId: employee.id,
                        status: 'PENDING'
                    }
                })
            ]);
            
            return {
                todayAttendance: todayAttendanceRecord ? todayAttendanceRecord.status : 'Not Check-In',
                pendingLeaves,
            };
        }
    }
}
