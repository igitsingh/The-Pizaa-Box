const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const userCount = await prisma.user.count();
        const orderCount = await prisma.order.count();
        const itemCount = await prisma.item.count();
        const users = await prisma.user.findMany({ select: { name: true, email: true, role: true } });
        console.log(JSON.stringify({ userCount, orderCount, itemCount, users }));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
