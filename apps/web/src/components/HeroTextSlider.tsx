'use client';

import { useState, useEffect } from 'react';

const slides = [
    {
        heading: "Fresh, Affordable Veg Pizzas Delivered Across Prabhat Nagar, Meerut",
        subheading: "Order delicious pizzas, burgers, sandwiches, and snacks from The Pizza Box — rated 4.8★ by 40+ customers on Google. Fast delivery, premium ingredients, and pocket-friendly prices.",
        bgClass: "bg-gradient-to-r from-black/90 via-black/60 to-transparent",
        textClass: "text-white",
        bgImage: "/pizza-shop-bg.png",
        align: "left"
    },
    {
        heading: "Craving Something Cheesy? Try Our New Cheese Volcano Pizza!",
        subheading: "Exploding with molten cheese in the center. Perfect for dipping your crusts. A cheese lover's dream come true!",
        bgClass: "bg-gradient-to-r from-black/90 via-black/60 to-transparent",
        textClass: "text-white",
        bgImage: "/cheese-volcano-bg.jpg",
        align: "left"
    },
    {
        heading: "Late Night Cravings? We Deliver Until 11 PM!",
        subheading: "Hungry at night? We've got you covered. Hot and fresh pizzas delivered straight to your door, even late at night.",
        bgClass: "bg-gradient-to-r from-black/90 via-black/60 to-transparent", // Gradient to show image on right
        textClass: "text-white",
        bgImage: "/late-night-pizza-bg.jpg",
        align: "left"
    }
];

export default function HeroTextSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [prevSlide, setPrevSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPrevSlide(currentSlide);
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [currentSlide]);

    const goToSlide = (index: number) => {
        setPrevSlide(currentSlide);
        setCurrentSlide(index);
    };

    return (
        <div className="relative w-full overflow-hidden min-h-[350px] md:min-h-[400px]">
            {slides.map((slide, index) => {
                let positionClass = 'translate-x-full z-0'; // Default: waiting on right
                let transitionClass = ''; // Default: no transition (instant jump)

                if (index === currentSlide) {
                    positionClass = 'translate-x-0 z-10'; // Active: center
                    transitionClass = 'transition-transform duration-700 ease-in-out';
                } else if (index === prevSlide) {
                    positionClass = '-translate-x-full z-10'; // Prev: exit to left
                    transitionClass = 'transition-transform duration-700 ease-in-out';
                }

                const alignClass = slide.align === 'left'
                    ? 'items-start text-left pl-6 md:pl-20 pr-4'
                    : 'items-center text-center px-4';

                return (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full flex flex-col justify-center py-12 ${alignClass} ${slide.bgClass} ${positionClass} ${transitionClass}`}
                        style={slide.bgImage ? {
                            backgroundImage: `url(${slide.bgImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundBlendMode: 'overlay'
                        } : undefined}
                    >
                        <h1 className={`font-bold mb-3 md:mb-4 max-w-4xl ${slide.textClass}`} style={{ fontSize: 'clamp(1rem, 3.5vw, 3rem)', lineHeight: '1.2' }}>
                            {slide.heading}
                        </h1>
                        <p className={`max-w-2xl ${slide.align === 'left' ? 'mr-auto' : 'mx-auto'} ${slide.textClass} opacity-90`} style={{ fontSize: 'clamp(0.75rem, 1.8vw, 1.125rem)', lineHeight: '1.5' }}>
                            {slide.subheading}
                        </p>
                    </div>
                );
            })}

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
