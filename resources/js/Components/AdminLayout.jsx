import { useEffect, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
    BarChart3,
    BookOpen,
    CalendarDays,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    Sun,
    Users,
    X,
} from "lucide-react";
import useTheme from "../hooks/useTheme";

const NAV = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        active: (url) => url === "/admin" || url.startsWith("/admin?"),
    },
    {
        label: "Pengguna dan Akun",
        href: "/admin/pengguna",
        icon: Users,
        active: (url) => url.startsWith("/admin/pengguna"),
    },
    { label: "Kelas dan Kurikulum", icon: BookOpen, soon: true },
    { label: "Jadwal dan Presensi", icon: CalendarDays, soon: true },
    { label: "Laporan Nilai", icon: BarChart3, soon: true },
];

const ROLE_LABEL = {
    admin: "Admin",
    guru: "Guru / Dosen",
    siswa: "Siswa",
    mahasiswa: "Mahasiswa",
};

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

function NavItem({ item, current, pending, onNavigate, onStart }) {
    const base =
        "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors";

    if (item.soon) {
        return (
            <div
                aria-disabled="true"
                className={`${base} cursor-not-allowed text-on-surface-variant/60`}
            >
                <item.icon size={18} aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
                <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    Segera
                </span>
            </div>
        );
    }

    const active = pending ? pending === item.href : item.active(current);

    return (
        <Link
            href={item.href}
            prefetch
            cacheFor={10000}
            onClick={() => {
                onStart(item.href);
                onNavigate();
            }}
            aria-current={active ? "page" : undefined}
            className={`${base} ${
                active
                    ? "bg-linear-to-r from-brand-from to-brand-to text-white shadow-md shadow-brand-from/25"
                    : "text-on-surface-variant hover:bg-surface-low hover:text-on-surface"
            }`}
        >
            <item.icon size={18} aria-hidden="true" />
            {item.label}
        </Link>
    );
}

export default function AdminLayout({ title, subtitle, actions, children }) {
    const { props, url } = usePage();
    const user = props.auth?.user;
    const [dark, toggleTheme] = useTheme();
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(null);
    useEffect(() => router.on("finish", () => setPending(null)), []);

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
                            href="/admin"
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
                                    Panel Admin
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
                        aria-label="Navigasi admin"
                        className="flex flex-col gap-1"
                    >
                        {NAV.map((item) => (
                            <NavItem
                                key={item.label}
                                item={item}
                                current={url}
                                pending={pending}
                                onNavigate={close}
                                onStart={setPending}
                            />
                        ))}
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

                            <p className="truncate text-xs text-on-surface-variant">
                                {ROLE_LABEL[user?.role] ?? user?.role}
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
                                <h1 className="truncate font-display text-xl font-bold">
                                    {title}
                                </h1>

                                {subtitle && (
                                    <p className="truncate text-xs text-on-surface-variant">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-none items-center gap-2">
                            {actions}

                            <button
                                type="button"
                                onClick={toggleTheme}
                                aria-label={
                                    dark
                                        ? "Gunakan tema terang"
                                        : "Gunakan tema gelap"
                                }
                                className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-outline-variant text-on-surface-variant transition hover:bg-surface-low hover:text-on-surface"
                            >
                                {dark ? (
                                    <Sun size={18} aria-hidden="true" />
                                ) : (
                                    <Moon size={18} aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                <main
                    className={`mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 px-5 py-8 transition-opacity duration-150 sm:px-6 ${
                        pending ? "opacity-60" : "opacity-100"
                    }`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
