'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, Gift, Award, Smartphone, X, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

// Wrapper component to provide Google Context
export default function LoginPage() {
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'mock_client_id'}>
            <LoginForm />
        </GoogleOAuthProvider>
    );
}

function LoginForm() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // WhatsApp State
    const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
    const [whatsappPhone, setWhatsappPhone] = useState('');
    const [whatsappOtp, setWhatsappOtp] = useState('');
    const [whatsappName, setWhatsappName] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const setUser = useStore((state) => state.setUser);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login', { identifier, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setLoading(true);
                // Fetch user info from Google
                const userInfo = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
                );

                // Send to backend
                const res = await api.post('/auth/google', {
                    email: userInfo.data.email,
                    name: userInfo.data.name,
                    googleId: userInfo.data.sub,
                });

                localStorage.setItem('token', res.data.token);
                setUser(res.data.user);
                router.push('/');
            } catch (err) {
                console.error('Google login failed', err);
                setError('Google login failed');
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            console.error('Google Login Failed');
            // If client ID is missing/mock, we can simulate success for demo
            if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === 'mock_client_id') {
                simulateGoogleLogin();
            } else {
                setError('Google Login Failed');
            }
        },
    });

    const simulateGoogleLogin = async () => {
        // Demo fallback
        try {
            setLoading(true);
            const res = await api.post('/auth/google', {
                email: 'demo.google@example.com',
                name: 'Demo Google User',
                googleId: 'mock_google_id',
            });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            router.push('/');
        } catch (err) {
            setError('Demo Google login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppLogin = async () => {
        if (!otpSent) {
            // Send OTP (Mock)
            if (!whatsappPhone || whatsappPhone.length < 10) {
                alert('Please enter a valid phone number');
                return;
            }
            setOtpSent(true);
            alert('OTP sent to your WhatsApp number: 1234'); // Mock OTP
        } else {
            // Verify OTP
            try {
                setLoading(true);
                const res = await api.post('/auth/whatsapp', {
                    phone: whatsappPhone,
                    otp: whatsappOtp,
                    name: whatsappName,
                });
                localStorage.setItem('token', res.data.token);
                setUser(res.data.user);
                router.push('/');
            } catch (err: any) {
                alert(err.response?.data?.message || 'Login failed');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleGuestLogin = async () => {
        try {
            setLoading(true);
            const res = await api.post('/auth/guest');
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Guest login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
            {/* Continue as Guest (Top Right) */}
            <button
                onClick={handleGuestLogin}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-medium text-sm flex items-center gap-1"
            >
                Continue as Guest <ArrowRight className="w-4 h-4" />
            </button>

            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden relative">
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="bg-orange-100 p-3 rounded-full">
                                <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-10 h-10 object-contain" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Login to unlock awesome benefits</h2>
                    </div>

                    {/* Benefits Icons */}
                    <div className="flex justify-between mb-8 text-center px-2">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <Gift className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium text-gray-600">Personalized<br />Offers</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                                <Award className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium text-gray-600">Loyalty<br />Rewards</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium text-gray-600">Easy<br />Payments</span>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all peer placeholder-transparent"
                                id="identifier"
                                placeholder="Email or Mobile Number"
                                required
                            />
                            <label
                                htmlFor="identifier"
                                className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1 pointer-events-none"
                            >
                                Email or Mobile Number
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all peer placeholder-transparent"
                                id="password"
                                placeholder="Password"
                                required
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1 pointer-events-none"
                            >
                                Password
                            </label>
                        </div>

                        <Button type="submit" className="w-full py-6 text-lg font-bold rounded-xl shadow-lg shadow-orange-200" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                            Login
                        </Button>

                        <button
                            type="button"
                            onClick={handleGuestLogin}
                            className="w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center gap-1"
                        >
                            Continue as Guest <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                onClick={() => {
                                    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
                                    if (!clientId || clientId === 'mock_client_id') {
                                        simulateGoogleLogin();
                                    } else {
                                        googleLogin();
                                    }
                                }}
                                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors"
                            >
                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">Google</span>
                            </button>
                            <button
                                onClick={() => setShowWhatsAppModal(true)}
                                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors"
                            >
                                <svg className="h-5 w-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                            </button>
                        </div>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-primary font-bold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* WhatsApp Modal */}
                {showWhatsAppModal && (
                    <div className="absolute inset-0 bg-white z-50 p-8 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <button
                            onClick={() => { setShowWhatsAppModal(false); setOtpSent(false); setWhatsappPhone(''); setWhatsappOtp(''); setWhatsappName(''); }}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </div>

                        <h3 className="text-xl font-bold mb-2">WhatsApp Login</h3>
                        <p className="text-gray-500 mb-6 text-center text-sm">
                            {otpSent ? 'Enter the OTP and your Name' : 'Enter your WhatsApp number to receive an OTP'}
                        </p>

                        {!otpSent ? (
                            <div className="w-full space-y-4">
                                <input
                                    type="tel"
                                    value={whatsappPhone}
                                    onChange={(e) => setWhatsappPhone(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    placeholder="Mobile Number"
                                    autoFocus
                                />
                                <Button onClick={handleWhatsAppLogin} className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg">
                                    Send OTP
                                </Button>
                            </div>
                        ) : (
                            <div className="w-full space-y-4">
                                <input
                                    type="text"
                                    value={whatsappOtp}
                                    onChange={(e) => setWhatsappOtp(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-center tracking-widest text-xl"
                                    placeholder="OTP (1234)"
                                    maxLength={4}
                                    autoFocus
                                />
                                <input
                                    type="text"
                                    value={whatsappName}
                                    onChange={(e) => setWhatsappName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    placeholder="Your Name"
                                />
                                <div className="bg-blue-50 text-blue-700 text-xs p-2 rounded text-center">
                                    In a real app, we'd fetch this from WhatsApp!
                                </div>
                                <Button onClick={handleWhatsAppLogin} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg">
                                    {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                                    Verify & Login
                                </Button>
                                <button
                                    onClick={() => setOtpSent(false)}
                                    className="w-full text-sm text-gray-500 hover:text-gray-800"
                                >
                                    Change Number
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
