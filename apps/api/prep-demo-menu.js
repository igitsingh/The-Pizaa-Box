const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🍕 Preparing Demo Menu...');

    // 1. Clear existing menu items (optional, but safer for a clean demo)
    // We only delete items created for testing, or we can just upsert.
    // For a "Clean & Believable" demo, let's ensure we have exactly what we need.
    // WARNING: "Do NOT reset data" rule applies to *system* resets. 
    // Manually curating menu data is part of "Demo Data Prep".

    // Check if we already have these specific items to avoid dupes
    const check = await prisma.item.findFirst({ where: { slug: 'margherita-classic' } });
    if (check) {
        console.log('✅ Demo menu seems to exist. Skipping creation to preserve data.');
        return;
    }

    // 2. Create Categories if missing
    const cats = ['Pizzas', 'Sides', 'Beverages', 'Combos'];
    const catMap = {};

    for (const name of cats) {
        const cat = await prisma.category.upsert({
            where: { slug: name.toLowerCase() },
            update: {},
            create: { name, slug: name.toLowerCase() }
        });
        catMap[name] = cat.id;
    }

    // 3. Create Pizzas (6 items)
    const pizzaData = [
        { name: 'Margherita Classic', slug: 'margherita-classic', desc: 'Classic cheese and basil', price: 199, type: 'veg' },
        { name: 'Farmhouse Special', slug: 'farmhouse-special', desc: 'Onion, capsicum, tomato & mushroom', price: 299, type: 'veg' },
        { name: 'Paneer Tikka', slug: 'paneer-tikka', desc: 'Spiced paneer with paprika', price: 349, type: 'veg' },
        { name: 'Chicken Pepperoni', slug: 'chicken-pepperoni', desc: 'Classic pepperoni delight', price: 399, type: 'non-veg' },
        { name: 'BBQ Chicken', slug: 'bbq-chicken', desc: 'Smokey BBQ chicken with onions', price: 429, type: 'non-veg' },
        { name: 'Spicy Chicken Wings Pizza', slug: 'spicy-chicken-pizza', desc: 'Hot and spicy chicken chunks', price: 449, type: 'non-veg' }
    ];

    for (const p of pizzaData) {
        await prisma.item.create({
            data: {
                name: p.name,
                slug: p.slug,
                description: p.desc,
                price: p.price,
                categoryId: catMap['Pizzas'],
                isVeg: p.type === 'veg',
                isAvailable: true,
                variants: {
                    create: [
                        { type: 'SIZE', label: 'Regular (7")', price: p.price, isAvailable: true },
                        { type: 'SIZE', label: 'Medium (10")', price: p.price + 150, isAvailable: true },
                        { type: 'SIZE', label: 'Large (13")', price: p.price + 300, isAvailable: true },
                        { type: 'CRUST', label: 'Hand Tossed', price: 0, isAvailable: true },
                        { type: 'CRUST', label: 'Cheese Burst', price: 99, isAvailable: true }
                    ]
                }
            }
        });
    }

    // 4. Sides (2 items)
    await prisma.item.create({
        data: {
            name: 'Garlic Breadsticks',
            slug: 'garlic-breadsticks',
            description: 'Baked to perfection with garlic butter',
            price: 129,
            categoryId: catMap['Sides'],
            isVeg: true
        }
    });

    await prisma.item.create({
        data: {
            name: 'Stuffed Garlic Bread',
            slug: 'stuffed-garlic-bread',
            description: 'Stuffed with jalapenos and corn',
            price: 169,
            categoryId: catMap['Sides'],
            isVeg: true
        }
    });

    // 5. beverages (2 items)
    await prisma.item.create({
        data: { name: 'Coke (500ml)', slug: 'coke-500', price: 60, categoryId: catMap['Beverages'] }
    });
    await prisma.item.create({
        data: { name: 'Sprite (500ml)', slug: 'sprite-500', price: 60, categoryId: catMap['Beverages'] }
    });

    // 6. Combos (2 items)
    await prisma.item.create({
        data: {
            name: 'Meal for 1',
            slug: 'meal-for-1',
            description: '1 Regular Pizza + Garlic Bread + Coke',
            price: 349,
            categoryId: catMap['Combos'],
            isVeg: true
        }
    });
    await prisma.item.create({
        data: {
            name: 'Family Party Combo',
            slug: 'family-combo',
            description: '2 Medium Pizzas + 2 Sides + 2 Cokes',
            price: 999,
            categoryId: catMap['Combos'],
            isVeg: false
        }
    });

    console.log('✅ Menu Prep Complete!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
