'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';

interface CardPaymentProps {
    onCardChange: (cardDetails: { last4: string; cardType: string }) => void;
}

export default function CardPayment({ onCardChange }: CardPaymentProps) {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardholderName, setCardholderName] = useState('');

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\s/g, '');
        const chunks = cleaned.match(/.{1,4}/g);
        return chunks ? chunks.join(' ') : cleaned;
    };

    const formatExpiry = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }
        return cleaned;
    };

    const detectCardType = (number: string) => {
        const cleaned = number.replace(/\s/g, '');
        if (cleaned.startsWith('4')) return 'Visa';
        if (cleaned.startsWith('5')) return 'Mastercard';
        if (cleaned.startsWith('6')) return 'RuPay';
        return 'Unknown';
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s/g, '');
        if (value.length <= 16 && /^\d*$/.test(value)) {
            setCardNumber(formatCardNumber(value));
            if (value.length >= 4) {
                onCardChange({
                    last4: value.slice(-4),
                    cardType: detectCardType(value),
                });
            }
        }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            setExpiry(formatExpiry(value));
        }
    };

    const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 3 && /^\d*$/.test(value)) {
            setCvv(value);
        }
    };

    return (
        <div className="space-y-4 mt-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                </label>
                <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="JOHN DOE"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {cardNumber.length >= 4 && (
                    <p className="text-sm text-gray-600 mt-1">
                        Card Type: <span className="font-semibold">{detectCardType(cardNumber)}</span>
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                    </label>
                    <input
                        type="text"
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                    </label>
                    <input
                        type="password"
                        value={cvv}
                        onChange={handleCVVChange}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-sm text-purple-800">
                    🔒 <strong>Secure Payment:</strong> This is a demo. In production, card details would be processed securely via Stripe.
                </p>
            </div>
        </div>
    );
}
