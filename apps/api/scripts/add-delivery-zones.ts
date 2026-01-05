import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addDeliveryZones() {
    try {
        // Add Meerut pincodes
        const zones = [
            { pincode: '250001', area: 'Meerut Cantt', deliveryFee: 0, isActive: true },
            { pincode: '250002', area: 'Meerut City', deliveryFee: 0, isActive: true },
            { pincode: '250003', area: 'Meerut', deliveryFee: 0, isActive: true },
            { pincode: '250004', area: 'Meerut', deliveryFee: 0, isActive: true },
            { pincode: '250005', area: 'Meerut', deliveryFee: 0, isActive: true },
        ];

        for (const zone of zones) {
            await prisma.deliveryZone.upsert({
                where: { pincode: zone.pincode },
                update: zone,
                create: zone,
            });
            console.log(`✅ Added/Updated delivery zone: ${zone.pincode} - ${zone.area}`);
        }

        console.log('\n✅ All delivery zones configured!');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

addDeliveryZones();
