'use client';

import {Store} from 'lucide-react';
import {OnboardingForm} from '../../components/OnboardingForm';
// @ts-ignore
import EntryPageLayout from "@/app/entrypage";
import Link from "next/link";

export default function OnboardingHome() {
    return (
        <EntryPageLayout>
            <div className="max-w-md w-full mx-auto">

                {/* Logo and Header */}
                <div className="text-center mb-8">
                    {/*<div className="inline-block p-3 bg-indigo-600 rounded-full mb-4">*/}
                    {/*    <Store className="w-8 h-8 text-white"/>*/}
                    {/*</div>*/}
                    <h1 className="text-3xl font-bold text-gray-900">Create a seller account</h1>
                    <p className="text-gray-600 mt-2">Join thousands of successful sellers on our platform</p>
                </div>

                <OnboardingForm/>

            </div>
        </EntryPageLayout>
)
;
}