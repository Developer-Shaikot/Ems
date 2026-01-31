import Link from 'next/link';
import { ArrowRight, Users, Calendar, FileText, BarChart } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Employee Management System
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        Streamline your workforce management with our comprehensive solution
                    </p>
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Get Started
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                    <FeatureCard
                        icon={<Users className="w-8 h-8" />}
                        title="Employee Management"
                        description="Manage employee records, departments, and organizational structure"
                    />
                    <FeatureCard
                        icon={<Calendar className="w-8 h-8" />}
                        title="Attendance Tracking"
                        description="Track employee attendance with check-in/check-out functionality"
                    />
                    <FeatureCard
                        icon={<FileText className="w-8 h-8" />}
                        title="Leave Management"
                        description="Handle leave requests and approval workflows efficiently"
                    />
                    <FeatureCard
                        icon={<BarChart className="w-8 h-8" />}
                        title="Analytics & Reports"
                        description="Get insights with comprehensive analytics and reporting"
                    />
                </div>
            </div>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-blue-600 dark:text-blue-400 mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
    );
}
