'use client';

import Link from 'next/link';
import Image from 'next/image';

const categories = [
    { id: 'pizzas', name: 'Pizzas', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80' },
    { id: 'burgers', name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
    { id: 'sandwiches', name: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80' },
    { id: 'beverages', name: 'Drinks', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80' },
    { id: 'desserts', name: 'Desserts', image: '/dessert-icon.png' },
    { id: 'deals', name: 'Deals', image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500&q=80' },
    { id: 'chicken', name: 'Chicken', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&q=80' },
    { id: 'sides', name: 'Sides', image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=500&q=80' },
    { id: 'new', name: 'New', image: 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=500&q=80' },
    { id: 'pasta', name: 'Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80' },
];

export default function CategorySlider() {
    return (
        <div className="py-8">
            <h2 className="font-bold mb-4 md:mb-6 px-4 text-gray-800" style={{ fontSize: 'clamp(1.125rem, 3vw, 1.25rem)' }}>What are you craving?</h2>
            <div className="grid grid-cols-4 gap-x-2 gap-y-6 px-2 py-4 md:flex md:overflow-x-auto md:gap-6 md:px-4 md:scrollbar-hide">
                {categories.map((cat) => (
                    <Link key={cat.id} href={`/${cat.id}`} className="flex flex-col items-center group cursor-pointer md:min-w-[100px]">
                        <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full mb-2 md:mb-3 shadow-md group-hover:shadow-lg transition-all group-hover:scale-105 border-2 ${cat.id === 'deals' ? 'border-transparent saber-border' : 'border-white ring-2 ring-gray-100 overflow-hidden'}`}>
                            <Image
                                src={cat.image}
                                alt={cat.name}
                                width={100}
                                height={100}
                                className={`w-full h-full object-cover ${cat.id !== 'deals' ? '' : 'rounded-full'}`}
                            />
                        </div>
                        <span className={`text-xs md:text-sm font-bold transition-colors text-center ${cat.id === 'deals' ? 'text-yellow-600' : 'text-gray-700 group-hover:text-primary'}`}>{cat.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
