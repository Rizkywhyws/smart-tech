import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import { useCountUp } from "../lib/Student";

export const CARD =
    "rounded-3xl border border-outline-variant bg-surface-low shadow-sm";

export function CardHeader({ title, description, action }) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h2 className="font-display text-lg font-bold text-on-surface">
                    {title}
                </h2>

                {description && (
                    <p className="mt-0.5 text-[13px] text-on-surface-variant">
                        {description}
                    </p>
                )}
            </div>

            {action}
        </div>
    );
}

export function SeeAll({ href }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-secondary-container"
        >
            Lihat semua
            <ArrowRight size={13} aria-hidden="true" />
        </Link>
    );
}

export function Tabs({ label, items, value, onChange }) {
    return (
        <div
            role="tablist"
            aria-label={label}
            className="inline-flex gap-1 rounded-xl border border-outline-variant bg-surface p-1"
        >
            {items.map(({ key, text }) => (
                <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={value === key}
                    onClick={() => onChange(key)}
                    className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        value === key
                            ? "bg-linear-to-r from-brand-from to-brand-to text-white shadow-sm"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}
                >
                    {text}
                </button>
            ))}
        </div>
    );
}

export function Chip({ icon: Icon, children }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface-low px-3 py-1 text-xs font-semibold text-on-surface-variant">
            <Icon size={13} aria-hidden="true" className="text-primary" />
            {children}
        </span>
    );
}

export function Stat({ icon: Icon, label, value, decimals = 0, suffix = "", hint }) {
    const factor = 10 ** decimals;
    const shown = useCountUp(Math.round(value * factor)) / factor;

    return (
        <article className={`${CARD} flex flex-col justify-between gap-4 p-5`}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary-container text-primary">
                <Icon size={18} aria-hidden="true" />
            </span>

            <div>
                <p className="font-display text-3xl font-extrabold tabular-nums text-on-surface">
                    {shown.toLocaleString("id-ID", {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals,
                    })}
                    {suffix}
                </p>

                <p className="mt-0.5 text-sm font-semibold text-on-surface">{label}</p>
                <p className="text-xs text-on-surface-variant">{hint}</p>
            </div>
        </article>
    );
}