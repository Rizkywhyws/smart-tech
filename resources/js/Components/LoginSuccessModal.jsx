import { useEffect, useState } from "react";

const LOGIN_EVENT = "st:login-success";
const SHOW_MS = 800;
const FADE_MS = 150;    

export function announceLogin(page) {
    if (!page?.props?.auth?.user || typeof window === "undefined") return;

    window.dispatchEvent(new CustomEvent(LOGIN_EVENT));
}

export default function LoginSuccessModal() {
    const [open, setOpen] = useState(false);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        let leaveTimer;
        let hideTimer;

        const onLogin = () => {
            clearTimeout(leaveTimer);
            clearTimeout(hideTimer);

            setLeaving(false);
            setOpen(true);

            leaveTimer = setTimeout(() => setLeaving(true), SHOW_MS);
            hideTimer = setTimeout(() => setOpen(false), SHOW_MS + FADE_MS);
        };

        window.addEventListener(LOGIN_EVENT, onLogin);

        return () => {
            window.removeEventListener(LOGIN_EVENT, onLogin);
            clearTimeout(leaveTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    if (!open) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] grid place-items-center bg-black/45 px-6 backdrop-blur-sm transition-opacity duration-200 motion-safe:animate-fade-in ${
                leaving ? "opacity-0" : "opacity-100"
            }`}
        >
            <div
                role="alertdialog"
                aria-modal="true"
                aria-label="Login berhasil"
                className="flex w-full max-w-xs flex-col items-center rounded-3xl border border-outline-variant bg-surface px-8 py-9 text-center shadow-2xl shadow-black/30 motion-safe:animate-pop"
            >
                <span className="grid h-20 w-20 place-items-center rounded-full bg-linear-to-br from-brand-from to-brand-to shadow-lg shadow-brand-from/30">
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 52 52"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M14 27l8 8 16-18"
                            pathLength="1"
                            stroke="#ffffff"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="1"
                            strokeDashoffset="0"
                            className="motion-safe:animate-draw"
                        />
                    </svg>
                </span>

                <p className="mt-5 font-display text-xl font-bold text-on-surface">
                    Login berhasil
                </p>
            </div>
        </div>
    );
}
