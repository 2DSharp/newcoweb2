// app/(onboarding)/onboarding/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
    const router = useRouter()

    useEffect(() => {
        const savedData = localStorage.getItem('onboardingFormData')
        if (savedData) {
            try {
                const formData = JSON.parse(savedData)

                // If OTP is verified, redirect to store setup
                if (formData.otpToken) {
                    router.replace('/onboarding/store-setup')
                    return
                }

                // If personal info is complete, redirect to OTP verification
                if (formData.firstName && formData.lastName && formData.email && formData.password) {
                    router.replace('/onboarding/verify-otp')
                    return
                }
            } catch (e) {
                console.error('Error parsing saved form data:', e)
            }
        }

        router.replace('/onboarding/personal-info')
    }, [router])

    // Return null or a loading state since we're always redirecting
    return null
}