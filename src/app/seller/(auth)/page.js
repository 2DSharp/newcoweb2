"use client"

import {useState} from 'react';
import {Phone, Lock, ArrowRight} from 'lucide-react';
import Link from "next/link";
import apiService from '@/services/api';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await apiService.auth.login({
                phone,
                password,
                loginType: 'SELLER'
            });

            if (response.successful) {
                router.push('/seller/dashboard');
            } else {
                setError(response.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Login
                </h2>
                <p className="text-gray-600">
                    Let's start selling and grow your business
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400"/>
                            </div>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400"/>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center">
                        <input type="checkbox"
                               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                        <span className="ml-2 text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                    </a>
                </div>
                {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span>Logging in...</span>
                    ) : (
                        <>
                            <span>Login to Dashboard</span>
                            <ArrowRight className="ml-2 h-5 w-5"/>
                        </>
                    )}
                </button>

                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/seller/onboarding" className="text-indigo-600 hover:text-indigo-500 font-medium">
                        Start selling now!
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;