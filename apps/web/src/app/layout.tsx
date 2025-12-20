import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { Toaster } from 'sonner';
import SnowEffect from "@/components/SnowEffect";
import HolidayBanner from "@/components/HolidayBanner";
import CallbackButton from '@/components/CallbackButton';
import WhatsAppButton from '@/components/WhatsAppButton';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Pizza Box – Best Veg Pizza in Prabhat Nagar Meerut | Order Online",
  description: "Order veg pizzas, burgers, sandwiches & snacks from The Pizza Box, Prabhat Nagar Meerut. Rated 4.8★ on Google. Fresh, affordable & fast delivery.",
  openGraph: {
    title: "The Pizza Box – Best Pizza in Meerut",
    description: "Fresh & affordable veg pizzas delivered across Prabhat Nagar. Order online!",
    url: "https://thepizzabox.in",
    type: "website",
    siteName: "The Pizza Box",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Pizza Box – Best Pizza in Meerut",
    description: "Fresh & affordable veg pizzas delivered across Prabhat Nagar. Order online!",
  },
  keywords: [
    "pizza meerut",
    "best pizza prabhat nagar",
    "veg pizza meerut",
    "order pizza online meerut",
    "the pizza box meerut",
    "cheap pizza meerut"
  ],
  authors: [{ name: "The Pizza Box" }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "The Pizza Box",
    "image": "https://thepizzabox.in/logo.png", // Assuming logo path
    "url": "https://thepizzabox.in",
    "telephone": "+911234567890", // Placeholder, should be updated if real number known
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Prabhat Nagar",
      "addressLocality": "Meerut",
      "addressRegion": "UP",
      "postalCode": "250001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.9845, // Approx Meerut coordinates
      "longitude": 77.7064
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "11:00",
      "closes": "23:00"
    },
    "menu": "https://thepizzabox.in/menu",
    "servesCuisine": "Pizza, Fast Food, Vegetarian",
    "priceRange": "₹169 - ₹500",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "40"
    }
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <JsonLd data={organizationSchema} />
        <SnowEffect />
        <HolidayBanner />
        <Navbar />
        <main className="min-h-screen bg-gray-50">{children}</main>
        <Footer />
        <CallbackButton />
        <WhatsAppButton />
        <Toaster />
      </body>
    </html>
  );
}
