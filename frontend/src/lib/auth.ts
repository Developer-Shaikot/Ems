import api from './api';

export interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'HR' | 'EMPLOYEE';
    employee?: {
        id: string;
        name: string;
        position: string;
        department: {
            id: string;
            name: string;
        };
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    role?: 'ADMIN' | 'HR' | 'EMPLOYEE';
}

export interface AuthResponse {
    user: User;
    token: string;
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    },

    async register(registerData: RegisterData): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/register', registerData);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    },

    async getCurrentUser(): Promise<User> {
        const { data } = await api.get<User>('/auth/me');
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
    },

    getStoredUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    },

    hasRole(role: 'ADMIN' | 'HR' | 'EMPLOYEE'): boolean {
        const user = this.getStoredUser();
        return user?.role === role;
    },

    hasAnyRole(roles: ('ADMIN' | 'HR' | 'EMPLOYEE')[]): boolean {
        const user = this.getStoredUser();
        return user ? roles.includes(user.role) : false;
    },
};
