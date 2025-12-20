import { Pizza } from 'lucide-react';

export default function Logo({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 font-bold text-xl tracking-tight ${className}`}>
            <div className="bg-orange-500 p-1.5 rounded-lg text-white">
                <Pizza size={24} />
            </div>
            <span className="text-orange-900">The Pizza Box</span>
        </div>
    );
}
