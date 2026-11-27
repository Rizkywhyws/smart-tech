import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { announceLogin } from "../Components/LoginSuccessModal";
import {
    ArrowLeft,
    Check,
    Eye,
    EyeOff,
    GraduationCap,
    Info,
    KeyRound,
    Lock,
    LogIn,
    Mail,
    Moon,
    ShieldCheck,
    Sun,
    User,
} from "lucide-react";
import useTheme from "../hooks/useTheme";

const BENEFITS = [
    "Materi terstruktur dan rekaman kelas",
    "Pengumpulan tugas dan ujian daring",
    "Jadwal, presensi, dan rekap nilai",
];

const WRAP = "mx-auto w-full max-w-[960px]";
const BTN_PRIMARY =
    "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-from to-brand-to px-6 py-3 text-[15px] font-semibold text-white shadow-lg shadow-brand-from/25 transition duration-150 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";
const INPUT =
    "w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-[15px] text-on-surface placeholder:text-outline transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 aria-invalid:border-error aria-invalid:ring-error/20";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({ id, label, icon: Icon, error, trailing, ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={id}
                className="text-[13px] font-semibold text-on-surface"
            >
                {label}
            </label>

            <div className="relative flex items-center">
                {Icon && (
                    <Icon
                        size={18}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 text-outline"
                    />
                )}

                <input
                    id={id}
                    aria-invalid={error ? "true" : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={`${INPUT} ${Icon ? "pl-11" : ""} ${
                        trailing ? "pr-12" : ""
                    }`}
                    {...props}
                />

                {trailing}
            </div>

            {error && (
                <p
                    id={`${id}-error`}
                    className="text-xs font-medium text-error"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

function PasswordField({ id, label, error, ...props }) {
    const [show, setShow] = useState(false);

    return (
        <Field
            id={id}
            label={label}
            icon={Lock}
            error={error}
            type={show ? "text" : "password"}
            trailing={
                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={
                        show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                    }
                    className="absolute right-2.5 grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-outline transition-colors hover:text-on-surface"
                >
                    {show ? (
                        <EyeOff size={18} aria-hidden="true" />
                    ) : (
                        <Eye size={18} aria-hidden="true" />
                    )}
                </button>
            }
            {...props}
        />
    );
}

function Notice({ icon: Icon = Info, children }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-outline-variant bg-surface-low p-3.5 text-[13px] leading-relaxed text-on-surface-variant">
            <Icon
                size={18}
                aria-hidden="true"
                className="mt-0.5 flex-none text-primary"
            />
            <p>{children}</p>
        </div>
    );
}

function LoginForm({ canRegisterAdmin, onSwitch }) {
    const form = useForm({ identity: "", password: "", remember: false });

    const change = (key) => (e) => {
        form.setData(
            key,
            e.target.type === "checkbox" ? e.target.checked : e.target.value,
        );
        if (form.errors[key]) form.clearErrors(key);
    };

    const submit = (e) => {
        e.preventDefault();

        const next = {};
        if (!form.data.identity.trim())
            next.identity = "Masukkan NIS, NIM, NIP, atau email Anda.";
        if (!form.data.password) next.password = "Masukkan kata sandi Anda.";

        if (Object.keys(next).length) {
            form.setError(next);
            return;
        }

        form.clearErrors();
        form.post("/login", {
            onSuccess: (page) => announceLogin(page),
            onFinish: () => form.reset("password"),
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="font-display text-[22px] font-bold leading-snug text-on-surface">
                    Masuk ke Portal
                </h2>

                <p className="mt-1 text-[13px] text-on-surface-variant">
                    Gunakan NIS, NIM, NIP, atau email yang diberikan institusi
                    Anda.
                </p>
            </div>

            <form onSubmit={submit} noValidate className="flex flex-col gap-4">
                <Field
                    id="login-identity"
                    label="NIS / NIM / NIP atau Email"
                    icon={User}
                    type="text"
                    placeholder="2026104011 atau nama@kampus.ac.id"
                    autoComplete="username"
                    value={form.data.identity}
                    onChange={change("identity")}
                    error={form.errors.identity}
                />

                <PasswordField
                    id="login-password"
                    label="Kata Sandi"
                    placeholder="Masukkan kata sandi"
                    autoComplete="current-password"
                    value={form.data.password}
                    onChange={change("password")}
                    error={form.errors.password}
                />

                <label className="inline-flex cursor-pointer items-center gap-2 self-start text-[13px] text-on-surface-variant">
                    <input
                        type="checkbox"
                        checked={form.data.remember}
                        onChange={change("remember")}
                        className="h-4 w-4 cursor-pointer rounded border-outline-variant accent-brand-from"
                    />
                    Ingat saya
                </label>

                <button
                    type="submit"
                    disabled={form.processing}
                    className={BTN_PRIMARY}
                >
                    <LogIn size={18} aria-hidden="true" />
                    {form.processing ? "Memproses..." : "Masuk ke Portal"}
                </button>
            </form>

            {canRegisterAdmin ? (
                <Notice icon={ShieldCheck}>
                    Portal ini belum memiliki admin.{" "}
                    <button
                        type="button"
                        onClick={onSwitch}
                        className="cursor-pointer font-semibold text-primary hover:underline"
                    >
                        Daftar sebagai admin pertama
                    </button>
                    .
                </Notice>
            ) : (
                <Notice>
                    Belum memiliki akun? Akun siswa, mahasiswa, dan guru dibuat
                    oleh admin institusi. Hubungi admin sekolah atau kampus
                    Anda.
                </Notice>
            )}
        </div>
    );
}

function RegisterAdminForm({ onSwitch }) {
    const form = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const change = (key) => (e) => {
        form.setData(key, e.target.value);
        if (form.errors[key]) form.clearErrors(key);
    };

    const submit = (e) => {
        e.preventDefault();

        const d = form.data;
        const next = {};
        if (!d.name.trim()) next.name = "Nama lengkap wajib diisi.";
        if (!EMAIL_RE.test(d.email.trim()))
            next.email = "Masukkan email yang valid.";
        if (
            d.password.length < 8 ||
            !/[a-z]/.test(d.password) ||
            !/[A-Z]/.test(d.password) ||
            !/\d/.test(d.password)
        )
            next.password =
                "Minimal 8 karakter, memuat huruf besar, huruf kecil, dan angka.";
        if (d.password !== d.password_confirmation)
            next.password_confirmation = "Konfirmasi kata sandi tidak cocok.";

        if (Object.keys(next).length) {
            form.setError(next);
            return;
        }

        form.clearErrors();
        form.post("/register-admin", {
            onSuccess: (page) => announceLogin(page),
            onFinish: () => form.reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="font-display text-[22px] font-bold leading-snug text-on-surface">
                    Daftar Admin Pertama
                </h2>

                <p className="mt-1 text-[13px] text-on-surface-variant">
                    Admin mengelola akun siswa, mahasiswa, dan guru.
                </p>
            </div>

            <Notice icon={ShieldCheck}>
                Pendaftaran ini hanya tersedia sekali, selama belum ada admin.
                Setelah itu, akun baru hanya bisa dibuat oleh admin.
            </Notice>

            <form onSubmit={submit} noValidate className="flex flex-col gap-4">
                <Field
                    id="reg-name"
                    label="Nama Lengkap"
                    icon={User}
                    type="text"
                    placeholder="Nama admin"
                    autoComplete="name"
                    value={form.data.name}
                    onChange={change("name")}
                    error={form.errors.name}
                />

                <Field
                    id="reg-email"
                    label="Email"
                    icon={Mail}
                    type="email"
                    inputMode="email"
                    placeholder="admin@sekolah.ac.id"
                    autoComplete="email"
                    value={form.data.email}
                    onChange={change("email")}
                    error={form.errors.email}
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <PasswordField
                        id="reg-password"
                        label="Kata Sandi"
                        placeholder="Min. 8 karakter, huruf besar-kecil, angka"
                        autoComplete="new-password"
                        value={form.data.password}
                        onChange={change("password")}
                        error={form.errors.password}
                    />

                    <PasswordField
                        id="reg-password-confirm"
                        label="Ulangi Kata Sandi"
                        placeholder="Ketik ulang kata sandi"
                        autoComplete="new-password"
                        value={form.data.password_confirmation}
                        onChange={change("password_confirmation")}
                        error={form.errors.password_confirmation}
                    />
                </div>

                <button
                    type="submit"
                    disabled={form.processing}
                    className={BTN_PRIMARY}
                >
                    <ShieldCheck size={18} aria-hidden="true" />
                    {form.processing ? "Memproses..." : "Buat Akun Admin"}
                </button>
            </form>

            <p className="text-center text-[13px] text-on-surface-variant">
                Sudah punya akun?{" "}
                <button
                    type="button"
                    onClick={onSwitch}
                    className="cursor-pointer font-semibold text-primary hover:underline"
                >
                    Masuk di sini
                </button>
            </p>
        </div>
    );
}

export default function Login({ canRegisterAdmin = false }) {
    const [dark, toggleTheme] = useTheme();
    const [mode, setMode] = useState("login");

    const tabClass = (active) =>
        `cursor-pointer rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-all duration-150 ${
            active
                ? "bg-linear-to-r from-brand-from to-brand-to text-white shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
        }`;

    return (
        <>
            <Head title="Masuk: SmartTech" />

            <div className="flex min-h-screen flex-col justify-between gap-8 bg-surface px-5 py-6 font-sans text-on-surface antialiased sm:px-6">
                <header
                    className={`${WRAP} flex items-center justify-between gap-4`}
                >
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-xl"
                    >
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-brand-from to-brand-to text-white">
                            <GraduationCap size={22} aria-hidden="true" />
                        </span>

                        <span className="font-display text-xl font-extrabold text-on-surface">
                            SmartTech
                        </span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-primary hover:underline"
                        >
                            <ArrowLeft size={16} aria-hidden="true" />
                            <span className="hidden sm:inline">
                                Kembali ke Beranda
                            </span>
                            <span className="sm:hidden">Beranda</span>
                        </Link>

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
                </header>

                <main className={WRAP}>
                    <div className="grid overflow-hidden rounded-3xl border border-outline-variant bg-surface shadow-xl shadow-brand-from/10 lg:grid-cols-12">
                        <aside className="flex flex-col justify-between gap-10 bg-linear-to-br from-brand-from to-brand-to p-8 text-white sm:p-10 lg:col-span-5">
                            <div className="flex flex-col gap-4">
                                <span className="self-start rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-from">
                                    Portal Akademik
                                </span>

                                <h1 className="font-display text-[1.75rem] font-extrabold leading-tight text-balance">
                                    Akses Ruang Belajar Digital Anda
                                </h1>

                                <p className="text-[15px] leading-relaxed text-white/90 text-pretty">
                                    Masuk dengan akun yang diberikan institusi
                                    Anda untuk mengikuti kelas, mengumpulkan
                                    tugas, dan memantau perkembangan akademik.
                                </p>
                            </div>

                            <ul className="flex flex-col gap-3.5">
                                {BENEFITS.map((b) => (
                                    <li
                                        key={b}
                                        className="flex items-center gap-3 text-sm"
                                    >
                                        <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-white/20">
                                            <Check
                                                size={14}
                                                strokeWidth={2.5}
                                                aria-hidden="true"
                                            />
                                        </span>
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </aside>

                        <section className="flex flex-col gap-6 p-8 sm:p-10 lg:col-span-7">
                            {canRegisterAdmin && (
                                <div
                                    role="tablist"
                                    aria-label="Mode autentikasi"
                                    className="grid grid-cols-2 gap-1.5 rounded-xl border border-outline-variant bg-surface-low p-1"
                                >
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={mode === "login"}
                                        onClick={() => setMode("login")}
                                        className={tabClass(mode === "login")}
                                    >
                                        Masuk
                                    </button>

                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={mode === "register"}
                                        onClick={() => setMode("register")}
                                        className={tabClass(
                                            mode === "register",
                                        )}
                                    >
                                        Daftar Admin
                                    </button>
                                </div>
                            )}

                            {canRegisterAdmin && mode === "register" ? (
                                <RegisterAdminForm
                                    key="register"
                                    onSwitch={() => setMode("login")}
                                />
                            ) : (
                                <LoginForm
                                    key="login"
                                    canRegisterAdmin={canRegisterAdmin}
                                    onSwitch={() => setMode("register")}
                                />
                            )}
                        </section>
                    </div>
                </main>

                <footer className={`${WRAP} text-center`}>
                    <p className="text-[13px] text-on-surface-variant">
                        © {new Date().getFullYear()} SmartTech · Sistem
                        Informasi E-Learning Sekolah dan Kampus
                    </p>
                </footer>
            </div>
        </>
    );
}
