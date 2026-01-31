import api from './api';

export interface DashboardStats {
    totalEmployees?: number;
    totalDepartments?: number;
    todayAttendance: number | string;
    pendingLeaves: number;
}

export const dashboardService = {
    async getStats(): Promise<DashboardStats> {
        const { data } = await api.get<DashboardStats>('/dashboard/stats');
        return data;
    },
};
