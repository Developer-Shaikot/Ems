export enum Role {
    ADMIN = 'ADMIN',
    HR = 'HR',
    EMPLOYEE = 'EMPLOYEE',
}

export enum LeaveType {
    SICK = 'SICK',
    CASUAL = 'CASUAL',
    ANNUAL = 'ANNUAL',
    MATERNITY = 'MATERNITY',
    PATERNITY = 'PATERNITY',
    UNPAID = 'UNPAID',
}

export enum LeaveStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export enum AttendanceStatus {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT',
    LATE = 'LATE',
    HALF_DAY = 'HALF_DAY',
}
