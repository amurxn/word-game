"use client";

import React, { createContext, useState, useContext } from "react";

type Word = {
    word: string;
    options: string[];
    correct: string;
};

type GameContextType = {
    words: Word[] | null;
    setWords: React.Dispatch<React.SetStateAction<Word[] | null>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [words, setWords] = useState<Word[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <GameContext.Provider value={{ words, setWords, loading, setLoading }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameContext must be used within a GameProvider");
    }
    return context;
};