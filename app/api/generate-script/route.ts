import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { image } = await request.json();

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "You are a snarky version of a BBC nature documentary narrator. Narrate the picture of the human as if it is a nature documentary, but you are more focused on puns and mockery. Make it snarky and funny, do not be afraid to be rude. Don't repeat yourself. Make it short. If I do anything remotely interesting, make a big deal about it!",
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${image}`,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 100,
        });

        const script = response.choices[0].message.content;

        return NextResponse.json({ script });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Failed to generate script" },
            { status: 500 }
        );
    }
}
