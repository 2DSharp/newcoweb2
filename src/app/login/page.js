"use client"

import { useState } from 'react';
import { Phone, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your login logic here
        window.location.href = '/onboarding';
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Side - Hidden on mobile */}
            <div className="hidden md:flex md:w-1/2 bg-indigo-600 text-white p-12 flex-col justify-center relative">
                <div className="absolute inset-0">
                    <img
                        src="/api/placeholder/800/1200"
                        alt="Seller Dashboard Preview"
                        className="object-cover w-full h-full opacity-20"
                    />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-6">
                        Grow Your Business With Us
                    </h1>
                    <p className="text-xl mb-8 text-indigo-100">
                        Join thousands of successful sellers who have transformed their business using our platform.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-center text-lg">
                            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-4">
                                ✓
                            </div>
                            Reach millions of customers worldwide
                        </li>
                        <li className="flex items-center text-lg">
                            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-4">
                                ✓
                            </div>
                            Powerful analytics and inventory management
                        </li>
                        <li className="flex items-center text-lg">
                            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-4">
                                ✓
                            </div>
                            24/7 dedicated seller support
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-12 py-12 bg-white">
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
                                        <Phone className="h-5 w-5 text-gray-400" />
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
                                        <Lock className="h-5 w-5 text-gray-400" />
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
                                <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                <span className="ml-2 text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-indigo-600 hover:text-indigo-500">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <span>Login to Dashboard</span>
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <a href="/onboarding" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                Start selling now!
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;