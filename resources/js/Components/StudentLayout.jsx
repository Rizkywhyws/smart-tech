import { useEffect, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
    BarChart3,
    BookOpen,
    CalendarDays,
    ClipboardList,
    GraduationCap,
    Home,
    LogOut,
    Menu,
    Moon,
    Sun,
    X,
} from "lucide-react";
import useTheme from "../hooks/useTheme";
import { todayLabel } from "../lib/Student";

const NAV = [
    { href: "/dashboard", label: "Beranda", icon: Home },
    { href: "/siswa/jadwal", label: "Jadwal Pelajaran", icon: CalendarDays },
    { href: "/siswa/tugas", label: "Tugas dan Ujian", icon: ClipboardList },
    { href: "/siswa/nilai", label: "Nilai dan Presensi", icon: BarChart3 },
    { href: "/siswa/mapel", label: "Mata Pelajaran", icon: BookOpen },
];

function initials(name = "") {
    return (
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0].toUpperCase())
            .join("") || "?"
    );
}

export default function StudentLayout({ title, subtitle, children }) {
    const { props, url } = usePage();
    const user = props.auth?.user ?? props.user;
    const path = url.split("?")[0].split("#")[0];

    const [dark, toggleTheme] = useTheme();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;

        const onKey = (e) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);

        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const close = () => setOpen(false);

    return (
        <div className="flex min-h-screen bg-surface font-sans text-on-surface antialiased">
            {open && (
                <div
                    onClick={close}
                    aria-hidden="true"
                    className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-outline-variant bg-surface p-5 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between gap-2">
                        <Link
                            href="/dashboard"
                            onClick={close}
                            className="flex items-center gap-3 rounded-xl"
                        >
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-brand-from to-brand-to text-white">
                                <GraduationCap size={22} aria-hidden="true" />
                            </span>

                            <span className="flex flex-col leading-none">
                                <span className="font-display text-lg font-extrabold">
                                    SmartTech
                                </span>
                                <span className="mt-1 text-xs font-medium text-on-surface-variant">
                                    Portal Siswa
                                </span>
                            </span>
                        </Link>

                        <button
                            type="button"
                            onClick={close}
                            aria-label="Tutup menu"
                            className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-on-surface-variant hover:bg-surface-low lg:hidden"
                        >
                            <X size={18} aria-hidden="true" />
                        </button>
                    </div>

                    <nav
                        aria-label="Navigasi siswa"
                        className="flex flex-col gap-1"
                    >
                        {NAV.map((item) => {
                            const isActive = path === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    prefetch
                                    cacheFor="30s"
                                    aria-current={isActive ? "page" : undefined}
                                    onClick={close}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                                        isActive
                                            ? "bg-linear-to-r from-brand-from to-brand-to text-white shadow-md shadow-brand-from/25"
                                            : "text-on-surface-variant hover:bg-surface-low hover:text-on-surface"
                                    }`}
                                >
                                    <item.icon size={18} aria-hidden="true" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex flex-col gap-3 border-t border-outline-variant pt-4">
                    <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-secondary-container text-sm font-bold text-on-secondary-container">
                            {initials(user?.name)}
                        </span>

                        <div className="min-w-0 leading-tight">
                            <p className="truncate text-sm font-semibold">
                                {user?.name}
                            </p>
                            <p className="truncate text-xs tabular-nums text-on-surface-variant">
                                {user?.identifier
                                    ? `NIS ${user.identifier}`
                                    : "Siswa"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.post("/logout")}
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-outline-variant px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-low hover:text-error"
                    >
                        <LogOut size={16} aria-hidden="true" />
                        Keluar
                    </button>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-20 border-b border-outline-variant/60 bg-surface/80 px-5 py-3.5 backdrop-blur-xl sm:px-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                aria-label="Buka menu navigasi"
                                className="grid h-10 w-10 flex-none cursor-pointer place-items-center rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-low lg:hidden"
                            >
                                <Menu size={18} aria-hidden="true" />
                            </button>

                            <div className="min-w-0 leading-tight">
                                <p className="truncate font-display text-xl font-bold">
                                    {title}
                                </p>
                                <p className="truncate text-xs text-on-surface-variant">
                                    {subtitle ?? todayLabel()}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={
                                dark
                                    ? "Gunakan tema terang"
                                    : "Gunakan tema gelap"
                            }
                            className="grid h-10 w-10 flex-none cursor-pointer place-items-center rounded-xl border border-outline-variant text-on-surface-variant transition hover:bg-surface-low hover:text-on-surface"
                        >
                            {dark ? (
                                <Sun size={18} aria-hidden="true" />
                            ) : (
                                <Moon size={18} aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-8 sm:px-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
