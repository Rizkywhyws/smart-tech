import { useMemo, useState } from "react";
import { CheckCircle2, Clock, MapPin, Megaphone, Search } from "lucide-react";
import { CARD, CardHeader, Tabs } from "./StudentUI";
import {
    ANNOUNCEMENTS,
    ATTENDANCE,
    AVERAGES,
    DAYS,
    GRADES,
    KKM,
    SCHEDULE,
    SUBJECTS,
    TAB_DAYS,
    TASKS,
    dueLabel,
    duration,
    findNext,
    initials,
    scoreTone,
    toMin,
} from "../lib/Student";

export function NextLesson({ now }) {
    const next = findNext(now);

    if (!next) {
        return (
            <section className="flex flex-col justify-center rounded-3xl bg-linear-to-br from-brand-from to-brand-to p-8 text-white lg:col-span-7">
                <p className="font-display text-2xl font-extrabold">
                    Belum ada jadwal pelajaran
                </p>
            </section>
        );
    }

    const { lesson, offset, day, nowMin, ongoing, following } = next;
    const start = toMin(lesson.start);
    const end = toMin(lesson.end);

    const label = ongoing
        ? "Sedang berlangsung"
        : offset === 0
          ? "Pelajaran berikutnya · hari ini"
          : offset === 1
            ? "Pelajaran pertama · besok"
            : `Pelajaran pertama · ${DAYS[day]}`;

    const progress = ongoing
        ? Math.min(100, Math.round(((nowMin - start) / (end - start)) * 100))
        : 0;

    return (
        <section
            aria-label="Pelajaran berikutnya"
            className="relative flex flex-col justify-between gap-8 overflow-hidden rounded-3xl bg-[radial-gradient(70%_80%_at_100%_0%,rgba(125,211,252,0.4),transparent_70%),linear-gradient(135deg,#1d4ed8,#0369a1)] p-7 text-white shadow-xl shadow-brand-from/20 sm:p-8 lg:col-span-7"
        >
            <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                    {ongoing && (
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                    )}
                    {label}
                </p>

                <p className="mt-4 font-display text-3xl font-extrabold leading-tight text-balance sm:text-4xl">
                    {lesson.subject}
                </p>

                <p className="mt-2 text-[15px] text-white/90">{lesson.teacher}</p>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90">
                    <span className="inline-flex items-center gap-1.5 tabular-nums">
                        <Clock size={15} aria-hidden="true" />
                        {lesson.start} – {lesson.end}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                        <MapPin size={15} aria-hidden="true" />
                        {lesson.room}
                    </span>
                </div>
            </div>

            <div>
                {ongoing ? (
                    <>
                        <div className="flex items-center justify-between text-xs text-white/85">
                            <span>Berakhir pukul {lesson.end}</span>
                            <span className="tabular-nums">{progress}%</span>
                        </div>

                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/25">
                            <div
                                className="h-full rounded-full bg-white transition-[width] duration-700"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </>
                ) : (
                    offset === 0 && (
                        <p className="text-sm font-semibold text-white">
                            Dimulai dalam {duration(start - nowMin)}
                        </p>
                    )
                )}

                {following && (
                    <p className="mt-3 border-t border-white/20 pt-3 text-xs text-white/85">
                        Setelah itu:{" "}
                        <span className="font-semibold text-white">{following.subject}</span>{" "}
                        · {following.start}
                    </p>
                )}
            </div>
        </section>
    );
}

