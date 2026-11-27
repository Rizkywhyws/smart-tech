import { useCallback, useEffect, useRef, useState } from "react";

const FADE_MS = 150;

export default function SuccessModal({
    open,
    title,
    description,
    onClose,
    duration = 1500,
}) {
    const [leaving, setLeaving] = useState(false);
    const dialogRef = useRef(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    });

    const dismiss = useCallback(() => {
        setLeaving(true);
        setTimeout(() => onCloseRef.current?.(), FADE_MS);
    }, []);

    useEffect(() => {
        if (!open) return;

        setLeaving(false);

        const previous = document.activeElement;
        dialogRef.current?.focus();

        const timer = setTimeout(dismiss, duration);
        const onKey = (e) => e.key === "Escape" && dismiss();
        window.addEventListener("keydown", onKey);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("keydown", onKey);
            previous?.focus?.();
        };
    }, [open, duration, dismiss]);

    if (!open) return null;

    return (
        <div
            onClick={dismiss}
            className={`fixed inset-0 z-[100] grid place-items-center bg-black/45 px-6 backdrop-blur-sm transition-opacity duration-150 motion-safe:animate-fade-in ${
                leaving ? "opacity-0" : "opacity-100"
            }`}
        >
            <div
                ref={dialogRef}
                tabIndex={-1}
                role="alertdialog"
                aria-modal="true"
                aria-label={title}
                onClick={(e) => e.stopPropagation()}
                className="flex w-full max-w-xs flex-col items-center rounded-3xl border border-outline-variant bg-surface px-8 py-9 text-center shadow-2xl shadow-black/30 outline-none motion-safe:animate-pop"
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
                    {title}
                </p>

                {description && (
                    <p className="mt-1.5 text-[13px] leading-relaxed text-on-surface-variant">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}