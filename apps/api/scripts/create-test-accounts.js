const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const testAccounts = [
    {
        name: 'Test Customer 1',
        email: 'test1@thepizzabox.com',
        phone: '+919999999991',
        password: 'test123',
        addresses: [
            { street: '123, MG Road', city: 'Meerut', zip: '250001' },
            { street: '456, Civil Lines', city: 'Meerut', zip: '250002' },
        ]
    },
    {
        name: 'Test Customer 2',
        email: 'test2@thepizzabox.com',
        phone: '+919999999992',
        password: 'test123',
        addresses: [
            { street: '789, Shastri Nagar', city: 'Meerut', zip: '250001' },
        ]
    },
    {
        name: 'Test Customer 3',
        email: 'test3@thepizzabox.com',
        phone: '+919999999993',
        password: 'test123',
        addresses: [
            { street: '101, Saket', city: 'Meerut', zip: '250003' },
            { street: '202, Shivaji Nagar', city: 'Meerut', zip: '250004' },
        ]
    },
    {
        name: 'Test Customer 4',
        email: 'test4@thepizzabox.com',
        phone: '+919999999994',
        password: 'test123',
        addresses: [
            { street: '303, Begum Bridge', city: 'Meerut', zip: '250001' },
        ]
    },
    {
        name: 'Test Customer 5',
        email: 'test5@thepizzabox.com',
        phone: '+919999999995',
        password: 'test123',
        addresses: [
            { street: '404, Kanker Khera', city: 'Meerut', zip: '250002' },
            { street: '505, Lalkurti', city: 'Meerut', zip: '250003' },
        ]
    },
    {
        name: 'Test Customer 6',
        email: 'test6@thepizzabox.com',
        phone: '+919999999996',
        password: 'test123',
        addresses: [
            { street: '606, Garh Road', city: 'Meerut', zip: '250005' },
        ]
    },
    {
        name: 'Test Customer 7',
        email: 'test7@thepizzabox.com',
        phone: '+919999999997',
        password: 'test123',
        addresses: [
            { street: '707, Delhi Road', city: 'Meerut', zip: '250001' },
        ]
    },
    {
        name: 'Test Customer 8',
        email: 'test8@thepizzabox.com',
        phone: '+919999999998',
        password: 'test123',
        addresses: [
            { street: '808, Hapur Road', city: 'Meerut', zip: '250002' },
            { street: '909, Roorkee Road', city: 'Meerut', zip: '250003' },
        ]
    },
    {
        name: 'Test Customer 9',
        email: 'test9@thepizzabox.com',
        phone: '+919999999999',
        password: 'test123',
        addresses: [
            { street: '1010, Partapur', city: 'Meerut', zip: '250004' },
        ]
    },
    {
        name: 'Test Customer 10',
        email: 'test10@thepizzabox.com',
        phone: '+919999999990',
        password: 'test123',
        addresses: [
            { street: '1111, Modipuram', city: 'Meerut', zip: '250005' },
            { street: '1212, Mawana Road', city: 'Meerut', zip: '250001' },
        ]
    },
];

async function createTestAccounts() {
    console.log('🚀 Creating 10 test accounts with addresses...\n');

    for (const account of testAccounts) {
        try {
            // Check if user exists
            const existing = await prisma.user.findUnique({
                where: { email: account.email }
            });

            if (existing) {
                console.log(`⚠️  ${account.name} already exists, skipping...`);
                continue;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(account.password, 10);

            // Create user with addresses
            const user = await prisma.user.create({
                data: {
                    name: account.name,
                    email: account.email,
                    phone: account.phone,
                    password: hashedPassword,
                    role: 'CUSTOMER',
                    addresses: {
                        create: account.addresses
                    }
                },
                include: {
                    addresses: true
                }
            });

            console.log(`✅ Created: ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Phone: ${user.phone}`);
            console.log(`   Password: test123`);
            console.log(`   Addresses: ${user.addresses.length}`);
            user.addresses.forEach((addr, i) => {
                console.log(`     ${i + 1}. ${addr.street}, ${addr.city} - ${addr.zip}`);
            });
            console.log('');
        } catch (error) {
            console.error(`❌ Error creating ${account.name}:`, error.message);
        }
    }

    await prisma.$disconnect();
    console.log('\n✅ All test accounts created!');
    console.log('\n📋 SUMMARY:');
    console.log('   All accounts use password: test123');
    console.log('   Phone numbers: +919999999991 to +919999999990');
    console.log('   Each account has 1-2 saved addresses');
    console.log('   All addresses use Meerut pincodes (250001-250005)');
}

createTestAccounts().catch(console.error);
