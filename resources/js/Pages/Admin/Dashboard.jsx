import { useEffect, useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowRight,
    Info,
    Presentation,
    School,
    Search,
    ShieldCheck,
    UserCog,
    UserPlus,
    Users,
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

const FILTERS = ["Semua", "Sekolah", "Kampus"];

const ROLE_LABEL = {
    admin: "Admin",
    guru: "Guru / Dosen",
    siswa: "Siswa",
    mahasiswa: "Mahasiswa",
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

function greeting(hour) {
    if (hour < 11) return "Selamat pagi";
    if (hour < 15) return "Selamat siang";
    if (hour < 18) return "Selamat sore";
    return "Selamat malam";
}

function Kpi({ label, value, hint, icon: Icon, highlight = false }) {
    const shown = useCountUp(value);

    return (
        <article
            className={`flex flex-col justify-between gap-5 rounded-3xl p-6 transition duration-300 hover:-translate-y-0.5 ${
                highlight
                    ? "bg-[radial-gradient(70%_80%_at_100%_0%,rgba(125,211,252,0.4),transparent_70%),linear-gradient(135deg,#1d4ed8,#0369a1)] text-white shadow-xl shadow-brand-from/20"
                    : "border border-outline-variant bg-surface-low shadow-sm hover:shadow-lg hover:shadow-brand-from/5"
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

function Capacity({ enrolled, capacity }) {
    const pct = Math.round((enrolled / capacity) * 100);
    const tone = pct >= 95 ? "bg-error" : "bg-linear-to-r from-brand-from to-brand-sky";

    return (
        <div className="w-32">
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
        <section id="kelas" className={`${CARD} overflow-hidden lg:col-span-8`}>
            <div className="flex flex-col gap-4 border-b border-outline-variant p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-display text-xl font-bold">
                                Daftar Kelas Aktif
                            </h2>

                            <span
                                title="Akan terhubung ke data kelas setelah modul kelas dibuat"
                                className="inline-flex items-center gap-1 rounded-full border border-outline-variant bg-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant"
                            >
                                <Info size={11} aria-hidden="true" />
                                Data contoh
                            </span>
                        </div>

                        <p className="mt-1 text-[13px] text-on-surface-variant">
                            Pantau kapasitas peserta dan status perkuliahan.
                        </p>
                    </div>

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
                                className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                    filter === f
                                        ? "bg-linear-to-r from-brand-from to-brand-to text-white shadow-sm"
                                        : "text-on-surface-variant hover:text-on-surface"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <label className="relative block">
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

            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-outline-variant text-xs uppercase tracking-wider text-on-surface-variant">
                            <th className="px-6 py-3 font-bold">Kode</th>
                            <th className="px-3 py-3 font-bold">Mata Pelajaran</th>
                            <th className="px-3 py-3 font-bold">Pengajar</th>
                            <th className="px-3 py-3 font-bold">Kapasitas</th>
                            <th className="px-6 py-3 font-bold">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-12 text-center text-on-surface-variant"
                                >
                                    Tidak ada kelas yang cocok dengan
                                    pencarian.
                                </td>
                            </tr>
                        )}

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
        </section>
    );
}

function Activity({ recent }) {
    return (
        <section id="aktivitas" className={`${CARD} p-6`}>
            <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl font-bold">
                    Akun Terbaru
                </h2>

                <Link
                    href="/admin/pengguna"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                    Lihat semua
                    <ArrowRight size={13} aria-hidden="true" />
                </Link>
            </div>

            {recent.length === 0 ? (
                <p className="mt-6 text-sm text-on-surface-variant">
                    Belum ada akun. Mulai dengan menambahkan siswa, mahasiswa,
                    atau guru.
                </p>
            ) : (
                <ul className="mt-5 flex flex-col gap-4">
                    {recent.map((r) => (
                        <li key={r.id} className="flex items-start gap-3">
                            <span className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-xl bg-secondary-container text-primary">
                                {r.role === "admin" ? (
                                    <ShieldCheck size={16} aria-hidden="true" />
                                ) : r.role === "guru" ? (
                                    <Presentation size={16} aria-hidden="true" />
                                ) : (
                                    <UserPlus size={16} aria-hidden="true" />
                                )}
                            </span>

                            <div className="min-w-0 leading-snug">
                                <p className="truncate text-sm font-semibold text-on-surface">
                                    {r.name}
                                </p>

                                <p className="text-xs text-on-surface-variant">
                                    {ROLE_LABEL[r.role] ?? r.role} · {r.at}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

function QuickActions() {
    const items = [
        {
            href: "/admin/pengguna",
            icon: UserPlus,
            title: "Tambah akun baru",
            text: "Buat akun siswa, mahasiswa, atau guru",
        },
        {
            href: "/admin/pengguna",
            icon: UserCog,
            title: "Kelola pengguna",
            text: "Cari, reset sandi, atau hapus akun",
        },
    ];

    return (
        <section className={`${CARD} p-6`}>
            <h2 className="font-display text-lg font-bold">Tindakan Cepat</h2>

            <div className="mt-4 flex flex-col gap-2.5">
                {items.map((i) => (
                    <Link
                        key={i.title}
                        href={i.href}
                        className="group flex items-center gap-3 rounded-2xl border border-outline-variant bg-surface p-3.5 transition hover:border-primary"
                    >
                        <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-linear-to-br from-brand-from to-brand-to text-white">
                            <i.icon size={18} aria-hidden="true" />
                        </span>

                        <span className="min-w-0 flex-1 leading-tight">
                            <span className="block text-sm font-semibold text-on-surface">
                                {i.title}
                            </span>

                            <span className="block truncate text-xs text-on-surface-variant">
                                {i.text}
                            </span>
                        </span>

                        <ArrowRight
                            size={16}
                            aria-hidden="true"
                            className="text-on-surface-variant transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                        />
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default function Dashboard({ stats, recent }) {
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
                <section className="motion-safe:animate-rise">
                    <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                        {greeting(now.getHours())}, selamat bekerja
                    </h2>

                    <p className="mt-1 text-[15px] text-on-surface-variant">
                        Ringkasan akun dan aktivitas akademik hari ini.
                    </p>
                </section>

                <section
                    aria-label="Ringkasan statistik"
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
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
                </section>

                <div className="grid items-start gap-6 lg:grid-cols-12">
                    <ClassesTable />

                    <div className="flex flex-col gap-6 lg:col-span-4">
                        <Activity recent={recent} />
                        <QuickActions />
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}