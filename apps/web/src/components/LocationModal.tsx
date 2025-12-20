'use client';

import { useState } from 'react';
import { X, MapPin, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (location: string) => void;
    currentLocation?: string;
}

// Sample locations for demonstration - Meerut areas
const SAMPLE_LOCATIONS = [
    'Pandav Nagar, Meerut',
    'Prabhat Nagar, Meerut',
    'Shastri Nagar, Meerut',
    'Saket, Meerut',
    'Begum Bridge, Meerut',
    'Pallavpuram, Meerut',
    'Ganga Nagar, Meerut',
    'Brahmpuri, Meerut',
    'Lalkurti, Meerut',
    'Suraj Kund, Meerut',
    'Kanker Khera, Meerut',
    'Shivpuri, Meerut',
    'Lisari Gate, Meerut',
    'Abu Lane, Meerut',
    'Mawana Road, Meerut',
    'Delhi Road, Meerut',
    'Garh Road, Meerut',
    'Hapur Road, Meerut',
    'Modipuram, Meerut',
    'Partapur, Meerut',
    'Kankhal, Meerut',
    'Civil Lines, Meerut',
    'Cantonment, Meerut',
    'Jagriti Vihar, Meerut',
    'Shatabdi Nagar, Meerut',
    'Vijay Nagar, Meerut',
    'Rajendra Nagar, Meerut',
    'Kavi Nagar, Meerut',
    'Sardhana Road, Meerut',
    'Rohta Road, Meerut',
    'Meerut Cantt, Meerut',
    'Ganganagar, Meerut',
    'Meerut City, Meerut',
    'Khair Nagar, Meerut',
    'Kotwali, Meerut',
    'Nauchandi, Meerut',
    'Victoria Park, Meerut',
    'Abulane, Meerut',
    'Bhopura, Meerut',
    'Daurala, Meerut',
];

export default function LocationModal({ isOpen, onClose, onSelectLocation, currentLocation }: LocationModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    if (!isOpen) return null;

    const handleDetectLocation = () => {
        // Simulate geolocation detection
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('Location detected:', position.coords);
                    alert('Location detected! (This is a demo)');
                    onClose();
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    alert('Unable to detect location. Please search manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    const handleClearRecent = () => {
        setRecentSearches([]);
    };

    const handleSelectLocation = (location: string) => {
        // Add to recent searches if not already present
        if (!recentSearches.includes(location)) {
            setRecentSearches([location, ...recentSearches.slice(0, 4)]);
        }
        onSelectLocation(location);
        onClose();
    };

    // Filter locations based on search query
    const filteredLocations = searchQuery.trim()
        ? SAMPLE_LOCATIONS.filter(location =>
            location.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-0 md:pt-20">
            <div className="bg-white w-full md:max-w-2xl md:rounded-lg shadow-xl max-h-screen overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-4 flex items-center gap-3 z-10">
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for your delivery location"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full md:hidden">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Current Location Display */}
                {currentLocation && (
                    <div className="bg-green-50 p-4 border-b border-green-100 flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                            <MapPin className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-green-600 font-bold uppercase">Current Location</p>
                            <p className="font-medium text-gray-800">{currentLocation}</p>
                        </div>
                    </div>
                )}

                {/* Detect Location Banner */}
                <div className="bg-blue-700 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5" />
                        <span className="text-sm">Give us your exact location for seamless delivery</span>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent border-white text-white hover:bg-blue-600"
                        onClick={handleDetectLocation}
                    >
                        Detect location
                    </Button>
                </div>

                {/* Search Results */}
                {searchQuery.trim() && (
                    <div className="p-4 border-b">
                        <h3 className="font-bold text-gray-800 mb-3">Search Results</h3>
                        {filteredLocations.length > 0 ? (
                            <div className="space-y-2">
                                {filteredLocations.map((location, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSelectLocation(location)}
                                        className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
                                    >
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{location}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <p className="text-sm">No locations found for "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Recently Searched */}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800">Recently Searched</h3>
                        {recentSearches.length > 0 && (
                            <button
                                onClick={handleClearRecent}
                                className="text-blue-600 text-sm font-medium hover:underline"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {recentSearches.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No recent searches</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentSearches.map((location, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSelectLocation(location)}
                                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3"
                                >
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{location}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