export function ScheduleCard({ now, className = "" }) {
    const today = now.getDay();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    const [day, setDay] = useState(TAB_DAYS.includes(today) ? today : TAB_DAYS[0]);

    const items = SCHEDULE[day] ?? [];
    const isToday = day === today;
    const lessons = items.filter((x) => !x.rest);

    const nextIndex = isToday
        ? items.findIndex((x) => !x.rest && toMin(x.start) > nowMin)
        : -1;

    return (
        <section aria-label="Jadwal pelajaran" className={`${CARD} p-6 ${className}`}>
            <CardHeader
                title="Jadwal Pelajaran"
                description={`${DAYS[day]} · ${lessons.length} pelajaran`}
                action={
                    <Tabs
                        label="Pilih hari"
                        value={day}
                        onChange={setDay}
                        items={TAB_DAYS.map((d) => ({ key: d, text: DAYS[d].slice(0, 3) }))}
                    />
                }
            />

            <ul className="mt-5 flex flex-col gap-2.5">
                {items.map((s, i) => {
                    const start = toMin(s.start);
                    const end = toMin(s.end);
                    const live = isToday && nowMin >= start && nowMin < end;
                    const done = isToday && nowMin >= end;
                    const next = i === nextIndex;

                    if (s.rest) {
                        return (
                            <li
                                key={`${s.start}-rest`}
                                className="flex items-center gap-3 px-1 text-xs text-on-surface-variant"
                            >
                                <span className="w-24 flex-none tabular-nums">
                                    {s.start} – {s.end}
                                </span>
                                <span className="h-px flex-1 bg-outline-variant" />
                                <span className="font-semibold">{s.subject}</span>
                            </li>
                        );
                    }

                    return (
                        <li
                            key={`${s.start}-${s.subject}`}
                            className={`flex items-center gap-4 rounded-2xl border p-3.5 transition-colors ${
                                live
                                    ? "border-primary/40 bg-secondary-container"
                                    : "border-outline-variant bg-surface"
                            } ${done ? "opacity-55" : ""}`}
                        >
                            <span className="w-24 flex-none text-xs font-bold tabular-nums text-primary">
                                {s.start} – {s.end}
                            </span>

                            <div className="min-w-0 flex-1 leading-snug">
                                <p className="truncate text-sm font-semibold text-on-surface">
                                    {s.subject}
                                </p>
                                <p className="truncate text-xs text-on-surface-variant">
                                    {s.teacher} · {s.room}
                                </p>
                            </div>

                            {live && (
                                <span className="inline-flex flex-none items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                                    Berlangsung
                                </span>
                            )}

                            {done && (
                                <span className="flex-none text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">
                                    Selesai
                                </span>
                            )}

                            {next && (
                                <span className="flex-none rounded-full bg-brand-sky/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-tertiary">
                                    Berikutnya
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

export function TaskItem({ t }) {
    const urgent = !t.done && t.dueInHours < 24;

    return (
        <li className="rounded-2xl border border-outline-variant bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 leading-snug">
                    <p className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                        <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                t.type === "Kuis"
                                    ? "bg-brand-sky/20 text-tertiary"
                                    : "bg-secondary-container text-on-secondary-container"
                            }`}
                        >
                            {t.type}
                        </span>
                        {t.subject}
                    </p>

                    <p className="mt-1.5 text-sm font-semibold text-on-surface">{t.title}</p>
                </div>

                {t.done ? (
                    <CheckCircle2
                        size={20}
                        aria-label="Selesai"
                        className="flex-none text-emerald-500"
                    />
                ) : (
                    <span
                        className={`flex-none rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            urgent
                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                                : "bg-surface-high text-on-surface-variant"
                        }`}
                    >
                        {dueLabel(t.dueInHours)}
                    </span>
                )}
            </div>

            {t.done && <p className="mt-2 text-xs text-on-surface-variant">{t.note}</p>}
        </li>
    );
}

export function TasksCard({ className = "" }) {
    const [tab, setTab] = useState("todo");

    const todo = TASKS.filter((t) => !t.done);
    const finished = TASKS.filter((t) => t.done);
    const list = tab === "todo" ? todo : finished;

    return (
        <section aria-label="Tugas dan ujian" className={`${CARD} p-6 ${className}`}>
            <CardHeader
                title="Tugas dan Ujian"
                description="Kerjakan sebelum tenggat"
                action={
                    <Tabs
                        label="Status tugas"
                        value={tab}
                        onChange={setTab}
                        items={[
                            { key: "todo", text: `Belum (${todo.length})` },
                            { key: "done", text: `Selesai (${finished.length})` },
                        ]}
                    />
                }
            />

            <ul className="mt-5 flex flex-col gap-3">
                {list.length === 0 && (
                    <li className="rounded-2xl bg-surface p-5 text-center text-sm text-on-surface-variant">
                        Tidak ada tugas di sini.
                    </li>
                )}

                {list.map((t) => (
                    <TaskItem key={t.id} t={t} />
                ))}
            </ul>
        </section>
    );
}

export function GradeItem({ g }) {
    return (
        <li className="flex items-center gap-4 rounded-2xl border border-outline-variant bg-surface p-3.5">
            <span
                className={`grid h-12 w-12 flex-none place-items-center rounded-xl font-display text-lg font-extrabold tabular-nums ${scoreTone(g.score)}`}
            >
                {g.score}
            </span>

            <div className="min-w-0 flex-1 leading-snug">
                <p className="truncate text-sm font-semibold text-on-surface">{g.title}</p>
                <p className="truncate text-xs text-on-surface-variant">
                    {g.subject} · {g.ago}
                </p>
            </div>
        </li>
    );
}

export function GradesCard({ className = "" }) {
    return (
        <section aria-label="Nilai" className={`${CARD} p-6 ${className}`}>
            <CardHeader title="Nilai" description={`Batas ketuntasan ${KKM}`} />

            <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Nilai terbaru
            </h3>

            <ul className="mt-3 flex flex-col gap-2.5">
                {GRADES.map((g) => (
                    <GradeItem key={g.title} g={g} />
                ))}
            </ul>

            <h3 className="mt-7 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Rata-rata per mata pelajaran
            </h3>

            <ul className="mt-3 flex flex-col gap-3">
                {AVERAGES.map((a) => (
                    <li key={a.subject}>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-on-surface">{a.subject}</span>
                            <span className="font-bold tabular-nums text-on-surface">{a.avg}</span>
                        </div>

                        <div className="relative mt-1.5 h-2 overflow-hidden rounded-full bg-surface-high">
                            <div
                                className={`h-full rounded-full ${
                                    a.avg >= KKM
                                        ? "bg-linear-to-r from-brand-from to-brand-sky"
                                        : "bg-amber-500"
                                }`}
                                style={{ width: `${a.avg}%` }}
                            />

                            <span
                                aria-hidden="true"
                                className="absolute inset-y-0 w-px bg-on-surface/40"
                                style={{ left: `${KKM}%` }}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export function AttendanceCard({ className = "", action }) {
    const total = Object.values(ATTENDANCE).reduce((a, b) => a + b, 0);
    const pct = Math.round((ATTENDANCE.hadir / total) * 100);

    const segments = [
        { key: "hadir", label: "Hadir", bar: "bg-linear-to-r from-brand-from to-brand-sky", dot: "bg-brand-from" },
        { key: "izin", label: "Izin", bar: "bg-brand-sky/60", dot: "bg-brand-sky" },
        { key: "sakit", label: "Sakit", bar: "bg-amber-500", dot: "bg-amber-500" },
        { key: "alfa", label: "Alfa", bar: "bg-error", dot: "bg-error" },
    ];

    return (
        <section aria-label="Presensi" className={`${CARD} p-6 ${className}`}>
            <CardHeader
                title="Presensi Bulan Ini"
                description={`${total} hari sekolah`}
                action={action}
            />

            <p className="mt-4 font-display text-4xl font-extrabold tabular-nums text-on-surface">
                {pct}%
            </p>

            <div
                role="img"
                aria-label={`Kehadiran ${pct} persen`}
                className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-surface-high"
            >
                {segments.map((s) =>
                    ATTENDANCE[s.key] > 0 ? (
                        <div
                            key={s.key}
                            className={s.bar}
                            style={{ width: `${(ATTENDANCE[s.key] / total) * 100}%` }}
                        />
                    ) : null,
                )}
            </div>

            <ul className="mt-4 grid grid-cols-4 gap-2 text-center">
                {segments.map((s) => (
                    <li
                        key={s.key}
                        className="rounded-xl border border-outline-variant bg-surface px-2 py-2.5"
                    >
                        <p className="font-display text-lg font-bold tabular-nums text-on-surface">
                            {ATTENDANCE[s.key]}
                        </p>

                        <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-on-surface-variant">
                            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                            {s.label}
                        </p>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export function Announcements({ className = "" }) {
    return (
        <section aria-label="Pengumuman sekolah" className={`${CARD} p-6 ${className}`}>
            <CardHeader
                title="Pengumuman Sekolah"
                description="Informasi terbaru dari sekolah"
            />

            <ul className="mt-5 flex flex-col gap-4">
                {ANNOUNCEMENTS.map((a) => (
                    <li key={a.title} className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-xl bg-secondary-container text-primary">
                            <Megaphone size={16} aria-hidden="true" />
                        </span>

                        <div className="min-w-0 leading-snug">
                            <p className="text-sm font-semibold text-on-surface">{a.title}</p>

                            <p className="mt-0.5 text-xs text-on-surface-variant">
                                <span className="font-bold text-tertiary">{a.tag}</span> ·{" "}
                                {a.from} · {a.ago}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export function SubjectsSection({ now, className = "" }) {
    const [filter, setFilter] = useState("all");
    const [q, setQ] = useState("");

    const todayNames = useMemo(
        () =>
            new Set(
                (SCHEDULE[now.getDay()] ?? []).filter((x) => !x.rest).map((x) => x.subject),
            ),
        [now],
    );

    const rows = useMemo(() => {
        const term = q.trim().toLowerCase();

        return SUBJECTS.filter(
            (s) =>
                (filter === "all" || todayNames.has(s.name)) &&
                (!term || `${s.name} ${s.teacher}`.toLowerCase().includes(term)),
        );
    }, [filter, q, todayNames]);

    return (
        <section aria-label="Mata pelajaran" className={`${CARD} p-6 ${className}`}>
            <CardHeader
                title="Mata Pelajaran"
                description={`${SUBJECTS.length} mata pelajaran semester ini`}
                action={
                    <Tabs
                        label="Filter mata pelajaran"
                        value={filter}
                        onChange={setFilter}
                        items={[
                            { key: "all", text: "Semua" },
                            { key: "today", text: "Hari ini" },
                        ]}
                    />
                }
            />

            <label className="relative mt-5 block sm:max-w-sm">
                <span className="sr-only">Cari mata pelajaran atau guru</span>

                <Search
                    size={16}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-outline"
                />

                <input
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Cari mata pelajaran atau guru"
                    className="w-full rounded-xl border border-outline-variant bg-surface py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
            </label>

            {rows.length === 0 ? (
                <p className="py-12 text-center text-sm text-on-surface-variant">
                    Tidak ada mata pelajaran yang cocok.
                </p>
            ) : (
                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {rows.map((s) => {
                        const pct = Math.round((s.done / s.total) * 100);

                        return (
                            <li
                                key={s.name}
                                className="flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface p-4 transition-colors hover:border-primary"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-linear-to-br from-brand-from to-brand-to text-sm font-extrabold text-white">
                                        {initials(s.name)}
                                    </span>

                                    <div className="min-w-0 leading-snug">
                                        <p className="text-sm font-bold text-on-surface">{s.name}</p>
                                        <p className="truncate text-xs text-on-surface-variant">
                                            {s.teacher}
                                        </p>
                                    </div>

                                    {todayNames.has(s.name) && (
                                        <span className="ml-auto flex-none rounded-full bg-brand-sky/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-tertiary">
                                            Hari ini
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between text-xs text-on-surface-variant">
                                        <span>
                                            Bab {s.done} dari {s.total}
                                        </span>
                                        <span className="font-semibold tabular-nums">{pct}%</span>
                                    </div>

                                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-high">
                                        <div
                                            className="h-full rounded-full bg-linear-to-r from-brand-from to-brand-sky"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}