'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
    phoneNumber?: string;
    message?: string;
    className?: string;
}

export default function WhatsAppButton({
    phoneNumber = '919876543210', // Default number (replace with actual)
    message = 'Hi! I would like to know more about The Pizza Box.',
    className = ''
}: WhatsAppButtonProps) {
    const handleWhatsAppClick = () => {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <button
            onClick={handleWhatsAppClick}
            className={`fixed bottom-6 left-6 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 group ${className}`}
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Chat on WhatsApp
            </span>
        </button>
    );
}
