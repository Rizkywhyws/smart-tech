import { Link, router, usePage } from "@inertiajs/react";
import { GraduationCap, LogOut, Moon, Sun } from "lucide-react";
import useTheme from "../hooks/useTheme";

const ROLE_LABEL = {
    admin: "Admin",
    guru: "Guru / Dosen",
    siswa: "Siswa",
    mahasiswa: "Mahasiswa",
};

export default function AppHeader() {
    const { auth } = usePage().props;
    const [dark, toggleTheme] = useTheme();

    return (
        <header className="sticky top-0 z-40 border-b border-outline-variant/60 bg-surface/80 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-5 py-3 sm:px-6">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-brand-from to-brand-to text-white">
                        <GraduationCap size={22} aria-hidden="true" />
                    </span>

                    <span className="font-display text-xl font-extrabold text-on-surface">
                        SmartTech
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    {auth?.user && (
                        <div className="mr-1 hidden text-right leading-tight sm:block">
                            <p className="text-sm font-semibold text-on-surface">
                                {auth.user.name}
                            </p>

                            <p className="text-xs text-on-surface-variant">
                                {ROLE_LABEL[auth.user.role] ?? auth.user.role}
                            </p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={
                            dark ? "Gunakan tema terang" : "Gunakan tema gelap"
                        }
                        className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-outline-variant text-on-surface-variant transition hover:bg-surface-low hover:text-on-surface"
                    >
                        {dark ? (
                            <Sun size={18} aria-hidden="true" />
                        ) : (
                            <Moon size={18} aria-hidden="true" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.post("/logout")}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-outline-variant px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-low hover:text-on-surface"
                    >
                        <LogOut size={16} aria-hidden="true" />
                        <span className="hidden sm:inline">Keluar</span>
                    </button>
                </div>
            </div>
        </header>
    );
}