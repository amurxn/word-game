"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";

function GamePage() {
    const { words, loading } = useGameContext();
    const router = useRouter();

    // State for game progress
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [result, setResult] = useState<string | null>(null); // "win" or "lose"

    // Redirect to home if words are missing
    useEffect(() => {
        if (!loading && !words) {
            router.push("/");
        }
    }, [words, loading, router]);

    // Timer countdown
    useEffect(() => {
        if (!gameOver && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (timeLeft === 0) {
            setGameOver(true);
            setResult("lose");
        }
    }, [timeLeft, gameOver]);

    const handleAnswer = (answer: string) => {
        if (gameOver || !words) return;

        if (answer === words[currentWordIndex].correct) {
            setScore((prev) => prev + 1); // Increment score for correct answer
            if (currentWordIndex === words.length - 1) {
                setGameOver(true);
                setResult("win");
            } else {
                setCurrentWordIndex((prev) => prev + 1);
            }
        } else {
            setGameOver(true);
            setResult("lose");
        }
    };

    const handleTryAgain = () => {
        setCurrentWordIndex(0);
        setTimeLeft(30);
        setScore(0); // Reset score
        setGameOver(false);
        setResult(null);
    };

    if (loading) {
        return (
            <main className="flex items-center justify-center h-screen text-white bg-gradient-to-br from-green-500 to-blue-500">
                <div className="text-3xl font-bold">Loading...</div>
            </main>
        );
    }

    if (!words) return null;

    return (
        <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-500 to-blue-500 text-white">
            {!gameOver ? (
                <>
                    <div className="mb-6 text-2xl font-bold">Time Left: {timeLeft}s</div>
                    <div className="mb-6 text-3xl font-semibold">
                        Translate: {words[currentWordIndex].word}
                    </div>
                    <div className="mb-6 text-xl font-medium">Score: {score}</div>
                    <div className="flex flex-col space-y-4">
                        {words[currentWordIndex].options.map((option, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                className="py-3 px-6 text-lg font-semibold bg-white text-green-700 hover:bg-gray-100 shadow-md transition-transform transform hover:scale-105"
                                onClick={() => handleAnswer(option)}
                            >
                                {option}
                            </Button>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center">
                    <div className="mb-6 text-3xl font-bold">
                        {result === "win"
                            ? `Congratulations! You completed the game!`
                            : `Game Over!`}
                    </div>
                    <div className="mb-6 text-2xl font-semibold">
                        Your Score: {score}
                    </div>
                    {result === "win" && score === words.length ? (
                        <div className="mb-6 text-xl text-green-200">
                            Perfect Score! You&#39;re a language master! 🎉
                        </div>
                    ) : result === "win" ? (
                        <div className="mb-6 text-xl text-green-200">
                            Great job! Keep practicing to improve! 😊
                        </div>
                    ) : (
                        <div className="mb-6 text-xl text-red-200">
                            Better luck next time! You got this! 💪
                        </div>
                    )}
                    <div className="flex flex-col gap-4 items-center">
                        <Button
                            variant="outline"
                            className="py-3 px-6 text-lg font-semibold bg-white text-green-700 hover:bg-gray-100 shadow-md transition-transform transform hover:scale-105"
                            onClick={() => router.push("/start")} // Redirect to start page
                        >
                            Try Again
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
            )}
        </main>
    );
}

export default GamePage;