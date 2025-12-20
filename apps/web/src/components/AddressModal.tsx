'use client';

import { useState } from 'react';
import { X, MapPin, Home, Briefcase, Users, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import api from '@/lib/api';
import { toast } from 'sonner';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveAddress: (address: any) => void;
    currentLocation: string;
    onChangeLocation?: () => void;
}

export default function AddressModal({ isOpen, onClose, onSaveAddress, currentLocation, onChangeLocation }: AddressModalProps) {
    const [houseNo, setHouseNo] = useState('');
    const [floor, setFloor] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [landmark, setLandmark] = useState('');
    const [city, setCity] = useState('Meerut');
    const [zip, setZip] = useState('250001');
    const [addressType, setAddressType] = useState('Home');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Update city based on location prop change
    // useEffect(() => {
    //     if (currentLocation) {
    //         const inferredCity = currentLocation.split(',').pop()?.trim();
    //         if (inferredCity) setCity(inferredCity);
    //     }
    // }, [currentLocation]);

    const { user } = useStore();

    if (!isOpen) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            const fullAddress = {
                location: currentLocation,
                houseNo,
                floor,
                buildingName,
                landmark,
                type: addressType
            };

            const street = [houseNo, floor, buildingName, landmark]
                .filter(Boolean)
                .join(', ');

            await api.post('/users/addresses', { street, city, zip });

            toast.success('Address saved successfully!');
            onSaveAddress(fullAddress);

            setHouseNo('');
            setFloor('');
            setBuildingName('');
            setLandmark('');
            setAddressType('Home');
            setError(null);

            onClose();
        } catch (error: any) {
            console.error('Failed to save address:', error);
            const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Failed to save address. Please try again.';
            setError(message);
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Enter Complete Address</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-6">
                    {/* Delivery Location with Change Button */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-xs text-blue-600 font-semibold uppercase">DELIVERY LOCATION</p>
                                    <p className="text-sm font-bold text-gray-800">{currentLocation}</p>
                                </div>
                            </div>
                            {onChangeLocation && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={onChangeLocation}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                >
                                    <Edit3 className="h-4 w-4 mr-1" />
                                    Change
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Flat / House No *</label>
                            <input
                                type="text"
                                required
                                value={houseNo}
                                onChange={(e) => setHouseNo(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. 102"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Floor (Optional)</label>
                            <input
                                type="text"
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. 1st Floor"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Building / Apartment Name *</label>
                        <input
                            type="text"
                            required
                            value={buildingName}
                            onChange={(e) => setBuildingName(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Sunshine Apartments"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Landmark (Optional)</label>
                        <input
                            type="text"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Near City Park"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">City</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Zip Code</label>
                            <input
                                type="text"
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">Save Address As</label>
                        <div className="flex gap-3">
                            {[
                                { icon: Home, label: 'Home' },
                                { icon: Briefcase, label: 'Work' },
                                { icon: Users, label: 'Other' }
                            ].map(({ icon: Icon, label }) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => setAddressType(label)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${addressType === label
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="text-sm font-medium">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg font-bold"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Address'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
