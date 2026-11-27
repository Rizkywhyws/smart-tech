import { useLayoutEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowUp,
    Backpack,
    BookOpen,
    CalendarDays,
    Check,
    ClipboardCheck,
    Clock,
    FileText,
    GraduationCap,
    Landmark,
    LogIn,
    Menu,
    Moon,
    Sun,
    TrendingUp,
    Video,
    X,
} from "lucide-react";

const NAV_LINKS = [
    { href: "#fitur", label: "Fitur" },
    { href: "#jenjang", label: "Jenjang" },
];

const HERO_POINTS = [
    "Ruang belajar digital yang lebih terorganisasi",
    "Materi, tugas, jadwal, dan nilai di satu tempat",
    "Akses fleksibel melalui ponsel maupun laptop",
];

const SCHEDULE = [
    {
        time: "08.00",
        title: "Pemrograman Web",
        place: "Ruang 3.2",
        mode: "Tatap muka",
        now: true,
    },
    {
        time: "10.30",
        title: "Basis Data",
        place: "Tautan kelas daring",
        mode: "Daring",
    },
    {
        time: "13.00",
        title: "Statistika",
        place: "Ruang 2.1",
        mode: "Tatap muka",
    },
];

const MATERI = [
    {
        icon: Video,
        title: "Pertemuan 5: Routing dan controller",
        type: "Video",
    },
    { icon: FileText, title: "Modul praktikum Laravel", type: "PDF" },
    { icon: FileText, title: "Ringkasan materi minggu ini", type: "Slide" },
];

const WEEK = ["Sen", "Sel", "Rab", "Kam", "Jum"];

const BARS = [
    { label: "Tugas 1", value: 52 },
    { label: "Tugas 2", value: 64 },
    { label: "Kuis", value: 58 },
    { label: "UTS", value: 78 },
    { label: "Tugas 3", value: 88 },
];

const JENJANG = [
    {
        icon: Backpack,
        title: "Untuk Sekolah (SMP / SMA / SMK)",
        text: "Kelola jadwal pelajaran harian, latihan soal ujian sekolah, tugas proyek, dan pantauan wali kelas.",
        cta: "Jelajahi fitur pembelajaran",
        points: [
            "Jadwal pelajaran harian",
            "Latihan soal ujian sekolah",
            "Tugas proyek dan pantauan wali kelas",
        ],
    },
    {
        icon: Landmark,
        title: "Untuk Perguruan Tinggi",
        text: "Terintegrasi dengan KRS semester, forum diskusi mata kuliah, presensi kelas, dan bimbingan tugas akhir.",
        cta: "Jelajahi fitur pembelajaran",
        points: [
            "KRS semester",
            "Forum diskusi mata kuliah",
            "Presensi kelas dan bimbingan tugas akhir",
        ],
    },
];

const LOGIN_URL = "/login";
const FOOTER_COLUMNS = [
    {
        title: "Platform",
        links: [
            { href: "#fitur", label: "Fitur" },
            { href: "#jenjang", label: "Jenjang" },
        ],
    },
    {
        title: "Fitur Utama",
        links: [
            { href: "#fitur", label: "Materi dan modul" },
            { href: "#fitur", label: "Tugas dan kuis" },
            { href: "#fitur", label: "Jadwal dan presensi" },
            { href: "#fitur", label: "Rekap nilai" },
        ],
    },
    {
        title: "Jenjang",
        links: [
            { href: "#jenjang", label: "SMP / SMA / SMK" },
            { href: "#jenjang", label: "Perguruan Tinggi" },
        ],
    },
    {
        title: "Pengguna",
        links: [
            { href: "#fitur", label: "Siswa dan mahasiswa" },
            { href: "#fitur", label: "Guru dan dosen" },
            { href: "#fitur", label: "Wali kelas" },
        ],
    },
];
const WRAP = "mx-auto w-full max-w-[1240px] px-5 sm:px-6";
const BTN =
    "inline-flex items-center justify-center gap-2 rounded-xl text-[15px] font-semibold leading-tight transition duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const SIZE_MD = "px-6 py-3";
