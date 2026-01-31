'use client';

import { useEffect, useState } from 'react';
import { authService, User } from '@/lib/auth';
import { Users, Calendar, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setUser(authService.getStoredUser());
    }, []);

    const isAdminOrHR = user && (user.role === 'ADMIN' || user.role === 'HR');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {user?.employee?.name || user?.email}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Here's what's happening with your organization today.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isAdminOrHR && (
                    <>
                        <StatCard
                            title="Total Employees"
                            value="--"
                            icon={<Users className="w-8 h-8" />}
                            color="blue"
                            href="/dashboard/employees"
                        />
                        <StatCard
                            title="Departments"
                            value="--"
                            icon={<TrendingUp className="w-8 h-8" />}
                            color="green"
                            href="/dashboard/departments"
                        />
                    </>
                )}
                <StatCard
                    title="Today's Attendance"
                    value="--"
                    icon={<Calendar className="w-8 h-8" />}
                    color="purple"
                    href="/dashboard/attendance"
                />
                <StatCard
                    title="Pending Leaves"
                    value="--"
                    icon={<FileText className="w-8 h-8" />}
                    color="orange"
                    href="/dashboard/leaves"
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <QuickActionCard
                        title="Check In/Out"
                        description="Mark your attendance for today"
                        href="/dashboard/attendance"
                        color="blue"
                    />
                    <QuickActionCard
                        title="Request Leave"
                        description="Submit a new leave request"
                        href="/dashboard/leaves"
                        color="green"
                    />
                    {isAdminOrHR && (
                        <QuickActionCard
                            title="Add Employee"
                            description="Register a new employee"
                            href="/dashboard/employees"
                            color="purple"
                        />
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                </h2>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>Connect to the backend to see recent activity</p>
                </div>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
    color,
    href,
}: {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'orange';
    href: string;
}) {
    const colorClasses = {
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
        green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
        orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    };

    return (
        <Link href={href}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                        {icon}
                    </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {value}
                </p>
            </div>
        </Link>
    );
}

function QuickActionCard({
    title,
    description,
    href,
    color,
}: {
    title: string;
    description: string;
    href: string;
    color: 'blue' | 'green' | 'purple';
}) {
    const colorClasses = {
        blue: 'border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/10',
        green: 'border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/10',
        purple: 'border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/10',
    };

    return (
        <Link href={href}>
            <div className={`border-2 rounded-lg p-4 transition-colors cursor-pointer ${colorClasses[color]}`}>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {description}
                </p>
            </div>
        </Link>
    );
}
