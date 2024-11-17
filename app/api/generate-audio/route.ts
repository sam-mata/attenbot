// app/api/generate-audio/route.ts
import { NextResponse } from 'next/server';

const PLAYHT_API_KEY = process.env.PLAYHT_API_KEY;
const PLAYHT_USER_ID = process.env.PLAYHT_USER_ID;
const CLONED_VOICE_ID = "s3://voice-cloning-zero-shot/01f6b23c-354e-4205-874e-844f68b22cc2/original/manifest.json";

export const maxDuration = 300;

export async function POST(request: Request) {
    try {
        const { text } = await request.json();

        if (!PLAYHT_API_KEY || !PLAYHT_USER_ID) {
            throw new Error('Missing PlayHT credentials');
        }

        console.log('Starting audio generation with V2 API...');
        console.log('Text length:', text.length);
        console.log('Using voice ID:', CLONED_VOICE_ID);

        const requestBody = {
            text: text,
            voice: CLONED_VOICE_ID,
            quality: 'medium',
            output_format: 'mp3',
            speed: 1,
            sample_rate: 24000,
        };

        console.log('Request body:', JSON.stringify(requestBody, null, 2));

        const convertResponse = await fetch('https://api.play.ht/api/v2/tts/stream', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PLAYHT_API_KEY}`,
                'X-User-ID': PLAYHT_USER_ID,
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg',
            },
            body: JSON.stringify(requestBody),
        });

        console.log('Response status:', convertResponse.status);
        console.log('Response headers:', Object.fromEntries(convertResponse.headers.entries()));

        if (!convertResponse.ok) {
            const contentType = convertResponse.headers.get('content-type');
            let errorBody;

            if (contentType?.includes('application/json')) {
                errorBody = await convertResponse.json();
                console.log('Error response (JSON):', JSON.stringify(errorBody, null, 2));
            } else {
                errorBody = await convertResponse.text();
                console.log('Error response (Text):', errorBody);
            }

            return NextResponse.json(
                { error: `API Error: ${JSON.stringify(errorBody)}` },
                { status: convertResponse.status }
            );
        }

        const audioBuffer = await convertResponse.arrayBuffer();
        console.log('Audio buffer size:', audioBuffer.byteLength);

        const base64Audio = Buffer.from(audioBuffer).toString('base64');

        if (!base64Audio) {
            throw new Error('No audio data received');
        }

        console.log('Successfully generated audio');

        return NextResponse.json({
            audio: base64Audio
        });

    } catch (error) {
        console.error('Error in generate-audio:', error);

        let errorMessage = 'An unknown error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}