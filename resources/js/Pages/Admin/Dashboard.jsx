import { useEffect, useMemo, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import {
    ArrowDownRight,
    ArrowUpRight,
    Award,
    BookOpen,
    CalendarCheck,
    ClipboardCheck,
    Clock,
    Info,
    MapPin,
    Presentation,
    Radio,
    School,
    Search,
    TrendingDown,
    UserCheck,
    UserX,
    Users,
    Video,
} from "lucide-react";
import AdminLayout from "../../Components/AdminLayout";

const CLASSES = [
    {
        code: "IF-204",
        title: "Struktur Data dan Algoritma",
        meta: "Kampus · Semester 3",
        level: "Kampus",
        teacher: "Dr. Hendra Wijaya",
        enrolled: 42,
        capacity: 45,
        status: "Aktif",
    },
    {
        code: "MAT-11A",
        title: "Matematika Lanjut",
        meta: "Sekolah · Kelas XI IPA",
        level: "Sekolah",
        teacher: "Siti Rahmawati, S.Pd.",
        enrolled: 34,
        capacity: 36,
        status: "Aktif",
    },
    {
        code: "SI-301",
        title: "Basis Data Terdistribusi",
        meta: "Kampus · Semester 5",
        level: "Kampus",
        teacher: "Bima Santoso, M.Kom.",
        enrolled: 38,
        capacity: 40,
        status: "Ujian",
    },
    {
        code: "FIS-12B",
        title: "Fisika Modern",
        meta: "Sekolah · Kelas XII IPA",
        level: "Sekolah",
        teacher: "Arif Nugroho, M.Pd.",
        enrolled: 31,
        capacity: 36,
        status: "Aktif",
    },
];

const ACADEMIC = [
    {
        icon: BookOpen,
        label: "Kelas Berjalan",
        value: 68,
        delta: 4,
        hint: "dibanding semester lalu",
    },
    {
        icon: CalendarCheck,
        label: "Rata-rata Presensi",
        value: 94.2,
        decimals: 1,
        suffix: "%",
        delta: 0.8,
        hint: "dibanding bulan lalu",
    },
    {
        icon: ClipboardCheck,
        label: "Tugas Terkumpul",
        value: 87,
        suffix: "%",
        delta: -2.1,
        hint: "dibanding minggu lalu",
    },
    {
        icon: Award,
        label: "Rata-rata Nilai",
        value: 82.4,
        decimals: 1,
        delta: 1.2,
        hint: "dibanding semester lalu",
    },
];

const ACTIVITY = {
    tugas: {
        label: "Tugas",
        unit: "tugas dikumpulkan",
        data: [34, 52, 48, 61, 57, 22, 15, 44, 67, 72, 58, 63, 28, 71],
    },
    materi: {
        label: "Materi",
        unit: "materi dibuka",
        data: [120, 148, 135, 162, 151, 64, 47, 139, 171, 184, 166, 158, 72, 177],
    },
    kuis: {
        label: "Kuis",
        unit: "kuis dikerjakan",
        data: [18, 26, 31, 22, 29, 8, 5, 24, 33, 38, 27, 35, 11, 36],
    },
};

// Jadwal seluruh sekolah hari ini, dipakai untuk memantau kelas yang sedang berlangsung.
const SCHEDULE_TODAY = [
    {
        start: "07:30",
        end: "09:10",
        code: "MAT-11A",
        title: "Matematika Lanjut",
        teacher: "Siti Rahmawati, S.Pd.",
        room: "Ruang 3.2",
        mode: "Tatap muka",
        enrolled: 34,
        present: 33,
    },
    {
        start: "09:30",
        end: "11:10",
        code: "IF-204",
        title: "Struktur Data dan Algoritma",
        teacher: "Dr. Hendra Wijaya",
        room: "Lab Komputer 2",
        mode: "Tatap muka",
        enrolled: 42,
        present: 39,
    },
    {
        start: "13:00",
        end: "14:40",
        code: "SI-301",
        title: "Basis Data Terdistribusi",
        teacher: "Bima Santoso, M.Kom.",
        room: "Kelas daring",
        mode: "Daring",
        enrolled: 38,
        present: 36,
    },
    {
        start: "15:00",
        end: "16:30",
        code: "FIS-12B",
        title: "Fisika Modern",
        teacher: "Arif Nugroho, M.Pd.",
        room: "Ruang 2.1",
        mode: "Tatap muka",
        enrolled: 31,
        present: 22,
    },
];

const ASSIGNMENTS = [
    {
        title: "Laporan Praktikum 4",
        course: "Basis Data Terdistribusi",
        teacher: "Bima Santoso, M.Kom.",
        dueInHours: 20,
        submitted: 31,
        total: 38,
    },
    {
        title: "Kuis 5: Integral",
        course: "Matematika Lanjut",
        teacher: "Siti Rahmawati, S.Pd.",
        dueInHours: 46,
        submitted: 20,
        total: 34,
    },
    {
        title: "Proyek Akhir Modul 2",
        course: "Struktur Data dan Algoritma",
        teacher: "Dr. Hendra Wijaya",
        dueInHours: 96,
        submitted: 12,
        total: 42,
    },
    {
        title: "Esai Fisika Kuantum",
        course: "Fisika Modern",
        teacher: "Arif Nugroho, M.Pd.",
        dueInHours: 150,
        submitted: 9,
        total: 31,
    },
];

const ATTENTION = [
    {
        icon: UserX,
        title: "Kimia Dasar (KIM-10C)",
        note: "Belum ada pengajar yang ditugaskan",
        tone: "error",
    },
    {
        icon: UserCheck,
        title: "5 akun pengajar menunggu verifikasi",
        note: "Mereka belum bisa membuat kelas sebelum disetujui",
        tone: "error",
    },
    {
        icon: Users,
        title: "Struktur Data (IF-204)",
        note: "Kapasitas hampir penuh, 42 dari 45 peserta",
        tone: "warn",
    },
    {
        icon: TrendingDown,
        title: "Fisika Modern (FIS-12B)",
        note: "Kehadiran 71%, di bawah batas 80%",
        tone: "warn",
    },
];

const FILTERS = ["Semua", "Sekolah", "Kampus"];

const DEFAULT_STATS = {
    total: 0,
    siswa: 0,
    mahasiswa: 0,
    guru: 0,
    admin: 0,
    thisWeek: 0,
};

const CARD =
    "rounded-3xl border border-outline-variant bg-surface-low shadow-sm";


function useCountUp(target, ms = 700) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setValue(target);
            return;
        }

        let raf;
        const start = performance.now();

        const tick = (now) => {
            const p = Math.min(1, (now - start) / ms);
            setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(raf);
    }, [target, ms]);

    return value;
}

