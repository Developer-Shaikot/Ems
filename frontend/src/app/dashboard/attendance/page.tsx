'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { authService } from '@/lib/auth';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Attendance {
    id: string;
    date: string;
    checkIn: string | null;
    checkOut: string | null;
    status: string;
    employee: {
        name: string;
    };
}

export default function AttendancePage() {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkedIn, setCheckedIn] = useState(false);
    const user = authService.getStoredUser();

    useEffect(() => {
        fetchAttendances();
        checkTodayStatus();
    }, []);

    const fetchAttendances = async () => {
        try {
            const { data } = await api.get('/attendance');
            setAttendances(data);
        } catch (error) {
            console.error('Failed to fetch attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkTodayStatus = async () => {
        if (!user?.employee) return;

        try {
            const today = new Date().toISOString().split('T')[0];
            const { data } = await api.get('/attendance', {
                params: {
                    employeeId: user.employee.id,
                    startDate: today,
                    endDate: today,
                },
            });
            setCheckedIn(data.length > 0 && !data[0].checkOut);
        } catch (error) {
            console.error('Failed to check status:', error);
        }
    };

    const handleCheckIn = async () => {
        if (!user?.employee) {
            alert('Employee profile not found');
            return;
        }

        try {
            await api.post('/attendance/check-in', {
                employeeId: user.employee.id,
            });
            setCheckedIn(true);
            fetchAttendances();
            alert('Checked in successfully!');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to check in');
        }
    };

    const handleCheckOut = async () => {
        if (!user?.employee) {
            alert('Employee profile not found');
            return;
        }

        try {
            await api.post('/attendance/check-out', {
                employeeId: user.employee.id,
            });
            setCheckedIn(false);
            fetchAttendances();
            alert('Checked out successfully!');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to check out');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Attendance
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Track your daily attendance
                </p>
            </div>

            {/* Check In/Out Card */}
            {user?.employee && (
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">
                                {checkedIn ? 'You are checked in' : 'Ready to start your day?'}
                            </h2>
                            <p className="text-blue-100">
                                {format(new Date(), 'EEEE, MMMM d, yyyy')}
                            </p>
                            <p className="text-blue-100 text-sm mt-1">
                                Current time: {format(new Date(), 'h:mm a')}
                            </p>
                        </div>
                        <button
                            onClick={checkedIn ? handleCheckOut : handleCheckIn}
                            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${checkedIn
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-white text-blue-600 hover:bg-blue-50'
                                }`}
                        >
                            {checkedIn ? (
                                <>
                                    <Clock className="w-6 h-6 inline mr-2" />
                                    Check Out
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-6 h-6 inline mr-2" />
                                    Check In
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Attendance History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Attendance History
                    </h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : attendances.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No attendance records found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Employee
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Check In
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Check Out
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {attendances.map((att) => (
                                    <tr key={att.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {format(new Date(att.date), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {att.employee.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {att.checkIn ? format(new Date(att.checkIn), 'h:mm a') : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {att.checkOut ? format(new Date(att.checkOut), 'h:mm a') : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${att.status === 'PRESENT'
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                                                    }`}
                                            >
                                                {att.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
