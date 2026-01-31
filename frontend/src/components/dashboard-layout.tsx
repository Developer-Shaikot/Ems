'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authService, User } from '@/lib/auth';
import ThemeToggle from '@/components/theme-toggle';
import {
    LayoutDashboard,
    Users,
    Building2,
    Calendar,
    FileText,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from 'lucide-react';

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    roles?: ('ADMIN' | 'HR' | 'EMPLOYEE')[];
}

const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees', href: '/dashboard/employees', icon: Users, roles: ['ADMIN', 'HR'] },
    { name: 'Departments', href: '/dashboard/departments', icon: Building2, roles: ['ADMIN', 'HR'] },
    { name: 'Attendance', href: '/dashboard/attendance', icon: Calendar },
    { name: 'Leave Requests', href: '/dashboard/leaves', icon: FileText },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setUser(authService.getStoredUser());
    }, []);

    const filteredNavigation = navigation.filter(
        (item) => !item.roles || (user && item.roles.includes(user.role))
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            EMS
                        </h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {filteredNavigation.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium">{item.name}</span>
                                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User info */}
                    {user && (
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {user.employee?.name || user.email}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user.employee?.position || user.role}
                                </p>
                            </div>
                            <button
                                onClick={() => authService.logout()}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between px-4 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-4 ml-auto">
                            <ThemeToggle />
                            {user && (
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {user.employee?.name || user.email}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {user.role}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