function useNow(ms = 60000) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), ms);
        return () => clearInterval(timer);
    }, [ms]);

    return now;
}

function greeting(hour) {
    if (hour < 11) return "Selamat pagi";
    if (hour < 15) return "Selamat siang";
    if (hour < 18) return "Selamat sore";
    return "Selamat malam";
}

function toMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
}

function dueLabel(hours) {
    if (hours < 24) return `${hours} jam lagi`;
    return `${Math.round(hours / 24)} hari lagi`;
}

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

function SectionHeading({ id, title, description, badge }) {
    return (
        <div>
            <div className="flex flex-wrap items-center gap-2.5">
                <h2
                    id={id}
                    className="font-display text-xl font-bold text-on-surface"
                >
                    {title}
                </h2>

                {badge && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-outline-variant bg-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">
                        {badge}
                    </span>
                )}
            </div>

            {description && (
                <p className="mt-1 text-[13px] text-on-surface-variant">
                    {description}
                </p>
            )}
        </div>
    );
}

function CardHeader({ title, description, action }) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h3 className="font-display text-lg font-bold text-on-surface">
                    {title}
                </h3>

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

function SampleNotice() {
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-outline-variant bg-surface-low px-4 py-3 text-[13px] leading-relaxed text-on-surface-variant">
            <Info
                size={17}
                aria-hidden="true"
                className="mt-0.5 flex-none text-primary"
            />

            <p>
                <span className="font-semibold text-on-surface">
                    Data contoh.
                </span>{" "}
                Angka pada bagian ini belum berasal dari database dan akan
                diganti setelah modul kelas, tugas, dan presensi selesai.
            </p>
        </div>
    );
}