const SIZE_SM = "px-5 py-2.5";
const BTN_PRIMARY =
    "bg-linear-to-r from-brand-from to-brand-to text-white shadow-lg shadow-brand-from/25 hover:brightness-110";
const BTN_SECONDARY =
    "border border-outline-variant bg-surface text-primary hover:bg-surface-low";
const SECTION = "scroll-mt-20 py-20 lg:py-28";
const H2 =
    "font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-tight tracking-tight text-on-surface text-balance";
const TILE =
    "flex flex-col gap-6 rounded-3xl border border-outline-variant/70 bg-surface-low p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-from/5 sm:p-9";

function useTheme() {
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

function Brand() {
    return (
        <a
            href="#top"
            aria-label="SmartTech, kembali ke atas"
            className="flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-brand-from to-brand-to text-white">
                <GraduationCap size={22} aria-hidden="true" />
            </span>

            <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-extrabold text-on-surface">
                    SmartTech
                </span>

                <span className="mt-1 hidden text-xs font-medium text-on-surface-variant sm:block">
                    E-Learning Akademik
                </span>
            </span>
        </a>
    );
}

function Navbar({ dark, onToggleTheme }) {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-outline-variant/60 bg-surface/80 backdrop-blur-xl">
            <div
                className={`${WRAP} flex items-center justify-between gap-4 py-3`}
            >
                <Brand />

                <nav
                    aria-label="Navigasi utama"
                    className="hidden items-center gap-8 md:flex"
                >
                    {NAV_LINKS.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            className="text-[15px] font-semibold text-on-surface-variant transition-colors hover:text-primary"
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onToggleTheme}
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

                    <Link
                        href={LOGIN_URL}
                        className={`${BTN} ${SIZE_SM} ${BTN_PRIMARY} hidden sm:inline-flex`}
                    >
                        <LogIn size={18} aria-hidden="true" />
                        Masuk
                    </Link>

                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        aria-expanded={open}
                        aria-controls="menu-mobile"
                        aria-label={open ? "Tutup menu" : "Buka menu"}
                        className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-outline-variant text-on-surface-variant md:hidden"
                    >
                        {open ? (
                            <X size={18} aria-hidden="true" />
                        ) : (
                            <Menu size={18} aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            {open && (
                <nav
                    id="menu-mobile"
                    aria-label="Navigasi seluler"
                    className="border-t border-outline-variant md:hidden"
                >
                    <div className={`${WRAP} py-2`}>
                        {NAV_LINKS.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className="block border-b border-outline-variant/60 py-3.5 font-semibold text-on-surface last:border-b-0"
                            >
                                {l.label}
                            </a>
                        ))}

                        <a
                            href={LOGIN_URL}
                            className={`${BTN} ${SIZE_MD} ${BTN_PRIMARY} my-3 w-full sm:hidden`}
                        >
                            <LogIn size={18} aria-hidden="true" />
                            Masuk
                        </a>
                    </div>
                </nav>
            )}
        </header>
    );
}

function ProgressRing({ value = 72 }) {
    const r = 38;
    const c = 2 * Math.PI * r;

    return (
        <div className="relative h-[92px] w-[92px]">
            <svg
                width="92"
                height="92"
                viewBox="0 0 92 92"
                className="-rotate-90"
            >
                <defs>
                    <linearGradient id="st-ring" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#38bdf8" />
                        <stop offset="1" stopColor="#1d4ed8" />
                    </linearGradient>
                </defs>

                <circle
                    cx="46"
                    cy="46"
                    r={r}
                    fill="none"
                    strokeWidth="9"
                    className="stroke-surface-high"
                />

                <circle
                    cx="46"
                    cy="46"
                    r={r}
                    fill="none"
                    strokeWidth="9"
                    strokeLinecap="round"
                    stroke="url(#st-ring)"
                    strokeDasharray={c}
                    strokeDashoffset={c * (1 - value / 100)}
                />
            </svg>

            <span className="absolute inset-0 grid place-items-center font-display text-xl font-bold text-on-surface">
                {value}%
            </span>
        </div>
    );
}

