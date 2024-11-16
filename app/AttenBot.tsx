// components/AttenBot.tsx
"use client";

import { useState, useRef, useEffect } from "react";

export default function AttenBot() {
    const [status, setStatus] = useState("📸 Enable Webcam");
    const [script, setScript] = useState("No script generated.");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isNarrating, setIsNarrating] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

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
            setStatus("✅ Webcam Active");
        } catch (error) {
            console.error("Error accessing webcam:", error);
            setStatus("❌ Error accessing webcam");
        }
    };

    const stopWebcam = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            streamRef.current = null;
            setStatus("📸 Enable Webcam");
        }
    };

    const captureImage = async () => {
        if (!videoRef.current || !streamRef.current) return null;

        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0);

        return canvas.toDataURL("image/jpeg").split(",")[1];
    };

    const generateScript = async () => {
        if (!streamRef.current) {
            setStatus("❌ Please enable webcam first");
            return;
        }

        setIsProcessing(true);
        setStatus("🤔 Analyzing scene...");
        setAudioUrl(null); // Clear previous audio

        try {
            const base64Image = await captureImage();
            if (!base64Image) {
                throw new Error("Failed to capture image");
            }

            const response = await fetch("/api/generate-script", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image: base64Image,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate script");
            }

            const data = await response.json();
            setScript(data.script);
            setStatus("✨ Script generated!");
        } catch (error) {
            console.error("Error generating script:", error);
            setStatus("❌ Error generating script");
        } finally {
            setIsProcessing(false);
        }
    };

    const generateNarration = async () => {
        if (!script || script === "No script generated.") {
            setStatus("❌ Please generate a script first");
            return;
        }

        setIsNarrating(true);
        setIsLoadingAudio(true);
        setStatus("🎙️ Generating narration...");

        try {
            const response = await fetch("/api/generate-audio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: script,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate audio");
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Use the direct URL from PlayHT if available, otherwise use base64
            const audioData = data.url || `data:audio/mpeg;base64,${data.audio}`;
            setAudioUrl(audioData);
            setStatus("🔊 Narration ready!");
        } catch (error) {
            console.error("Error generating audio:", error);
            setStatus("❌ Error generating narration");
        } finally {
            setIsNarrating(false);
            setIsLoadingAudio(false);
        }
    };

    useEffect(() => {
        return () => {
            stopWebcam();
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, []);

    const handleStartClick = () => {
        if (!streamRef.current) {
            startWebcam();
        } else {
            stopWebcam();
        }
    };

    return (
        <div className="lg:flex py-12">
            <div className="lg:w-1/2">
                <video
                    ref={videoRef}
                    id="webcam"
                    className="w-full rounded-sm aspect-square bg-zinc-800"
                    autoPlay
                    playsInline
                >
                    <track kind="captions" label="No captions available" default />
                </video>
                <div className="space-y-2">
                    <button
                        className="font-extrabold bg-foreground text-background px-4 my-4"
                        onClick={handleStartClick}
                    >
                        {streamRef.current ? "STOP WEBCAM" : "START WEBCAM"}
                    </button>
                    <button
                        className="font-extrabold bg-foreground text-background px-4 my-4 block w-full"
                        onClick={generateScript}
                        disabled={isProcessing || !streamRef.current}
                    >
                        {isProcessing ? "GENERATING..." : "GENERATE SCRIPT"}
                    </button>
                    <button
                        className="font-extrabold bg-foreground text-background px-4 my-4 block w-full"
                        onClick={generateNarration}
                        disabled={
                            isNarrating ||
                            !script ||
                            script === "No script generated." ||
                            isLoadingAudio
                        }
                    >
                        {isNarrating
                            ? "GENERATING VOICE..."
                            : isLoadingAudio
                                ? "LOADING AUDIO..."
                                : "NARRATE SCRIPT"}
                    </button>
                </div>
            </div>

            <div className="lg:w-1/2">
                <div className="flex">
                    <h2 className="font-extrabold w-2/5">Status:</h2>
                    <h2 className="w-3/5 text-left">{status}</h2>
                </div>
                <p className="bg-zinc-800 m-4 text-xs h-48 p-4 overflow-y-auto text-left">
                    {script}
                </p>
                {audioUrl && (
                    <div className="mt-4">
                        <audio
                            ref={audioRef}
                            controls
                            className="w-full"
                            src={audioUrl}
                            onError={(e) => {
                                console.error("Audio playback error:", e);
                                setStatus("❌ Error playing audio");
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
