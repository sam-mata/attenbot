// components/AttenBot.tsx
"use client";

import { useState, useRef, useEffect } from "react";

export default function AttenBot() {
    const [status, setStatus] = useState("Starting webcam...");
    const [, setScript] = useState("No script generated.");
    const [isProcessing, setIsProcessing] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Auto-start webcam on component mount
    useEffect(() => {
        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                streamRef.current = stream;
                setStatus("✅ Ready");
            } catch (error) {
                console.error("Error accessing webcam:", error);
                setStatus("❌ Error accessing webcam");
            }
        };

        startWebcam();

        // Cleanup on unmount
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const captureImage = async () => {
        if (!videoRef.current || !streamRef.current) return null;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(videoRef.current, 0, 0);

        return canvas.toDataURL('image/jpeg').split(',')[1];
    };

    const generateContent = async () => {
        if (!streamRef.current) {
            setStatus("❌ Webcam not available");
            return;
        }

        setIsProcessing(true);
        setStatus("🤔 Analyzing scene...");
        setAudioUrl(null);

        try {
            // First, generate the script
            const base64Image = await captureImage();
            if (!base64Image) {
                throw new Error("Failed to capture image");
            }

            const scriptResponse = await fetch('/api/generate-script', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image,
                }),
            });

            if (!scriptResponse.ok) {
                throw new Error("Failed to generate script");
            }

            const scriptData = await scriptResponse.json();
            setScript(scriptData.script);
            setStatus("✨ Generating narration...");

            // Then, generate the narration
            const audioResponse = await fetch('/api/generate-audio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: scriptData.script,
                }),
            });

            if (!audioResponse.ok) {
                const error = await audioResponse.json();
                throw new Error(error.error || 'Failed to generate narration');
            }

            const audioData = await audioResponse.json();
            const audioDataUrl = `data:audio/mpeg;base64,${audioData.audio}`;

            // Create and play audio immediately
            const audio = new Audio(audioDataUrl);
            audio.play().then(() => {
                setStatus("🔊 Playing narration...");
            }).catch((error) => {
                console.error('Autoplay failed:', error);
                setStatus("🔊 Click play to listen to narration");
            });

            // Set the URL for the visible audio control
            setAudioUrl(audioDataUrl);

        } catch (error) {
            console.error("Error:", error);
            setStatus(`❌ ${error instanceof Error ? error.message : 'Error generating content'}`);
        } finally {
            setIsProcessing(false);
        }
    };

    // Add use effect to handle user interaction requirement for audio
    useEffect(() => {
        const handleUserInteraction = () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };

        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);

        return () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };
    }, []);

    return (
            <div className=" w-3/4 mx-auto">
                <video
                    ref={videoRef}
                    id="webcam"
                    className="w-full rounded-sm aspect-square bg-zinc-800"
                    autoPlay
                    playsInline
                >
                    <track kind="captions" label="No captions available" default />
                </video>
                <button
                    className="font-extrabold bg-foreground text-background px-4 py-2 mt-4 w-full"
                    onClick={generateContent}
                    disabled={isProcessing || !streamRef.current}
                >
                    {isProcessing ? "ATTENBOT IS WORKING..." : "START THE ATTENBOT"}
                </button>
                <div className="bg-zinc-800 rounded-sm p-4 my-4">
                    <p>Status: {status}</p>
                </div>
                {audioUrl && (
                    <div className="mt-4">
                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            className="w-full"
                            onPlay={() => setStatus("🔊 Playing narration...")}
                            onEnded={() => setStatus("✅ Narration complete")}
                            onError={() => setStatus("❌ Error playing audio")}
                        />
                    </div>
                )}
            </div>
    );
}