function HeroMockup() {
    return (
        <div className="relative mx-auto w-full max-w-[560px] pb-6 sm:pl-4">
            <div aria-hidden="true">
                <div className="rounded-[2rem] border border-outline-variant/70 bg-surface p-5 shadow-2xl shadow-brand-from/10 sm:p-7">
                    <div className="flex items-center justify-between">
                        <p className="font-display text-lg font-bold text-on-surface">
                            Jadwal hari ini
                        </p>

                        <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container">
                            3 kelas
                        </span>
                    </div>

                    <ul className="mt-4 grid gap-2.5">
                        {SCHEDULE.map((s) => (
                            <li
                                key={s.title}
                                className={`flex items-center gap-4 rounded-2xl p-3 ${
                                    s.now
                                        ? "bg-secondary-container"
                                        : "bg-surface-low"
                                }`}
                            >
                                <span className="w-12 text-sm font-bold tabular-nums text-primary">
                                    {s.time}
                                </span>

                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-semibold text-on-surface">
                                        {s.title}
                                    </span>

                                    <span className="block truncate text-xs text-on-surface-variant">
                                        {s.place}
                                    </span>
                                </span>

                                <span className="rounded-full border border-outline-variant bg-surface px-2.5 py-1 text-xs font-medium text-on-surface-variant">
                                    {s.mode}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 grid grid-cols-5 gap-3">
                        <div className="col-span-2 flex flex-col items-center gap-2 rounded-2xl bg-surface-low p-4 text-center">
                            <ProgressRing value={72} />

                            <span className="text-xs text-on-surface-variant">
                                Tugas semester ini selesai
                            </span>
                        </div>

                        <div className="col-span-3 flex flex-col justify-between gap-4 rounded-2xl bg-[radial-gradient(70%_80%_at_100%_0%,rgba(125,211,252,0.4),transparent_70%),linear-gradient(135deg,#1d4ed8,#0369a1)] p-4 text-white">
                            <div>
                                <p className="text-xs text-white/80">
                                    Tugas berikutnya
                                </p>

                                <p className="mt-1 font-display text-lg font-bold leading-snug">
                                    Laporan Praktikum 4
                                </p>

                                <p className="mt-2 flex items-center gap-1.5 text-xs text-white/90">
                                    <Clock size={14} aria-hidden="true" />
                                    Tenggat besok, 23.59
                                </p>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-white/25">
                                <div className="h-full w-3/5 rounded-full bg-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute -bottom-0 left-0 hidden items-center gap-3 rounded-2xl border border-outline-variant bg-surface p-3 pr-4 shadow-xl sm:flex lg:-left-6">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-brand-from to-brand-to text-white">
                        <TrendingUp size={18} aria-hidden="true" />
                    </span>

                    <span className="flex flex-col leading-tight">
                        <span className="text-sm font-bold text-on-surface">
                            Nilai baru masuk
                        </span>

                        <span className="text-xs text-on-surface-variant">
                            Kuis 3: 88
                        </span>
                    </span>
                </div>
            </div>

            <p className="mt-5 text-center text-xs text-on-surface-variant sm:mt-8">
                Pratinjau dashboard pembelajaran
            </p>
        </div>
    );
}

function Hero() {
    return (
        <section
            aria-labelledby="judul-hero"
            className="relative isolate overflow-hidden"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_50%_at_88%_0%,rgba(56,189,248,0.22),transparent_70%),radial-gradient(45%_45%_at_0%_25%,rgba(29,78,216,0.12),transparent_70%)]"
            />

            <div
                className={`${WRAP} grid items-center gap-14 py-16 lg:grid-cols-12 lg:py-24`}
            >
                <div className="flex flex-col gap-7 lg:col-span-6">
                    <h1
                        id="judul-hero"
                        className="font-display text-[clamp(2.25rem,4.6vw,3.6rem)] font-extrabold leading-[1.08] tracking-tight text-on-surface text-balance motion-safe:animate-rise"
                    >
                        Satu ruang belajar digital untuk berkembang lebih
                        terarah
                    </h1>

                    <p className="max-w-prose text-lg leading-relaxed text-on-surface-variant text-pretty [animation-delay:80ms] motion-safe:animate-rise">
                        SmartTech menghubungkan siswa, mahasiswa, dan pengajar
                        dalam satu sistem informasi e-learning terpadu, dari
                        materi kelas dan jadwal hingga pengumpulan tugas dan
                        nilai.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 [animation-delay:160ms] motion-safe:animate-rise">
                        <a
                            href="#fitur"
                            className={`${BTN} ${SIZE_MD} ${BTN_PRIMARY}`}
                        >
                            Jelajahi Fitur
                        </a>

                        <a
                            href="#jenjang"
                            className={`${BTN} ${SIZE_MD} ${BTN_SECONDARY}`}
                        >
                            Lihat Jenjang
                        </a>
                    </div>

                    <ul className="grid gap-3 border-t border-outline-variant pt-6 [animation-delay:240ms] motion-safe:animate-rise">
                        {HERO_POINTS.map((p) => (
                            <li
                                key={p}
                                className="flex items-center gap-3 text-[15px] text-on-surface-variant"
                            >
                                <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-secondary-container text-primary">
                                    <Check
                                        size={14}
                                        strokeWidth={2.5}
                                        aria-hidden="true"
                                    />
                                </span>

                                {p}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="[animation-delay:200ms] motion-safe:animate-rise lg:col-span-6">
                    <HeroMockup />
                </div>
            </div>
        </section>
    );
}

function FeatureHead({ icon: Icon, title, kicker, text }) {
    return (
        <div className="flex flex-col gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-brand-from to-brand-to text-white">
                <Icon size={22} aria-hidden="true" />
            </span>

            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-tertiary">
                    {kicker}
                </p>

                <h3 className="mt-1 font-display text-2xl font-bold leading-snug text-on-surface">
                    {title}
                </h3>

                <p className="mt-2 text-[15px] leading-relaxed text-on-surface-variant text-pretty">
                    {text}
                </p>
            </div>
        </div>
    );
}

function Features() {
    return (
        <section
            id="fitur"
            aria-labelledby="judul-fitur"
            className={`${SECTION} border-t border-outline-variant`}
        >
            <div className={WRAP}>
                <div className="mb-12 max-w-2xl">
                    <h2 id="judul-fitur" className={H2}>
                        Dirancang untuk alur belajar sekolah dan kampus
                    </h2>

                    <p className="mt-4 text-lg text-on-surface-variant text-pretty">
                        Setiap modul membantu siswa dan pengajar fokus pada
                        proses belajar tanpa hambatan administratif.
                    </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-6">
                    <article className={`${TILE} lg:col-span-4`}>
                        <FeatureHead
                            icon={BookOpen}
                            title="Materi dan modul terstruktur"
                            kicker="Kurikulum per pertemuan"
                            text="Akses slide presentasi, dokumen PDF, dan video penjelasan guru atau dosen yang tersusun rapi berdasarkan bab dan minggu perkuliahan."
                        />

                        <ul aria-hidden="true" className="mt-auto grid gap-2.5">
                            {MATERI.map((m) => (
                                <li
                                    key={m.title}
                                    className="flex items-center gap-3 rounded-2xl border border-outline-variant bg-surface p-3"
                                >
                                    <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-surface-container text-primary">
                                        <m.icon size={18} />
                                    </span>

                                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-on-surface">
                                        {m.title}
                                    </span>

                                    <span className="rounded-full bg-secondary-container px-2.5 py-1 text-xs font-semibold text-on-secondary-container">
                                        {m.type}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className={`${TILE} lg:col-span-2`}>
                        <FeatureHead
                            icon={ClipboardCheck}
                            title="Tugas, kuis, dan ujian daring"
                            kicker="Evaluasi otomatis"
                            text="Kumpulkan berkas sebelum tenggat, kerjakan kuis pilihan ganda atau esai, dan terima umpan balik dari pengajar."
                        />

                        <div
                            aria-hidden="true"
                            className="mt-auto grid gap-2.5"
                        >
                            <div className="flex items-center justify-between gap-3 rounded-2xl border border-outline-variant bg-surface p-3">
                                <span className="text-sm font-medium text-on-surface">
                                    Laporan Praktikum 4
                                </span>

                                <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant">
                                    <Clock size={14} />
                                    Besok
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-3 rounded-2xl border border-outline-variant bg-surface p-3">
                                <span className="text-sm font-medium text-on-surface">
                                    Kuis 3
                                </span>

                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                                    <Check size={14} strokeWidth={2.5} />
                                    Selesai
                                </span>
                            </div>
                        </div>
                    </article>

                    <article className={`${TILE} lg:col-span-2`}>
                        <FeatureHead
                            icon={CalendarDays}
                            title="Jadwal dan presensi"
                            kicker="Sinkronisasi kalender"
                            text="Lihat jadwal kelas hari ini, ruang tatap muka atau tautan kelas daring, serta catat kehadiran dengan cepat."
                        />

                        <div
                            aria-hidden="true"
                            className="mt-auto grid grid-cols-5 gap-2"
                        >
                            {WEEK.map((d, i) => (
                                <span
                                    key={d}
                                    className={`grid place-items-center rounded-xl py-2.5 text-sm font-semibold ${
                                        i === 2
                                            ? "bg-linear-to-br from-brand-from to-brand-to text-white"
                                            : "border border-outline-variant bg-surface text-on-surface-variant"
                                    }`}
                                >
                                    {d}
                                </span>
                            ))}
                        </div>
                    </article>

                    <article className={`${TILE} lg:col-span-4`}>
                        <FeatureHead
                            icon={TrendingUp}
                            title="Rekap nilai dan rapor digital"
                            kicker="Transparansi akademik"
                            text="Pantau perkembangan nilai tugas, UTS, UAS, hingga IPK atau nilai rapor semester dalam tampilan ringkas dan mudah dipahami."
                        />

                        <div aria-hidden="true" className="mt-auto">
                            <div className="flex h-24 items-end gap-3">
                                {BARS.map((b) => (
                                    <div
                                        key={b.label}
                                        style={{ height: `${b.value}%` }}
                                        className="flex-1 rounded-t-xl bg-linear-to-t from-brand-from to-brand-sky"
                                    />
                                ))}
                            </div>

                            <div className="mt-2 flex gap-3">
                                {BARS.map((b) => (
                                    <span
                                        key={b.label}
                                        className="flex-1 text-center text-xs text-on-surface-variant"
                                    >
                                        {b.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}

function Jenjang() {
    return (
        <section
            id="jenjang"
            aria-labelledby="judul-jenjang"
            className={`${SECTION} border-t border-outline-variant`}
        >
            <div className={WRAP}>
                <div className="mb-12 max-w-2xl">
                    <h2 id="judul-jenjang" className={H2}>
                        Siap digunakan di sekolah maupun perguruan tinggi
                    </h2>

                    <p className="mt-4 text-lg text-on-surface-variant text-pretty">
                        Pilih kategori institusi untuk melihat bagaimana
                        SmartTech mendukung lingkungan belajar yang relevan.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    {JENJANG.map((j) => (
                        <a
                            key={j.title}
                            href="#fitur"
                            className="group flex flex-col justify-between gap-8 rounded-3xl border border-outline-variant bg-surface-low p-7 transition-colors duration-150 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-9"
                        >
                            <div className="flex flex-col gap-5">
                                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-brand-from to-brand-to text-white">
                                    <j.icon size={22} aria-hidden="true" />
                                </span>

                                <div>
                                    <h3 className="font-display text-2xl font-bold leading-snug text-on-surface">
                                        {j.title}
                                    </h3>

                                    <p className="mt-2 text-[15px] leading-relaxed text-on-surface-variant text-pretty">
                                        {j.text}
                                    </p>
                                </div>

                                <ul className="grid gap-2.5">
                                    {j.points.map((p) => (
                                        <li
                                            key={p}
                                            className="flex items-center gap-3 text-sm text-on-surface"
                                        >
                                            <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-secondary-container text-primary">
                                                <Check
                                                    size={12}
                                                    strokeWidth={3}
                                                    aria-hidden="true"
                                                />
                                            </span>

                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <span className="text-[15px] font-semibold text-primary group-hover:underline">
                                {j.cta}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FinalCta() {
    return (
        <section className="pb-16 lg:pb-24">
            <div className={WRAP}>
                <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-[radial-gradient(60%_90%_at_95%_0%,rgba(125,211,252,0.4),transparent_70%),linear-gradient(135deg,#1d4ed8,#0369a1)] p-8 text-white shadow-xl shadow-brand-from/20 sm:p-12 md:flex-row md:items-center">
                    <div className="max-w-xl">
                        <h2 className="font-display text-[1.75rem] font-bold leading-tight text-balance sm:text-3xl">
                            Temukan pengalaman belajar yang lebih terarah
                        </h2>

                        <p className="mt-3 text-[15px] leading-relaxed text-white/90 text-pretty">
                            Akses ruang kelas digital, periksa jadwal terbaru,
                            dan selesaikan tugas tepat waktu melalui fitur-fitur
                            SmartTech.
                        </p>
                    </div>

                    <a
                        href={LOGIN_URL}
                        className={`${BTN} ${SIZE_MD} flex-none bg-white text-brand-from hover:bg-white/90`}
                    >
                        <LogIn size={18} aria-hidden="true" />
                        Masuk Sekarang
                    </a>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-outline-variant bg-surface-low">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(50%_60%_at_100%_100%,rgba(56,189,248,0.14),transparent_70%),radial-gradient(40%_50%_at_0%_0%,rgba(29,78,216,0.08),transparent_70%)]"
            />

            <div className={`${WRAP} relative pt-14 pb-8 lg:pt-16`}>
                <div className="grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <p className="font-display text-3xl font-extrabold tracking-tight text-on-surface">
                            SmartTech
                        </p>

                        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-on-surface-variant text-pretty">
                            Sistem informasi e-learning yang menghubungkan
                            siswa, mahasiswa, dan pengajar dalam satu ruang
                            belajar digital yang terarah.
                        </p>
                    </div>

                    <nav
                        aria-label="Navigasi kaki"
                        className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-7 lg:pl-8"
                    >
                        {FOOTER_COLUMNS.map((col) => (
                            <div key={col.title}>
                                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-on-surface">
                                    {col.title}
                                </h3>

                                <ul className="mt-4 grid gap-3">
                                    {col.links.map((l) => (
                                        <li key={l.label}>
                                            <a
                                                href={l.href}
                                                className="text-[15px] text-on-surface-variant transition-colors hover:text-primary"
                                            >
                                                {l.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-outline-variant pt-6 sm:flex-row sm:items-center">
                    <p className="text-sm text-on-surface-variant">
                        © {new Date().getFullYear()} SmartTech. Seluruh hak
                        cipta dilindungi.
                    </p>

                    <a
                        href="#top"
                        className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary"
                    >
                        Kembali ke atas
                        <ArrowUp size={16} aria-hidden="true" />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default function LandingPage() {
    const [dark, toggleTheme] = useTheme();

    return (
        <>
            <Head title="SmartTech: E-Learning untuk Sekolah dan Kampus">
                <meta
                    name="description"
                    content="SmartTech adalah sistem informasi e-learning yang menghubungkan siswa, mahasiswa, dan pengajar dalam satu portal akademik."
                />
            </Head>

            <div
                id="top"
                className="min-h-screen bg-surface font-sans text-on-surface antialiased"
            >
                <a
                    href="#konten"
                    className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-surface focus:px-4 focus:py-2 focus:font-semibold focus:text-primary"
                >
                    Lewati ke konten
                </a>

                <Navbar dark={dark} onToggleTheme={toggleTheme} />

                <main id="konten">
                    <Hero />
                    <Features />
                    <Jenjang />
                    <FinalCta />
                </main>

                <Footer />
            </div>
        </>
    );
}
