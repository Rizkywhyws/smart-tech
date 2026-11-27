import { useLayoutEffect, useState } from "react";

export default function useTheme() {
    const [dark, setDark] = useState(() => {
        if (typeof window === "undefined") return false;

        try {
            const saved = window.localStorage.getItem("st-theme");
            if (saved) return saved === "dark";
        } catch {}

        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useLayoutEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
    }, [dark]);

    const toggle = () => {
        const next = !dark;
        setDark(next);
        try {
            window.localStorage.setItem("st-theme", next ? "dark" : "light");
        } catch {}
    };

    return [dark, toggle];
}