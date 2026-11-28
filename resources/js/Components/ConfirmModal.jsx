import { useEffect, useRef } from "react";
import { TriangleAlert } from "lucide-react";

export default function ConfirmModal({
    open,
    title,
    description,
    confirmLabel = "Hapus",
    processing = false,
    onConfirm,
    onClose,
}) {
    const cancelRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        cancelRef.current?.focus();

        const onKey = (e) => {
            if (e.key === "Escape" && !processing) onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, processing, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 animate-fade-in"
            onClick={() => !processing && onClose()}
        >
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-desc"
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-3xl border border-outline-variant bg-surface-lowest p-6 shadow-2xl animate-pop"
            >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-error/15 text-error">
                    <TriangleAlert size={24} aria-hidden="true" />
                </div>

                <h2
                    id="confirm-title"
                    className="mt-4 font-display text-xl font-bold text-on-surface"
                >
                    {title}
                </h2>

                <p
                    id="confirm-desc"
                    className="mt-2 text-sm text-on-surface-variant"
                >
                    {description}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        ref={cancelRef}
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="cursor-pointer rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm font-semibold text-on-surface transition hover:bg-surface-low disabled:opacity-60"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="cursor-pointer rounded-xl bg-error px-4 py-2.5 text-sm font-semibold text-surface transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? "Menghapus..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}