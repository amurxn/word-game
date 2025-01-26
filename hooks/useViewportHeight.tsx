"use client";

import { useEffect } from "react";

export const useViewportHeight = () => {
    useEffect(() => {
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01; // 1% of the viewport height
            document.documentElement.style.setProperty("--vh", `${vh}px`);
        };

        setViewportHeight();

        window.addEventListener("resize", setViewportHeight);
        return () => window.removeEventListener("resize", setViewportHeight);
    }, []);
};