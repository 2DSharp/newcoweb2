

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Side - Hidden on mobile */}
            <div className="hidden md:flex md:w-1/2 bg-gray-600 text-white p-12 flex-col justify-center relative">
                <div className="absolute inset-0">
                    <img
                        src={"/sellerbg.jpg"}
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
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-12 py-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="max-w-md w-full mx-auto">
                    { children }
                </div>
            </div>
        </div>
    );
};

