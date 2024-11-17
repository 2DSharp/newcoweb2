// app/providers/JobSchedulerProvider.tsx
'use client';

import { useEffect, useRef } from 'react';
import {AuthService} from "@/services/authService";

class JobScheduler {
    private static instance: JobScheduler | null = null;
    private channel: BroadcastChannel | null = null;
    private isLeader: boolean = false;
    private jobInterval: NodeJS.Timeout | null = null;
    private heartbeatInterval: NodeJS.Timeout | null = null;
    private readonly INTERVAL = 1 * 60 * 1000; // 1 minute (adjust as needed)
    private readonly HEARTBEAT_INTERVAL = 1000; // 1 second
    private authService = AuthService.getInstance()

    private constructor() {
        if (typeof window !== 'undefined') {
            this.channel = new BroadcastChannel('job-scheduler');
            this.setupChannel();
            this.startHeartbeat();
        }
    }

    public static getInstance(): JobScheduler {
        if (!JobScheduler.instance) {
            JobScheduler.instance = new JobScheduler();
        }
        return JobScheduler.instance;
    }

    private setupChannel() {
        if (!this.channel) return;

        this.channel.onmessage = (event) => {
            if (event.data.type === 'heartbeat' && this.isLeader &&
                event.data.timestamp < Date.now() - this.HEARTBEAT_INTERVAL) {
                this.isLeader = false;
                this.stopJob();
            }
        };
    }

    private startHeartbeat() {
        if (!this.isLeader) {
            this.isLeader = true;
            this.startJob();
        }

        this.heartbeatInterval = setInterval(() => {
            this.channel?.postMessage({
                type: 'heartbeat',
                timestamp: Date.now()
            });
        }, this.HEARTBEAT_INTERVAL);
    }

    private startJob() {
        if (this.jobInterval) return;

        // Execute immediately
        this.runScheduledTask();

        // Then set up the interval
        this.jobInterval = setInterval(() => {
            this.runScheduledTask();
        }, this.INTERVAL);
    }

    private stopJob() {
        if (this.jobInterval) {
            clearInterval(this.jobInterval);
            this.jobInterval = null;
        }
    }

    private runScheduledTask() {
        if (!this.isLeader) return;

        console.log('Task executed at:', new Date().toISOString());
        this.authService.refreshTokens().then()
    }

    public cleanup() {
        this.stopJob();

        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }

        if (this.channel) {
            this.channel.close();
            this.channel = null;
        }

        this.isLeader = false;
    }

    public static destroyInstance() {
        if (JobScheduler.instance) {
            JobScheduler.instance.cleanup();
            JobScheduler.instance = null;
        }
    }
}

export function JobSchedulerProvider() {
    const mountedRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined' || mountedRef.current) return;
        mountedRef.current = true;

        const scheduler = JobScheduler.getInstance();

        return () => {
            scheduler.cleanup();
            JobScheduler.destroyInstance();
        };
    }, []);

    return null;
}

// app/providers/Providers.tsx
// Use this in your root layout
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JobSchedulerProvider />
            {children}
        </>
    );
}