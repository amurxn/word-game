"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";

type Word = {
    word: string;
    options: string[];
    correct: string;
};

// Add Suspense
function SearchParamsWrapper() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setWords, setLoading, loading } = useGameContext();
    const [error, setError] = useState<string | null>(null);

    const difficulty = searchParams.get("difficulty") || "medium"; // Default to medium
    const language1 = searchParams.get("language1") || "english"; // Default to English
    const language2 = searchParams.get("language2") || "czech"; // Default to Czech

    const currentDate = new Date().toLocaleDateString();

    const fetchWords = async () => {
        try {
            setLoading(true);

            const response = await fetch("/api/fetchWords", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language1,
                    language2,
                    difficulty,
                    date: currentDate, // Pass dynamic parameters
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch words from the server.");
            }

            const data = await response.json();
            let jsonString = data.choices[0].message.content; // Extract the JSON string

            // Remove Markdown code block delimiters (```json ... ```)
            jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();

            let parsedData: Word[] = JSON.parse(jsonString);

            // Shuffle options for each word
            const shuffleArray = (array: string[]) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
                }
                return array;
            };

            parsedData = parsedData.map((word: { word: string; options: string[]; correct: string }) => ({
                ...word,
                options: shuffleArray(word.options), // Shuffle the options
            }));

            setWords(parsedData);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("An error occurred while fetching the words. Please refresh the page.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWords();
    }, [difficulty, language1, language2]); // Refetch if query parameters change

    const handleStartGame = () => {
        router.push("/game");
    };

    return (
        <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-teal-600 text-white text-center px-6">
            <div className="max-w-lg">
                <h1 className="text-4xl font-bold mb-6">Get Ready!</h1>
                <p className="text-lg mb-10">
                    A word in <span className="font-semibold">{language1}</span> will appear.
                    Your task is to select the correct translation in <span className="font-semibold">{language2}</span>.
                </p>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {!error && (
                    <div className="text-sm mb-6 text-gray-200">
                        {loading ? (
                            <div className="text-white text-sm font-light">
                                Preparing words, please wait
                                <span className="dot-animation"></span>
                            </div>
                        ) : (
                            <div className="text-white text-sm font-light">Words are ready!</div>
                        )}
                    </div>
                )}
                <div className="flex flex-col gap-4 items-center">
                    <Button
                        variant="outline"
                        className={`py-3 px-6 text-lg font-semibold w-1/2 ${
                            loading
                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                : "bg-white text-blue-700 hover:bg-gray-100 shadow-md transition-transform transform hover:scale-105"
                        }`}
                        onClick={handleStartGame}
                        disabled={loading}
                    >
                        Start Game
                    </Button>
                    <Button
                        variant="outline"
                        className={`py-3 px-6 text-lg font-semibold w-1/2 bg-white text-blue-700 hover:bg-gray-100 shadow-md transition-transform transform hover:scale-105`}
                        onClick={() => router.push("/")}
                    >
                        Leave
                    </Button>
                </div>
            </div>
        </main>
    );
}

// Add Suspense Wrapper
export default function StartPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchParamsWrapper />
        </Suspense>
    );
}