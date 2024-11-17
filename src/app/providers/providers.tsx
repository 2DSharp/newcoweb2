// app/providers/Providers.tsx
'use client';

import { JobSchedulerProvider } from './JobSchedulerProvider';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JobSchedulerProvider />
            {children}
        </>
    );
}