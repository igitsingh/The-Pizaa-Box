'use client';

import { CreditCard, Smartphone, Wallet, Building2 } from 'lucide-react';

interface PaymentMethodSelectorProps {
    selectedMethod: string;
    onMethodChange: (method: string) => void;
}

const paymentMethods = [
    {
        id: 'COD',
        name: 'Cash on Delivery',
        icon: Wallet,
        description: 'Pay when you receive',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
    },
    {
        id: 'UPI',
        name: 'UPI Payment',
        icon: Smartphone,
        description: 'GPay, PhonePe, Paytm',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
    },
    {
        id: 'CARD',
        name: 'Credit/Debit Card',
        icon: CreditCard,
        description: 'Visa, Mastercard, RuPay',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
    },
    {
        id: 'NET_BANKING',
        name: 'Net Banking',
        icon: Building2,
        description: 'All major banks',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
    },
];

export default function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
    return (
        <div className="space-y-3">
            <h3 className="font-bold text-lg mb-4">Select Payment Method</h3>
            {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;

                return (
                    <button
                        key={method.id}
                        onClick={() => onMethodChange(method.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all ${isSelected
                                ? `${method.borderColor} ${method.bgColor} shadow-md`
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${isSelected ? method.bgColor : 'bg-gray-100'}`}>
                                <Icon className={`h-6 w-6 ${isSelected ? method.color : 'text-gray-600'}`} />
                            </div>
                            <div className="flex-1 text-left">
                                <p className={`font-semibold ${isSelected ? method.color : 'text-gray-900'}`}>
                                    {method.name}
                                </p>
                                <p className="text-sm text-gray-500">{method.description}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? `${method.borderColor} ${method.bgColor}` : 'border-gray-300'
                                }`}>
                                {isSelected && (
                                    <div className={`w-3 h-3 rounded-full ${method.color.replace('text-', 'bg-')}`} />
                                )}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
