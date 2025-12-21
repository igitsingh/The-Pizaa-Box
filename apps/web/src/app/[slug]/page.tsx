import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MenuCard from '@/components/MenuCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

// Types
interface ItemOption {
    id: string;
    name: string;
    choices: {
        id: string;
        name: string;
        price: number;
    }[];
}

interface ItemAddon {
    id: string;
    name: string;
    price: number;
}

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isVeg: boolean;
    isSpicy: boolean;
    isBestSeller: boolean;
    options?: ItemOption[];
    addons?: ItemAddon[];
    slug?: string;
    seoTitle?: string;
    seoDescription?: string;
    altText?: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    seoTitle?: string;
    seoDescription?: string;
    items: MenuItem[];
}

interface Location {
    id: string;
    name: string;
    slug: string;
    seoTitle?: string;
    seoDescription?: string;
    content?: string;
}

// Fetchers
async function getCategory(slug: string): Promise<Category | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/menu/categories/${slug}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
}

async function getLocation(slug: string): Promise<Location | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/locations/${slug}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Error fetching location:', error);
        return null;
    }
}

// Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategory(slug);
    const location = await getLocation(slug);

    if (!category && !location) {
        // Debugging
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
        return {
            title: 'Debug: Not Found',
            description: `Slug: ${slug}, API: ${apiUrl}`,
        };
    }
    if (category) {
        return {
            title: category.seoTitle || `${category.name} Delivery in Meerut | The Pizza Box`,
            description: category.seoDescription || `Order delicious ${category.name} from The Pizza Box.`,
            alternates: { canonical: `/${category.slug}` },
            openGraph: {
                title: category.seoTitle || category.name,
                description: category.seoDescription,
                url: `/${category.slug}`,
            }
        };
    }

    if (location) {
        return {
            title: location.seoTitle || `Pizza Delivery in ${location.name} | The Pizza Box`,
            description: location.seoDescription || `Best pizza delivery in ${location.name}. Order now!`,
            alternates: { canonical: `/${location.slug}` },
            openGraph: {
                title: location.seoTitle || location.name,
                description: location.seoDescription,
                url: `/${location.slug}`,
            }
        };
    }

    return { title: 'Not Found' };
}

// Page Component
export default async function SlugPage(props: any) {
    const params = await props.params;
    const slug = params?.slug;

    const category = slug ? await getCategory(slug) : null;
    const location = slug ? await getLocation(slug) : null;

    if (category) {
        // Render Category Page
        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: category.name,
            description: category.seoDescription,
            url: `https://thepizzabox.in/${category.slug}`,
            mainEntity: {
                '@type': 'ItemList',
                itemListElement: category.items.map((item, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    item: {
                        '@type': 'Product',
                        name: item.name,
                        description: item.description,
                        image: item.image,
                        offers: {
                            '@type': 'Offer',
                            price: item.price,
                            priceCurrency: 'INR',
                            availability: 'https://schema.org/InStock',
                        },
                    },
                })),
            },
        };

        return (
            <div className="min-h-screen bg-slate-50 pb-20">
                <JsonLd data={jsonLd} />
                <div className="bg-white shadow-sm sticky top-0 z-10">
                    <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon">
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold text-slate-900">{category.name}</h1>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">{category.name} Menu</h2>
                            <p className="text-slate-600 max-w-2xl">
                                {category.seoDescription || `Explore our wide range of ${category.name}.`}
                            </p>
                        </div>
                        <div className="bg-orange-600 text-white px-6 py-3 rounded-xl shadow-lg animate-pulse">
                            <p className="text-xs uppercase font-bold tracking-widest">Limited Offer</p>
                            <p className="font-bold">Flat 20% OFF: NEWYEAR2025</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.items.map((item) => (
                            <MenuCard key={item.id} item={{ ...item, options: item.options || [], addons: item.addons || [] }} />
                        ))}
                    </div>
                    <div className="mt-16 prose prose-slate max-w-none bg-white p-8 rounded-2xl shadow-sm">
                        <h3>Why Order {category.name} from The Pizza Box?</h3>
                        <p>The Pizza Box offers the best {category.name} in Prabhat Nagar, Meerut.</p>
                    </div>
                </div>
            </div>
        );
    }





    if (location) {
        // Render Location Page
        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Place',
            name: location.name,
            description: location.seoDescription,
            url: `https://thepizzabox.in/${location.slug}`,
        };

        return (
            <div className="min-h-screen bg-slate-50 pb-20">
                <JsonLd data={jsonLd} />
                <div className="bg-white shadow-sm sticky top-0 z-10">
                    <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon">
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold text-slate-900">{location.name}</h1>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm prose prose-slate max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: location.content || '' }} />
                    </div>
                    <div className="mt-8">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Popular in {location.name}</h3>
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                            <p className="text-orange-800">Check out our full menu to see what we deliver to {location.name}!</p>
                            <Link href="/">
                                <Button className="mt-2 bg-orange-600 hover:bg-orange-700 text-white">View Full Menu</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    notFound();
}
