'use client';

import { useEffect } from 'react';

export const dynamic = 'force-dynamic';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 p-6">
            <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-2xl w-full">
                <p className="text-sm font-mono text-red-800 break-words whitespace-pre-wrap">
                    {error.message || 'Unknown error'}
                </p>
                {error.digest && (
                    <p className="text-xs text-red-600 mt-2">
                        Error ID: {error.digest}
                    </p>
                )}
                <details className="mt-4">
                    <summary className="text-xs text-red-700 cursor-pointer hover:underline">
                        Show stack trace
                    </summary>
                    <pre className="text-xs text-red-600 mt-2 overflow-auto max-h-64 bg-red-100 p-2 rounded">
                        {error.stack}
                    </pre>
                </details>
            </div>
            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
            >
                Try again
            </button>
        </div>
    );
}
