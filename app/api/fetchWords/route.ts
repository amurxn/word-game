import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { language1, language2, difficulty, date } = body;

        // Make the request to the external API (DeepSeek)
        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`, // Use environment variable
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: `You are an assistant generating translations.`,
                    },
                    {
                        role: "user",
                        content: `Generate 10 words in ${language1} with 3 translations in ${language2} for a game. Use today's date (${date}) as a context to select unique words. Ensure variety in the generated words. The difficulty level should be ${difficulty}. Provide the output in JSON format like: [{"word": "Apple", "options": ["Jablko", "Hruška", "Banán"], "correct": "Jablko"}].`,
                    },
                ],
                stream: false,
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch words from the API" }, { status: 500 });
        }

        const data = await response.json();
        return NextResponse.json(data); // Return the API response
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}