function Kpi({ label, value, hint, icon: Icon, highlight = false }) {
    const shown = useCountUp(value);

    return (
        <article
            className={`flex flex-col justify-between gap-5 rounded-3xl p-6 ${
                highlight
                    ? "bg-[radial-gradient(70%_80%_at_100%_0%,rgba(125,211,252,0.4),transparent_70%),linear-gradient(135deg,#1d4ed8,#0369a1)] text-white shadow-xl shadow-brand-from/20"
                    : "border border-outline-variant bg-surface-low shadow-sm"
            }`}
        >
            <div className="flex items-center justify-between gap-3">
                <span
                    className={`text-sm font-semibold ${
                        highlight ? "text-white/90" : "text-on-surface-variant"
                    }`}
                >
                    {label}
                </span>

                <span
                    className={`grid h-10 w-10 place-items-center rounded-xl ${
                        highlight
                            ? "bg-white/20 text-white"
                            : "bg-secondary-container text-primary"
                    }`}
                >
                    <Icon size={20} aria-hidden="true" />
                </span>
            </div>

            <div>
                <p className="font-display text-4xl font-extrabold tabular-nums">
                    {shown.toLocaleString("id-ID")}
                </p>

                <p
                    className={`mt-1 text-xs ${
                        highlight ? "text-white/85" : "text-on-surface-variant"
                    }`}
                >
                    {hint}
                </p>
            </div>
        </article>
    );
}

