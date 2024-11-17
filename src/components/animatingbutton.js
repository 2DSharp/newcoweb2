'use client';

import { ArrowRight, Loader2 } from 'lucide-react'; // Import Loader2 icon
import { motion } from 'framer-motion';

export function AnimatingButton({isLoading, children}) {

    return <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        whileTap={{scale: 0.95}}
    >
        {isLoading ? (
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                className="flex items-center"
            >
                <Loader2 className="animate-spin h-5 w-5 mr-2"/>
                Processing...
            </motion.div>
        ) : (
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                className="flex items-center"
            >
                {children}
                <motion.div
                    className="ml-2"
                    animate={{x: [0, 4, 0]}}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <ArrowRight className="h-5 w-5"/>
                </motion.div>
            </motion.div>
        )}
    </motion.button>;
}