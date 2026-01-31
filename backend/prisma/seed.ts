import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@ems.com' },
        update: {},
        create: {
            email: 'admin@ems.com',
            password: adminPassword,
            role: 'ADMIN',
        },
    });
    console.log('✅ Created admin user:', admin.email);

    // Create HR user
    const hrPassword = await bcrypt.hash('hr123', 10);
    const hr = await prisma.user.upsert({
        where: { email: 'hr@ems.com' },
        update: {},
        create: {
            email: 'hr@ems.com',
            password: hrPassword,
            role: 'HR',
        },
    });
    console.log('✅ Created HR user:', hr.email);

    // Create departments
    const engineering = await prisma.department.upsert({
        where: { name: 'Engineering' },
        update: {},
        create: {
            name: 'Engineering',
            description: 'Software development and technical teams',
        },
    });

    const hr_dept = await prisma.department.upsert({
        where: { name: 'Human Resources' },
        update: {},
        create: {
            name: 'Human Resources',
            description: 'Employee management and recruitment',
        },
    });

    const sales = await prisma.department.upsert({
        where: { name: 'Sales' },
        update: {},
        create: {
            name: 'Sales',
            description: 'Sales and business development',
        },
    });

    console.log('✅ Created departments');

    // Create employee user
    const empPassword = await bcrypt.hash('emp123', 10);
    const empUser = await prisma.user.upsert({
        where: { email: 'john.doe@ems.com' },
        update: {},
        create: {
            email: 'john.doe@ems.com',
            password: empPassword,
            role: 'EMPLOYEE',
        },
    });

    // Create employee profile
    const employee = await prisma.employee.upsert({
        where: { email: 'john.doe@ems.com' },
        update: {},
        create: {
            userId: empUser.id,
            name: 'John Doe',
            email: 'john.doe@ems.com',
            phone: '+1234567890',
            position: 'Software Engineer',
            departmentId: engineering.id,
            salary: 75000,
            joinDate: new Date('2024-01-15'),
            dateOfBirth: new Date('1995-05-20'),
            address: '123 Main St, City, Country',
        },
    });

    console.log('✅ Created employee:', employee.name);

    // Create HR employee profile
    const hrEmployee = await prisma.employee.upsert({
        where: { email: 'hr@ems.com' },
        update: {},
        create: {
            userId: hr.id,
            name: 'Sarah Johnson',
            email: 'hr@ems.com',
            phone: '+1234567891',
            position: 'HR Manager',
            departmentId: hr_dept.id,
            salary: 65000,
            joinDate: new Date('2023-06-01'),
            dateOfBirth: new Date('1988-03-15'),
            address: '456 Oak Ave, City, Country',
        },
    });

    console.log('✅ Created HR employee:', hrEmployee.name);

    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('📝 Test Credentials:');
    console.log('-------------------');
    console.log('Admin:');
    console.log('  Email: admin@ems.com');
    console.log('  Password: admin123');
    console.log('');
    console.log('HR Manager:');
    console.log('  Email: hr@ems.com');
    console.log('  Password: hr123');
    console.log('');
    console.log('Employee:');
    console.log('  Email: john.doe@ems.com');
    console.log('  Password: emp123');
    console.log('');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
