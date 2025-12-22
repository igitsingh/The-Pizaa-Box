'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Loader2, PartyPopper, Briefcase, HeartHandshake, Utensils, Star, Users } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import api from '@/lib/api';

export default function ContactPage() {
    const [settings, setSettings] = useState({
        contactPhone: '+91 98765 43210',
        contactEmail: 'hello@thepizzabox.com',
        address: '123 Pizza Street, Food District, Mumbai, Maharashtra 400001',
        operatingHours: '10:00 AM - 11:00 PM'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                if (res.data) {
                    setSettings({
                        contactPhone: res.data.contactPhone || '+91 98765 43210',
                        contactEmail: res.data.contactEmail || 'hello@thepizzabox.com',
                        address: res.data.address || '123 Pizza Street, Food District, Mumbai, Maharashtra 400001',
                        operatingHours: res.data.operatingHours || '10:00 AM - 11:00 PM'
                    });
                }
            } catch (error) {
                console.error('Failed to fetch settings', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-80 z-10"></div>
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")' }}
                ></div>
                <div className="container mx-auto px-4 py-24 relative z-20">
                    <span className="text-orange-500 font-bold tracking-wider uppercase mb-2 block">Business & Catering</span>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-2xl leading-tight">
                        Partner with <span className="text-orange-500">The Pizza Box</span> for Your Next Event
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
                        From intimate gatherings to grand celebrations, we bring the authentic taste of gourmet pizzas to your special occasions.
                    </p>
                    <a href="#enquire" className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-700 transition-transform hover:scale-105 inline-flex items-center gap-2">
                        Get a Quote <Users className="w-5 h-5" />
                    </a>
                </div>
            </div>

            {/* Services Section */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Catering Services</h2>
                        <p className="text-gray-600 text-lg">
                            We offer tailored catering solutions for a variety of events, ensuring a memorable culinary experience for your guests.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Service 1 */}
                        <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="bg-pink-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <HeartHandshake className="w-10 h-10 text-pink-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Weddings & Receptions</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Add a touch of modern gourmet to your wedding. We provide live pizza stations, elegant appetizers, and customized menus to match your wedding theme.
                            </p>
                        </div>

                        {/* Service 2 */}
                        <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Briefcase className="w-10 h-10 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Corporate Events</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Impress clients and boost team morale with our professional catering. Perfect for office lunches, seminars, product launches, and networking events.
                            </p>
                        </div>

                        {/* Service 3 */}
                        <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="bg-yellow-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <PartyPopper className="w-10 h-10 text-yellow-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Birthdays & Parties</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Make your parties unforgettable! From kids' birthdays to anniversary bashes, our delicious pizzas and fun vibe are always a hit with the crowd.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="py-20 bg-gray-900 text-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose The Pizza Box?</h2>
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div className="p-6">
                            <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Utensils className="w-8 h-8 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Live Stations</h3>
                            <p className="text-gray-400">Fresh pizzas baked right in front of your guests.</p>
                        </div>
                        <div className="p-6">
                            <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Star className="w-8 h-8 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Premium Ingredients</h3>
                            <p className="text-gray-400">We use only the finest imported cheeses and fresh toppings.</p>
                        </div>
                        <div className="p-6">
                            <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="w-8 h-8 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Professional Staff</h3>
                            <p className="text-gray-400">Courteous chefs and servers in professional attire.</p>
                        </div>
                        <div className="p-6">
                            <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Clock className="w-8 h-8 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Punctual Service</h3>
                            <p className="text-gray-400">We value time and ensure everything is set up perfectly on schedule.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact & Enquiry Section */}
            <div id="enquire" className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-12 gap-12">
                    {/* Contact Info Side */}
                    <div className="md:col-span-5 space-y-8">
                        <div>
                            <span className="text-orange-600 font-bold uppercase text-sm tracking-mid">Contact Us</span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6 mt-2">Get in Touch</h2>
                            <p className="text-gray-600 text-lg mb-8">
                                Ready to plan your event? Contact us directly or fill out the form, and our event manager will get back to you immediately.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-orange-50 p-3 rounded-lg">
                                    <Phone className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Phone</h4>
                                    <p className="text-gray-600 font-medium text-lg">{settings.contactPhone}</p>
                                    <p className="text-gray-400 text-sm">Mon-Sun, {settings.operatingHours}</p>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="flex items-start gap-4">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <Mail className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Email</h4>
                                    <p className="text-gray-600 font-medium text-lg">{settings.contactEmail}</p>
                                    <p className="text-gray-400 text-sm">Online Support 24/7</p>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="flex items-start gap-4">
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <MapPin className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Headquarters</h4>
                                    <p className="text-gray-600 whitespace-pre-line">
                                        {settings.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enquiry Form Side */}
                    <div className="md:col-span-7">
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us an Enquiry</h3>
                            <p className="text-gray-500 mb-8">Tell us about your requirements.</p>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
