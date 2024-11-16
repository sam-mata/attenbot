// app/api/generate-audio/route.ts
import { NextResponse } from 'next/server';

const PLAYHT_API_KEY = process.env.PLAYHT_API_KEY;
const PLAYHT_USER_ID = process.env.PLAYHT_USER_ID;
const CLONED_VOICE_ID = "s3://voice-cloning-zero-shot/01f6b23c-354e-4205-874e-844f68b22cc2/original/manifest.json";

export async function POST(request: Request) {
    try {
        const { text } = await request.json();

        console.log('Initiating audio conversion with PlayHT v2...');

        // Create the conversion using v2 API with your cloned voice
        const conversionResponse = await fetch('https://api.play.ht/api/v2/tts/stream', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PLAYHT_API_KEY}`,
                'X-User-ID': PLAYHT_USER_ID!,
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg',
            },
            body: JSON.stringify({
                text: text,
                voice: CLONED_VOICE_ID,  // Using your cloned voice
                quality: 'medium',
                output_format: 'mp3',
                speed: 1,
                sample_rate: 24000
            }),
        });

        console.log('PlayHT Response Status:', conversionResponse.status);
        console.log('PlayHT Response Headers:', Object.fromEntries(conversionResponse.headers.entries()));

        if (!conversionResponse.ok) {
            let errorMessage;
            try {
                const errorData = await conversionResponse.json();
                errorMessage = errorData.message || errorData.error || 'Unknown error';
            } catch {
                errorMessage = await conversionResponse.text();
            }
            throw new Error(`Failed to generate audio: ${errorMessage}`);
        }

        // Get the audio data directly from the stream
        const audioBuffer = await conversionResponse.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString('base64');

        return NextResponse.json({
            audio: base64Audio,
            directPlay: true
        });
    } catch (error) {
        console.error('Full error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unknown error occurred' },
            { status: 500 }
        );
    }
}