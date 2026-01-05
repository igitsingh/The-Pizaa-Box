import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdminPassword() {
    try {
        // Hash the new password
        const newPassword = 'adminpassword';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the admin user
        const updated = await prisma.user.updateMany({
            where: {
                email: 'admin@thepizzabox.com'
            },
            data: {
                password: hashedPassword,
                role: 'ADMIN' // Ensure role is ADMIN
            }
        });

        console.log('✅ Admin password reset successfully');
        console.log(`Updated ${updated.count} user(s)`);
        console.log('');
        console.log('Admin Credentials:');
        console.log('Email: admin@thepizzabox.com');
        console.log('Password: adminpassword');
    } catch (error) {
        console.error('❌ Error resetting admin password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdminPassword();
