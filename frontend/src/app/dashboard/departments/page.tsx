'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Building2, Plus, Edit, Trash2 } from 'lucide-react';
import { authService } from '@/lib/auth';

interface Department {
    id: string;
    name: string;
    description: string | null;
    _count: {
        employees: number;
    };
}

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const user = authService.getStoredUser();

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const { data } = await api.get('/departments');
            setDepartments(data);
        } catch (error) {
            console.error('Failed to fetch departments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingId) {
                await api.patch(`/departments/${editingId}`, formData);
            } else {
                await api.post('/departments', formData);
            }
            setFormData({ name: '', description: '' });
            setEditingId(null);
            setShowForm(false);
            fetchDepartments();
        } catch (error) {
            console.error('Failed to save department:', error);
            alert('Failed to save department');
        }
    };

    const handleEdit = (dept: Department) => {
        setFormData({ name: dept.name, description: dept.description || '' });
        setEditingId(dept.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will affect all employees in this department.')) return;

        try {
            await api.delete(`/departments/${id}`);
            fetchDepartments();
        } catch (error) {
            console.error('Failed to delete department:', error);
            alert('Failed to delete department');
        }
    };

    const isAdminOrHR = user && (user.role === 'ADMIN' || user.role === 'HR');
    const isAdmin = user && user.role === 'ADMIN';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Departments
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage organizational departments
                    </p>
                </div>
                {isAdminOrHR && (
                    <button
                        onClick={() => {
                            setShowForm(!showForm);
                            setEditingId(null);
                            setFormData({ name: '', description: '' });
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Department
                    </button>
                )}
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    {/* ... Form content ... */}
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        {editingId ? 'Edit Department' : 'New Department'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Department Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                {editingId ? 'Update' : 'Create'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setFormData({ name: '', description: '' });
                                }}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Department Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full p-8 text-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : departments.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400">
                        <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No departments found</p>
                    </div>
                ) : (
                    departments.map((dept) => (
                        <div
                            key={dept.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {dept.name}
                                    </h3>
                                    {dept.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            {dept.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Building2 className="w-4 h-4" />
                                        <span>{dept._count.employees} employees</span>
                                    </div>
                                </div>
                            </div>
                            {(isAdminOrHR) && (
                                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => handleEdit(dept)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(dept.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
