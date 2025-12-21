const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🔄 Checking database persistence...');

        // 1. Check if our test user exists from a previous run
        const existingCheck = await prisma.user.findUnique({
            where: { email: 'persistence-check@audit.com' }
        });

        if (existingCheck) {
            console.log('✅ PERSISTENCE CONFIRMED: Found existing test record from previous run.');
            console.log(`   User ID: ${existingCheck.id}`);
            console.log(`   Created At: ${existingCheck.createdAt}`);
        } else {
            console.log('⚠️ No existing test record found. Creating one now...');
            const newUser = await prisma.user.create({
                data: {
                    name: 'Persistence Check',
                    email: 'persistence-check@audit.com',
                    role: 'ADMIN',
                    phone: '0000000000'
                }
            });
            console.log('✅ Created new persistence test record.');
            console.log('👉 PLEASE RUN THIS SCRIPT AGAIN TO VERIFY IT PERSISTS.');
        }

        // 2. Count total orders to verify production data
        const orderCount = await prisma.order.count();
        console.log(`📊 Current Order Count: ${orderCount}`);

    } catch (e) {
        console.error('❌ Database connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
