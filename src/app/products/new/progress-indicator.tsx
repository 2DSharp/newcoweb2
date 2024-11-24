import React from 'react'

export default function ProgressIndicator({ steps, currentStep }) {
    return (
        <div className="mb-8">
            <div className="flex justify-between mb-2">
                {steps.map((label, index) => (
                    <div
                        key={index}
                        className={`flex items-center ${
                            currentStep > index + 1 ? 'text-blue-500' :
                                currentStep === index + 1 ? 'text-blue-700 font-bold' :
                                    'text-gray-400'
                        }`}
                    >
                        
                        <span className="mr-2">{index + 1}. {label}</span>
                    </div>
                ))}
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
            </div>
        </div>
    )
}