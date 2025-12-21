const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('📦 Prepping Demo Orders & Users...');

    // 1. Ensure Repeat Customer Exists (The "Test Account" user)
    // Phone: 9999999999 is crucial for the "Login Bypass"
    const repeatUser = await prisma.user.upsert({
        where: { phone: '9999999999' },
        update: { name: 'Rahul Sharma (VIP)' },
        create: {
            name: 'Rahul Sharma (VIP)',
            email: 'rahul.vip@demo.com',
            phone: '9999999999',
            role: 'CUSTOMER',
            isVIP: true
        }
    });

    console.log(`✅ Repeat Customer Ready: ${repeatUser.name}`);

    // 2. Fetch a few items for order creation
    const items = await prisma.item.findMany({ take: 3 });
    if (items.length === 0) {
        console.error('❌ No items found! Run menu prep first.');
        return;
    }

    // 3. Create Orders

    // Order A: DELIVERED (Past success story)
    // "Look, this order was delivered perfectly 2 hours ago."
    const orderDelivered = await prisma.order.create({
        data: {
            user: { connect: { id: repeatUser.id } },
            customerName: repeatUser.name,
            customerPhone: repeatUser.phone,
            total: 549,
            subtotal: 500,
            tax: 25,
            deliveryFee: 24,
            status: 'DELIVERED',
            paymentMethod: 'UPI',
            paymentStatus: 'PAID',
            invoiceNumber: 'INV-202512-00001',
            invoiceGeneratedAt: new Date(),
            items: {
                create: [
                    {
                        itemId: items[0].id,
                        name: items[0].name,
                        price: items[0].price,
                        quantity: 1
                    }
                ]
            }
        }
    });
    console.log('✅ Created DELIVERED Order');

    // Order B: PREPARING (Action happening NOW)
    // "Kitchen is working on this right now."
    const orderPreparing = await prisma.order.create({
        data: {
            user: { connect: { id: repeatUser.id } },
            customerName: repeatUser.name,
            customerPhone: repeatUser.phone,
            total: 899,
            status: 'PREPARING',
            paymentMethod: 'COD',
            paymentStatus: 'PENDING',
            items: {
                create: [
                    {
                        itemId: items[1].id,
                        name: items[1].name,
                        price: items[1].price,
                        quantity: 2
                    }
                ]
            }
        }
    });
    console.log('✅ Created PREPARING Order');

    // Order C: SCHEDULED (Future revenue secured)
    // "And this order is for tonight's party, already booked."
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 4);

    const orderScheduled = await prisma.order.create({
        data: {
            customerName: 'Guest: Amit Kumar',
            customerPhone: '9876543210',
            total: 1200,
            status: 'SCHEDULED',
            orderType: 'SCHEDULED',
            scheduledFor: futureDate,
            paymentMethod: 'UPI',
            paymentStatus: 'PAID',
            items: {
                create: [
                    {
                        itemId: items[0].id,
                        name: items[0].name,
                        price: items[0].price,
                        quantity: 3
                    }
                ]
            }
        }
    });
    console.log('✅ Created SCHEDULED Order');

    // 4. Add Feedback for the Delivered Order
    await prisma.feedback.create({
        data: {
            orderId: orderDelivered.id,
            rating: 5,
            review: 'Amazing pizza! Arrived hot.',
            userId: repeatUser.id
        }
    });
    console.log('✅ Created Feedback');

    console.log('🎉 Demo Data Ready!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
