'use client';

import { useState } from 'react';
import { Star, Quote, Trophy, Medal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

interface Review {
    id: number;
    name: string;
    rating: number;
    text: string;
    date: string;
    photo?: string;
    badge?: string;
}


const reviews = [
    {
        id: 1,
        name: 'Karan Yadav',
        rating: 5,
        text: 'I recently visited [The Pizza Box] and had an amazing experience! The pizza was cooked to perfection, with a crispy crust and flavorful toppings. The service was also top-notch, with friendly and attentive staff. Highly recommend!',
        date: '11 months ago',
        photo: '/reviewers/karan-yadav.png',
        badge: 'Top Reviewer'
    },
    {
        id: 2,
        name: 'Bharat Yadav',
        rating: 5,
        text: 'The Pizza Box in Prabhat Nagar, Meerut offers a solid pizza experience with a variety of options for pizza lovers. Known for its affordable pricing and diverse menu, it features items like Paneer Cheese Pizza, Corn Cheese Pizza, and Peppy Paneer Pizza. If you\'re looking for budget-friendly yet flavorful pizzas, this place is worth checking out.',
        date: 'a year ago',
        photo: '/reviewers/bharat-yadav.png',
        badge: 'Top Reviewer'
    },
    {
        id: 3,
        name: 'Angel Aarya',
        rating: 5,
        text: 'The taste of pizza and sandwich are fabulous. You can definitely visit here. I love this place😍😋',
        date: '10 months ago',
        photo: '/reviewers/angel-aarya.png',
        badge: 'Top Reviewer'
    },
    {
        id: 4,
        name: 'Yaduvanshi Vipin',
        rating: 5,
        text: 'The food was so Delicious and the service was really Great. The food and service quality was truly amazing and great ambiance for every age group.',
        date: 'a year ago',
        photo: '/reviewers/yaduvanshi-vipin.png',
        badge: 'Local Guide'
    },
    {
        id: 5,
        name: 'Shantanu Singh',
        rating: 5,
        text: 'Loved the food and service, great atmosphere and vibe. Must recommend spot for hangout with friends and family!',
        date: 'a year ago',
    },
    {
        id: 6,
        name: 'Prity Yadav',
        rating: 5,
        text: 'The pizza was cooked to perfection and the topping were fresh and flavourful. This is best place for pizza in meerut and services also good.',
        date: 'a year ago',
    },
    {
        id: 7,
        name: 'Prashant Sharma',
        rating: 5,
        text: 'The Pizza Box is a gem in Prabhat Nagar Meerut. From the moment you walk in, the cozy atmosphere and friendly staff make you feel right at home.',
        date: 'a year ago',
    },
    {
        id: 8,
        name: 'Rohit Kumar',
        rating: 5,
        text: 'Best pizza in Meerut! Fresh ingredients, generous toppings, and amazing taste. The garlic bread and pasta are also must-try items.',
        date: '8 months ago',
    },
    {
        id: 9,
        name: 'Anjali Verma',
        rating: 5,
        text: 'Absolutely loved the thin crust pizza with extra cheese. The staff is very polite and the delivery is always on time. Highly recommended!',
        date: '6 months ago',
    },
    {
        id: 10,
        name: 'Vishal Singh',
        rating: 5,
        text: 'Great quality food at reasonable prices. The farmhouse pizza and choco lava cake are my favorites. Perfect spot for family dinners.',
        date: '9 months ago',
    },
    {
        id: 11,
        name: 'Neha Gupta',
        rating: 5,
        text: 'The paneer pizza is outstanding! Fresh vegetables, premium quality cheese, and excellent service. This is our go-to place for pizza cravings.',
        date: '7 months ago',
    },
    {
        id: 12,
        name: 'Amit Tyagi',
        rating: 5,
        text: 'Fantastic experience every time! The burgers and sandwiches are equally good. Staff is courteous and the ambiance is perfect for hangouts.',
        date: '5 months ago',
    },
];

export default function ReviewsSection() {
    const [activeSlide, setActiveSlide] = useState(0);

    return (
        <section className="py-20 px-4 relative overflow-hidden">
            {/* Premium Background */}
            <div className="absolute inset-0 bg-slate-900">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-orange-500 opacity-20 blur-[100px]"></div>
                <div className="absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <span className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full text-[8px] md:text-xs font-bold uppercase tracking-wider border border-yellow-500/20 flex items-center gap-1">
                                <Trophy className="w-2.5 h-2.5 md:w-3 md:h-3" /> Customer Favorites
                            </span>
                        </div>
                        <h2 className="font-bold text-white mb-2 tracking-tight" style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}>
                            {activeSlide === 0 ? (
                                <>Wall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Love</span></>
                            ) : (
                                <>Box of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Love</span></>
                            )}
                        </h2>

                    </div>

                    {/* Google Badge with Rating */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl rounded-xl md:rounded-2xl p-2 md:p-4 flex items-center gap-2 md:gap-3 transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center gap-2">
                            <div className="bg-white rounded-full p-1 md:p-1.5 shadow-lg">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                                    alt="Google"
                                    className="w-4 h-4 md:w-6 md:h-6"
                                />
                            </div>
                            <div>
                                <div className="flex items-baseline gap-1">
                                    <span className="font-bold text-white" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>4.8</span>
                                    <span className="text-[10px] md:text-xs text-gray-400">Ratings</span>
                                </div>
                            </div>
                        </div>
                        <div className="border-l border-white/20 pl-2 md:pl-3 space-y-0.5">
                            <p className="text-[10px] md:text-xs font-bold text-white tracking-wide">EXCELLENT</p>
                            <div className="flex gap-0.5">
                                {[...Array(4)].map((_, i) => (
                                    <Star key={i} className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                                ))}
                                <div className="relative w-2.5 h-2.5 md:w-3.5 md:h-3.5">
                                    <Star className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-yellow-400 drop-shadow-sm" />
                                    <Star className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 fill-yellow-400 text-yellow-400 drop-shadow-sm absolute top-0 left-0" style={{ clipPath: 'inset(0 20% 0 0)' }} />
                                </div>
                            </div>
                            <p className="text-[8px] md:text-[10px] text-gray-400">Based on 50+ Reviews</p>
                        </div>
                    </div>
                </div>

                {/* Content Slides */}
                <div className="min-h-[400px] transition-all duration-500 ease-in-out">
                    {activeSlide === 0 ? (
                        /* Wall of Love - Reviews Carousel */
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full animate-in fade-in slide-in-from-right-8 duration-500"
                        >
                            <CarouselContent className="-ml-2 md:-ml-4">
                                {reviews.map((review) => (
                                    <CarouselItem key={review.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                        <div className="h-full px-2 md:px-0">
                                            <Card className="h-full bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 group border-none">
                                                <CardContent className="p-4 md:p-6 flex flex-col h-full relative">
                                                    <Quote className="absolute top-3 right-3 md:top-6 md:right-6 w-6 h-6 md:w-8 md:h-8 text-gray-100 group-hover:text-orange-50 transition-colors" />

                                                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                                        {review.photo ? (
                                                            <img
                                                                src={review.photo}
                                                                alt={review.name}
                                                                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-md"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-md">
                                                                {review.name.charAt(0)}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-sm md:text-base">{review.name}</p>
                                                            <p className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1">
                                                                <Medal className="w-2.5 h-2.5 md:w-3 md:h-3 text-yellow-500" /> {review.badge || 'Top Reviewer'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex mb-2 md:mb-4">
                                                        {[...Array(review.rating)].map((_, i) => (
                                                            <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                                                        ))}
                                                    </div>

                                                    <p className="text-gray-700 text-xs md:text-sm leading-relaxed flex-grow italic line-clamp-6 md:line-clamp-none">
                                                        "{review.text}"
                                                    </p>

                                                    <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100 flex justify-between items-center">
                                                        <span className="text-[10px] md:text-xs text-gray-400">{review.date}</span>
                                                        <img
                                                            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                                                            alt="Google"
                                                            className="w-3 h-3 md:w-4 md:h-4 opacity-50 grayscale group-hover:grayscale-0 transition-all"
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <div className="hidden md:block absolute -right-12 top-1/2 -translate-y-1/2">
                                <CarouselNext className="bg-white/10 hover:bg-white/20 text-white border-none" />
                            </div>
                            <div className="hidden md:block absolute -left-12 top-1/2 -translate-y-1/2">
                                <CarouselPrevious className="bg-white/10 hover:bg-white/20 text-white border-none" />
                            </div>
                        </Carousel>
                    ) : (
                        /* Box of Love - Features Grid */
                        <div className="w-full animate-in fade-in slide-in-from-right-8 duration-500 h-full">
                            <Card className="border-none shadow-none bg-transparent h-full flex flex-col justify-center">
                                <CardContent className="p-4 md:p-8 lg:p-12">
                                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-6">
                                        {[
                                            { icon: '🍕', text: '100% fresh ingredients & crispy crusts' },
                                            { icon: '💰', text: 'Affordable pricing (₹1-400 per person)' },
                                            { icon: '⭐', text: 'Top-rated on Google (4.8⭐ with 50+ reviews)' },
                                            { icon: '🍔', text: 'Wide menu — pizzas, burgers, sandwiches, snacks' },
                                            { icon: '🌙', text: 'Open till 11 PM for late-night cravings' },
                                            { icon: '🎉', text: 'Perfect for small parties & family hangouts' }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white/80 backdrop-blur-sm p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all group flex flex-col items-center text-center gap-2 md:gap-3">
                                                <div className="text-2xl md:text-3xl lg:text-4xl group-hover:scale-110 transition-transform bg-orange-100 w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center">{item.icon}</div>
                                                <p className="text-gray-700 font-medium leading-relaxed text-[10px] md:text-xs lg:text-sm">{item.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-2 mt-12">
                    {[0, 1].map((index) => (
                        <button
                            key={index}
                            onClick={() => setActiveSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${activeSlide === index
                                ? 'w-8 bg-orange-500'
                                : 'w-2 bg-white/20 hover:bg-white/40'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