function DeltaPill({ delta, suffix = "" }) {
    const up = delta >= 0;
    const Icon = up ? ArrowUpRight : ArrowDownRight;

    return (
        <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-bold ${
                up
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
            }`}
        >
            <Icon size={12} aria-hidden="true" />
            {Math.abs(delta).toLocaleString("id-ID")}
            {suffix}
        </span>
    );
}

function MiniStat({
    icon: Icon,
    label,
    value,
    decimals = 0,
    suffix = "",
    delta,
    hint,
}) {
    const factor = 10 ** decimals;
    const shown = useCountUp(Math.round(value * factor)) / factor;

    return (
        <article className={`${CARD} p-5`}>
            <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-secondary-container text-primary">
                    <Icon size={18} aria-hidden="true" />
                </span>

                <p className="text-sm font-semibold text-on-surface-variant">
                    {label}
                </p>
            </div>

            <p className="mt-4 font-display text-3xl font-extrabold tabular-nums text-on-surface">
                {shown.toLocaleString("id-ID", {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                })}
                {suffix}
            </p>

            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-on-surface-variant">
                <DeltaPill delta={delta} suffix={suffix === "%" ? " poin" : ""} />
                {hint}
            </p>
        </article>
    );
}

/* ------------------------------------------------------------------ */
/*  Widget khusus admin                                                */
/* ------------------------------------------------------------------ */

// Anomali yang butuh tindakan pengelola. Ditaruh paling atas karena paling actionable.
function Attention() {
    return (
        <section
            aria-label="Perlu tindakan"
            className={`${CARD} flex h-full flex-col p-6`}
        >
            <CardHeader
                title="Perlu Tindakan"
                description={`${ATTENTION.length} hal yang sebaiknya ditinjau`}
            />

            <ul className="mt-5 flex flex-1 flex-col gap-3">
                {ATTENTION.map((a) => (
                    <li
                        key={a.title}
                        className="flex flex-1 items-start gap-3 rounded-2xl border border-outline-variant bg-surface p-4"
                    >
                        <span
                            className={`grid h-9 w-9 flex-none place-items-center rounded-xl ${
                                a.tone === "error"
                                    ? "bg-error/15 text-error"
                                    : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                            }`}
                        >
                            <a.icon size={16} aria-hidden="true" />
                        </span>

                        <div className="min-w-0 leading-snug">
                            <p className="text-sm font-semibold text-on-surface">
                                {a.title}
                            </p>

                            <p className="mt-0.5 text-xs text-on-surface-variant">
                                {a.note}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function LowSubmissions() {
    const rows = useMemo(
        () =>
            ASSIGNMENTS.map((a) => ({
                ...a,
                pct: Math.round((a.submitted / a.total) * 100),
            }))
                .filter((a) => a.dueInHours <= 168)
                .sort((a, b) => a.pct - b.pct)
                .slice(0, 3),
        [],
    );

    return (
        <section
            aria-label="Tugas dengan pengumpulan rendah"
            className={`${CARD} flex h-full flex-col p-6`}
        >
            <CardHeader
                title="Pengumpulan Tugas Rendah"
                description="Tenggat dalam 7 hari, diurutkan dari yang paling sedikit terkumpul"
            />

            <ul className="mt-5 flex flex-1 flex-col justify-between gap-5">
                {rows.map((d) => {
                    const low = d.pct < 50;

                    return (
                        <li key={d.title}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 leading-snug">
                                    <p className="truncate text-sm font-semibold text-on-surface">
                                        {d.title}
                                    </p>

                                    <p className="truncate text-xs text-on-surface-variant">
                                        {d.course} · {d.teacher}
                                    </p>
                                </div>

                                <span
                                    className={`flex-none rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                        low
                                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                                            : "bg-surface-high text-on-surface-variant"
                                    }`}
                                >
                                    {dueLabel(d.dueInHours)}
                                </span>
                            </div>

                            <div className="mt-2 flex items-center gap-2.5">
                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-high">
                                    <div
                                        className={`h-full rounded-full ${
                                            low
                                                ? "bg-amber-500"
                                                : "bg-linear-to-r from-brand-from to-brand-sky"
                                        }`}
                                        style={{ width: `${d.pct}%` }}
                                    />
                                </div>

                                <span className="text-xs tabular-nums text-on-surface-variant">
                                    {d.submitted}/{d.total} · {d.pct}%
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

function LearningActivity() {
    const [tab, setTab] = useState("tugas");
    const series = ACTIVITY[tab];
    const n = series.data.length;
    const half = Math.floor(n / 2);

    const days = useMemo(
        () =>
            Array.from({ length: n }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (n - 1 - i));
                return d;
            }),
        [n],
    );

    const recent = series.data.slice(-half);
    const previous = series.data.slice(-half * 2, -half);

    const max = Math.max(...series.data);
    const recentTotal = sum(recent);
    const previousTotal = sum(previous);
    const avg = Math.round(recentTotal / recent.length);
    const change =
        previousTotal > 0
            ? Math.round(((recentTotal - previousTotal) / previousTotal) * 1000) /
              10
            : 0;

    const label = (d) =>
        d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });

    return (
        <section
            aria-label="Aktivitas belajar"
            className={`${CARD} flex h-full flex-col p-6`}
        >
            <CardHeader
                title="Aktivitas Belajar"
                description={`${half} hari terakhir dibanding ${half} hari sebelumnya, seluruh kelas`}
                action={
                    <div
                        role="tablist"
                        aria-label="Jenis aktivitas"
                        className="inline-flex gap-1 rounded-xl border border-outline-variant bg-surface p-1"
                    >
                        {Object.entries(ACTIVITY).map(([key, s]) => (
                            <button
                                key={key}
                                type="button"
                                role="tab"
                                aria-selected={tab === key}
                                onClick={() => setTab(key)}
                                className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                                    tab === key
                                        ? "bg-linear-to-r from-brand-from to-brand-to text-white shadow-sm"
                                        : "text-on-surface-variant hover:text-on-surface"
                                }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                }
            />

            <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-3">
                <div>
                    <p className="font-display text-3xl font-extrabold tabular-nums text-on-surface">
                        {recentTotal.toLocaleString("id-ID")}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-on-surface-variant">
                        <DeltaPill delta={change} suffix="%" />
                        {series.unit}
                    </p>
                </div>

                <div>
                    <p className="font-display text-xl font-bold tabular-nums text-on-surface">
                        {avg.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                        rata-rata per hari
                    </p>
                </div>
            </div>

            <div
                role="img"
                aria-label={`Grafik ${series.unit} selama ${n} hari terakhir. ${half} hari terakhir ${
                    change >= 0 ? "naik" : "turun"
                } ${Math.abs(change)} persen dibanding ${half} hari sebelumnya.`}
                className="mt-6 flex min-h-44 flex-1 items-end gap-1.5"
            >
                {series.data.map((v, i) => {
                    const today = i === n - 1;
                    const isRecent = i >= n - half;

                    return (
                        <div
                            key={i}
                            title={`${label(days[i])}: ${v} ${series.unit}`}
                            className="flex h-full flex-1 items-end"
                        >
                            <div
                                style={{
                                    height: `${Math.max(6, (v / max) * 100)}%`,
                                }}
                                className={`w-full rounded-t-md transition-[height] duration-500 ${
                                    today
                                        ? "bg-linear-to-t from-brand-from to-brand-sky"
                                        : isRecent
                                          ? "bg-brand-from/55"
                                          : "bg-brand-from/20"
                                }`}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-on-surface-variant">
                <span>{label(days[0])}</span>

                <span className="inline-flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded-sm bg-brand-from/20" />
                        Sebelumnya
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded-sm bg-brand-from/55" />
                        Terbaru
                    </span>
                </span>

                <span className="inline-flex items-center gap-1">
                    <Clock size={11} aria-hidden="true" />
                    Hari ini
                </span>
            </div>
        </section>
    );
}

function LiveClasses() {
    const now = useNow();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    const live = SCHEDULE_TODAY.filter(
        (s) => toMinutes(s.start) <= nowMin && nowMin < toMinutes(s.end),
    );

    const next = SCHEDULE_TODAY.find((s) => toMinutes(s.start) > nowMin);
    const allDone = SCHEDULE_TODAY.every((s) => nowMin >= toMinutes(s.end));

    return (
        <section
            aria-label="Kelas yang sedang berlangsung"
            className={`${CARD} flex h-full flex-col p-6`}
        >
            <CardHeader
                title="Sedang Berlangsung"
                description={`${live.length} dari ${SCHEDULE_TODAY.length} kelas hari ini`}
            />

            <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {live.map((s) => {
                    const pct = Math.round((s.present / s.enrolled) * 100);
                    const low = pct < 80;

                    return (
                        <li
                            key={s.code}
                            className="rounded-2xl border border-primary/40 bg-secondary-container p-3.5"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-bold tabular-nums text-primary">
                                    {s.start} – {s.end}
                                </p>

                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                                    <Radio size={10} aria-hidden="true" />
                                    Live
                                </span>
                            </div>

                            <p className="mt-1.5 text-sm font-semibold leading-snug text-on-surface">
                                {s.title}
                            </p>

                            <p className="mt-0.5 text-xs text-on-surface-variant">
                                {s.teacher}
                            </p>

                            <p className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
                                {s.mode === "Daring" ? (
                                    <Video size={12} aria-hidden="true" />
                                ) : (
                                    <MapPin size={12} aria-hidden="true" />
                                )}
                                {s.room}
                            </p>

                            <div className="mt-3 flex items-center gap-2.5">
                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-high">
                                    <div
                                        className={`h-full rounded-full ${
                                            low
                                                ? "bg-amber-500"
                                                : "bg-linear-to-r from-brand-from to-brand-sky"
                                        }`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>

                                <span className="text-xs tabular-nums text-on-surface-variant">
                                    Hadir {s.present}/{s.enrolled}
                                </span>
                            </div>
                        </li>
                    );
                })}

                {live.length === 0 && (
                    <li className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-outline-variant p-6 text-center text-sm text-on-surface-variant">
                        {allDone
                            ? "Semua kelas hari ini sudah selesai."
                            : "Belum ada kelas yang berlangsung."}
                    </li>
                )}

                {next && (
                    <li className="rounded-2xl border border-outline-variant bg-surface p-3.5">
                        <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-bold tabular-nums text-primary">
                                {next.start} – {next.end}
                            </p>

                            <span className="rounded-full bg-brand-sky/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-tertiary">
                                Berikutnya
                            </span>
                        </div>

                        <p className="mt-1.5 text-sm font-semibold leading-snug text-on-surface">
                            {next.title}
                        </p>

                        <p className="mt-0.5 text-xs text-on-surface-variant">
                            {next.teacher} · {next.room}
                        </p>
                    </li>
                )}
            </ul>
        </section>
    );
}

function StatusBadge({ status }) {
    const tone =
        status === "Ujian"
            ? "bg-brand-sky/20 text-tertiary"
            : "bg-secondary-container text-on-secondary-container";

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}
        >
            {status}
        </span>
    );
}

function Capacity({ enrolled, capacity, className = "w-36" }) {
    const pct = Math.round((enrolled / capacity) * 100);
    const tone =
        pct >= 95 ? "bg-error" : "bg-linear-to-r from-brand-from to-brand-sky";

    return (
        <div className={className}>
            <div className="flex items-center justify-between text-xs tabular-nums text-on-surface-variant">
                <span>
                    {enrolled} / {capacity}
                </span>
                <span>{pct}%</span>
            </div>

            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-high">
                <div
                    className={`h-full rounded-full ${tone}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

function ClassesTable() {
    const [filter, setFilter] = useState("Semua");
    const [q, setQ] = useState("");

    const rows = useMemo(() => {
        const term = q.trim().toLowerCase();

        return CLASSES.filter(
            (c) =>
                (filter === "Semua" || c.level === filter) &&
                (!term ||
                    `${c.code} ${c.title} ${c.teacher}`
                        .toLowerCase()
                        .includes(term)),
        );
    }, [filter, q]);

    return (
        <section
            id="kelas"
            aria-label="Daftar kelas aktif"
            className={`${CARD} overflow-hidden`}
        >
            <div className="flex flex-col gap-4 border-b border-outline-variant p-6">
                <CardHeader
                    title="Daftar Kelas Aktif"
                    description="Pantau kapasitas peserta dan status perkuliahan"
                    action={
                        <div
                            role="tablist"
                            aria-label="Filter jenjang kelas"
                            className="inline-flex gap-1 rounded-xl border border-outline-variant bg-surface p-1"
                        >
                            {FILTERS.map((f) => (
                                <button
                                    key={f}
                                    type="button"
                                    role="tab"
                                    aria-selected={filter === f}
                                    onClick={() => setFilter(f)}
                                    className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                                        filter === f
                                            ? "bg-linear-to-r from-brand-from to-brand-to text-white shadow-sm"
                                            : "text-on-surface-variant hover:text-on-surface"
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    }
                />

                <label className="relative block sm:max-w-sm">
                    <span className="sr-only">Cari kelas atau pengajar</span>

                    <Search
                        size={16}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-outline"
                    />

                    <input
                        type="search"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Cari kode, mata kuliah, atau pengajar"
                        className="w-full rounded-xl border border-outline-variant bg-surface py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                    />
                </label>
            </div>

            {rows.length === 0 && (
                <p className="px-6 py-12 text-center text-sm text-on-surface-variant">
                    Tidak ada kelas yang cocok dengan pencarian.
                </p>
            )}

            {rows.length > 0 && (
                <>
                    {}
                    <ul className="divide-y divide-outline-variant/60 md:hidden">
                        {rows.map((c) => (
                            <li key={c.code} className="flex flex-col gap-3 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 leading-snug">
                                        <p className="text-xs font-bold tabular-nums text-primary">
                                            {c.code}
                                        </p>

                                        <p className="mt-0.5 text-sm font-semibold text-on-surface">
                                            {c.title}
                                        </p>

                                        <p className="text-xs text-on-surface-variant">
                                            {c.meta}
                                        </p>
                                    </div>

                                    <StatusBadge status={c.status} />
                                </div>

                                <p className="text-xs text-on-surface-variant">
                                    Pengajar:{" "}
                                    <span className="font-semibold text-on-surface">
                                        {c.teacher}
                                    </span>
                                </p>

                                <Capacity
                                    enrolled={c.enrolled}
                                    capacity={c.capacity}
                                    className="w-full"
                                />
                            </li>
                        ))}
                    </ul>

                    {/* Layar sedang ke atas: tabel */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-outline-variant text-xs uppercase tracking-wider text-on-surface-variant">
                                    <th className="px-6 py-3 font-bold">Kode</th>
                                    <th className="px-3 py-3 font-bold">
                                        Mata Pelajaran
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Pengajar
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Kapasitas
                                    </th>
                                    <th className="px-6 py-3 font-bold">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {rows.map((c) => (
                                    <tr
                                        key={c.code}
                                        className="border-b border-outline-variant/60 transition-colors last:border-b-0 hover:bg-surface"
                                    >
                                        <td className="px-6 py-4 font-semibold tabular-nums text-primary">
                                            {c.code}
                                        </td>

                                        <td className="px-3 py-4">
                                            <p className="font-semibold text-on-surface">
                                                {c.title}
                                            </p>

                                            <p className="text-xs text-on-surface-variant">
                                                {c.meta}
                                            </p>
                                        </td>

                                        <td className="px-3 py-4 text-on-surface">
                                            {c.teacher}
                                        </td>

                                        <td className="px-3 py-4">
                                            <Capacity
                                                enrolled={c.enrolled}
                                                capacity={c.capacity}
                                            />
                                        </td>

                                        <td className="px-6 py-4">
                                            <StatusBadge status={c.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </section>
    );
}

export default function Dashboard({ stats: statsProp }) {
    const { props } = usePage();
    const stats = { ...DEFAULT_STATS, ...statsProp };
    const firstName = props.auth?.user?.name?.split(" ")[0];

    const now = new Date();
    const date = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <>
            <Head title="Dasbor Admin: SmartTech" />

            <AdminLayout title="Dasbor Admin" subtitle={date}>
                <div className="flex flex-col gap-10">
                    <header className="motion-safe:animate-rise">
                        <p className="font-display text-2xl font-extrabold leading-tight text-on-surface sm:text-3xl">
                            {greeting(now.getHours())}
                            {firstName ? `, ${firstName}` : ""}
                        </p>

                        <p className="mt-1 text-[15px] text-on-surface-variant">
                            Ringkasan pengguna dan kegiatan belajar hari ini.
                        </p>
                    </header>

                    <section
                        aria-labelledby="sec-pengguna"
                        className="flex flex-col gap-4"
                    >
                        <SectionHeading
                            id="sec-pengguna"
                            title="Pengguna"
                            description="Jumlah akun yang terdaftar di portal"
                        />

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <Kpi
                                highlight
                                label="Total Pengguna"
                                value={stats.total}
                                hint={`+${stats.thisWeek} akun baru dalam 7 hari terakhir`}
                                icon={Users}
                            />

                            <Kpi
                                label="Siswa"
                                value={stats.siswa}
                                hint="SMP / SMA / SMK"
                                icon={School}
                            />

                            <Kpi
                                label="Mahasiswa"
                                value={stats.mahasiswa}
                                hint="Perguruan tinggi"
                                icon={Users}
                            />

                            <Kpi
                                label="Guru / Dosen"
                                value={stats.guru}
                                hint={`${stats.admin} admin terdaftar`}
                                icon={Presentation}
                            />
                        </div>
                    </section>

                    <section
                        aria-labelledby="sec-akademik"
                        className="flex flex-col gap-6"
                    >

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {ACADEMIC.map((m) => (
                                <MiniStat key={m.label} {...m} />
                            ))}
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <Attention />
                            <LowSubmissions />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-12">
                            <div className="lg:col-span-8">
                                <LearningActivity />
                            </div>

                            <div className="lg:col-span-4">
                                <LiveClasses />
                            </div>
                        </div>

                        <ClassesTable />
                    </section>
                </div>
            </AdminLayout>
        </>
    );
}