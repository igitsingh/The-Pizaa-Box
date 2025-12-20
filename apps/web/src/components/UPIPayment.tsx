'use client';

import { useState } from 'react';
import Image from 'next/image';

interface UPIPaymentProps {
    onUPIChange: (upiId: string) => void;
}

const upiApps = [
    { name: 'Google Pay', logo: '🟢', color: 'bg-green-100' },
    { name: 'PhonePe', logo: '🟣', color: 'bg-purple-100' },
    { name: 'Paytm', logo: '🔵', color: 'bg-blue-100' },
    { name: 'BHIM', logo: '🟠', color: 'bg-orange-100' },
];

export default function UPIPayment({ onUPIChange }: UPIPaymentProps) {
    const [upiId, setUpiId] = useState('');
    const [error, setError] = useState('');

    const validateUPI = (value: string) => {
        // Basic UPI ID validation: username@bankname
        const upiRegex = /^[\w.-]+@[\w.-]+$/;
        if (value && !upiRegex.test(value)) {
            setError('Invalid UPI ID format (e.g., username@paytm)');
            return false;
        }
        setError('');
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUpiId(value);
        validateUPI(value);
        onUPIChange(value);
    };

    return (
        <div className="space-y-4 mt-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter UPI ID
                </label>
                <input
                    type="text"
                    value={upiId}
                    onChange={handleChange}
                    placeholder="username@paytm"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div>
                <p className="text-sm text-gray-600 mb-3">Popular UPI Apps</p>
                <div className="grid grid-cols-4 gap-3">
                    {upiApps.map((app) => (
                        <div
                            key={app.name}
                            className={`${app.color} p-3 rounded-lg text-center cursor-pointer hover:shadow-md transition-shadow`}
                        >
                            <div className="text-2xl mb-1">{app.logo}</div>
                            <p className="text-xs font-medium text-gray-700">{app.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                    💡 <strong>Note:</strong> This is a demo. In production, you would be redirected to your UPI app for payment.
                </p>
            </div>
        </div>
    );
}
