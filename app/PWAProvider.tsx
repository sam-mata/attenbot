// app/PWAProvider.tsx
'use client';

import { useEffect } from 'react';

export default function PWAProvider() {
    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            window.workbox !== undefined
        ) {
            const wb = window.workbox;

            // Add event listeners to handle PWA lifecycle
            wb.addEventListener('installed', (event: any) => {
                console.log(`Event ${event.type} is triggered.`);
                console.log(event);
            });

            wb.addEventListener('controlling', (event: any) => {
                console.log(`Event ${event.type} is triggered.`);
                console.log(event);
            });

            wb.addEventListener('activated', (event: any) => {
                console.log(`Event ${event.type} is triggered.`);
                console.log(event);
            });

            // Send skip waiting
            wb.addEventListener('waiting', () => {
                wb.messageSkipWaiting();
            });

            // Register the service worker after event listeners are added
            wb.register();
        }
    }, []);

    return null;
}