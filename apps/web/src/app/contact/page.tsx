'use client';

import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-xl opacity-90">
                        We'd love to hear from you! Reach out for any queries or feedback.
                    </p>
                </div>
            </div>

            {/* Contact Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
                            <p className="text-gray-600 mb-8">
                                Have a question or want to place a bulk order? We're here to help!
                            </p>
                        </div>

                        {/* Contact Cards */}
                        <div className="space-y-4">
                            <a
                                href="tel:+919876543210"
                                className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all group"
                            >
                                <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                                    <Phone className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                                    <p className="text-gray-600">+91 98765 43210</p>
                                    <p className="text-sm text-gray-500">Mon-Sun, 10 AM - 11 PM</p>
                                </div>
                            </a>

                            <a
                                href="mailto:hello@thepizzabox.com"
                                className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all group"
                            >
                                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                                    <Mail className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                    <p className="text-gray-600">hello@thepizzabox.com</p>
                                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                                </div>
                            </a>

                            <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <MapPin className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                                    <p className="text-gray-600">
                                        123 Pizza Street, Food District<br />
                                        Mumbai, Maharashtra 400001
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <Clock className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Working Hours</h3>
                                    <p className="text-gray-600">
                                        Monday - Sunday<br />
                                        10:00 AM - 11:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                            <p className="text-gray-500">Map Integration (Google Maps)</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                            <p className="text-gray-600 mb-6">
                                Fill out the form below and we'll get back to you as soon as possible.
                            </p>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-2">What are your delivery hours?</h3>
                            <p className="text-gray-600">
                                We deliver from 10 AM to 11 PM, 7 days a week.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-2">Do you offer bulk orders?</h3>
                            <p className="text-gray-600">
                                Yes! Contact us for special pricing on bulk orders for parties and events.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-2">What payment methods do you accept?</h3>
                            <p className="text-gray-600">
                                We accept cash, cards, UPI, and all major digital wallets.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-2">Can I customize my pizza?</h3>
                            <p className="text-gray-600">
                                Absolutely! Choose your toppings, crust, and size to create your perfect pizza.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
