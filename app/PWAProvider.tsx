'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        workbox: {
            addEventListener: (event: string, callback: (event: Event) => void) => void;
            messageSkipWaiting: () => void;
            register: () => void;
        }
    }
}

export default function PWAProvider() {
    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            window.workbox !== undefined
        ) {
            const wb = window.workbox;

            wb.addEventListener('installed', (event: Event) => {
                console.log(`Event ${event.type} is triggered.`);
                console.log(event);
            });

            wb.addEventListener('controlling', (event: Event) => {
                console.log(`Event ${event.type} is triggered.`);
                console.log(event);
            });

            wb.addEventListener('activated', (event: Event) => {
                console.log(`Event ${event.type} is triggered.`);
                console.log(event);
            });

            wb.addEventListener('waiting', () => {
                wb.messageSkipWaiting();
            });

            wb.register();
        }
    }, []);

    return null;
}