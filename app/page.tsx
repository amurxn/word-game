"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function Home() {
    const router = useRouter();

    const [difficulty, setDifficulty] = useState<string>("");
    const [language1, setLanguage1] = useState<string>("");
    const [language2, setLanguage2] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleStartNewGame = () => {
        if (!difficulty || !language1 || !language2) {
            setError("Please select all options before starting the game.");
            return;
        }
        if (language1 === language2) {
            setError("Language 1 and Language 2 cannot be the same.");
            return;
        }

        setError(null);

        // Navigate to the start page with query parameters
        router.push(
            `/start?difficulty=${difficulty}&language1=${language1}&language2=${language2}`
        );
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-700">
            <main className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                <h1 className="text-5xl font-bold mb-10">Word Game</h1>

                <div className="space-y-6 mb-8">
                    <Select onValueChange={(value) => setDifficulty(value)}>
                        <SelectTrigger className="w-[240px]">
                            <SelectValue placeholder="Select Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => setLanguage1(value)}>
                        <SelectTrigger className="w-[240px]">
                            <SelectValue placeholder="Language 1" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="czech">Czech</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="ukrainian">Ukrainian</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => setLanguage2(value)}>
                        <SelectTrigger className="w-[240px]">
                            <SelectValue placeholder="Language 2" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="czech">Czech</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="ukrainian">Ukrainian</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {error && <div className="text-red-500 mb-4 font-medium">{error}</div>}

                <Button
                    variant="outline"
                    className="w-[240px] py-3 text-lg font-semibold bg-white text-indigo-700 hover:bg-gray-100 shadow-md transition-transform transform hover:scale-105"
                    onClick={handleStartNewGame}
                >
                    Start New Game
                </Button>
            </main>
        </div>
    );
}

export default Home;