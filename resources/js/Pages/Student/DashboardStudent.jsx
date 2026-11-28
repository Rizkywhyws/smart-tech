import { Head } from "@inertiajs/react";
import {
    Award,
    BookOpen,
    CalendarCheck,
    ClipboardCheck,
    Hash,
    Info,
    School,
} from "lucide-react";
import StudentLayout from "../../Components/StudentLayout";
import {
    CARD,
    CardHeader,
    Chip,
    SeeAll,
    Stat,
} from "../../Components/StudentUI";
import {
    Announcements,
    AttendanceCard,
    GradeItem,
    NextLesson,
    TaskItem,
} from "../../Components/StudentCards";
import {
    ATTENDANCE,
    AVERAGES,
    DAYS,
    GRADES,
    KELAS,
    SCHEDULE,
    TASKS,
    greeting,
    toMin,
    useNow,
} from "../../lib/Student";

function TodaySchedule({ now }) {
    const today = now.getDay();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const lessons = (SCHEDULE[today] ?? []).filter((x) => !x.rest);

    return (
        <section
            aria-label="Jadwal hari ini"
            className={`${CARD} h-full p-6 lg:col-span-7`}
        >
            <CardHeader
                title="Jadwal Hari Ini"
                description={`${DAYS[today]} · ${lessons.length} pelajaran`}
                action={<SeeAll href="/siswa/jadwal" />}
            />

            {lessons.length === 0 ? (
                <p className="mt-5 rounded-2xl bg-surface p-5 text-center text-sm text-on-surface-variant">
                    Tidak ada pelajaran hari ini.
                </p>
            ) : (
                <ul className="mt-5 flex flex-col gap-2.5">
                    {lessons.map((s) => {
                        const live =
                            nowMin >= toMin(s.start) && nowMin < toMin(s.end);
                        const done = nowMin >= toMin(s.end);

                        return (
                            <li
                                key={`${s.start}-${s.subject}`}
                                className={`flex items-center gap-4 rounded-2xl border p-3 ${
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
                                        {s.room}
                                    </p>
                                </div>

                                {live && (
                                    <span className="flex-none rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                                        Berlangsung
                                    </span>
                                )}

                                {done && (
                                    <span className="flex-none text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">
                                        Selesai
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}

function UpcomingTasks() {
    const upcoming = TASKS.filter((t) => !t.done)
        .sort((a, b) => a.dueInHours - b.dueInHours)
        .slice(0, 3);

    return (
        <section
            aria-label="Tenggat terdekat"
            className={`${CARD} h-full p-6 lg:col-span-5`}
        >
            <CardHeader
                title="Tenggat Terdekat"
                description="Tugas dan kuis yang belum selesai"
                action={<SeeAll href="/siswa/tugas" />}
            />

            <ul className="mt-5 flex flex-col gap-3">
                {upcoming.length === 0 ? (
                    <li className="rounded-2xl bg-surface p-5 text-center text-sm text-on-surface-variant">
                        Semua tugas sudah selesai.
                    </li>
                ) : (
                    upcoming.map((t) => <TaskItem key={t.id} t={t} />)
                )}
            </ul>
        </section>
    );
}

function RecentGrades() {
    return (
        <section
            aria-label="Nilai terbaru"
            className={`${CARD} h-full p-6 lg:col-span-7`}
        >
            <CardHeader
                title="Nilai Terbaru"
                description="Tiga penilaian terakhir"
                action={<SeeAll href="/siswa/nilai" />}
            />

            <ul className="mt-5 flex flex-col gap-2.5">
                {GRADES.slice(0, 3).map((g) => (
                    <GradeItem key={g.title} g={g} />
                ))}
            </ul>
        </section>
    );
}

export default function Dashboard({ user = {} }) {
    const now = useNow();
    const firstName = user.name?.split(" ")[0];
    const todayCount = (SCHEDULE[now.getDay()] ?? []).filter(
        (x) => !x.rest,
    ).length;
    const activeTasks = TASKS.filter((t) => !t.done).length;
    const total = Object.values(ATTENDANCE).reduce((a, b) => a + b, 0);
    const attendancePct = Math.round((ATTENDANCE.hadir / total) * 100);
    const overall =
        Math.round(
            (AVERAGES.reduce((sum, a) => sum + a.avg, 0) / AVERAGES.length) *
                10,
        ) / 10;

    return (
        <>
            <Head title="Beranda: SmartTech" />

            <StudentLayout title="Beranda">
                <div className="flex flex-col gap-8">
                    <header className="flex flex-col gap-4 motion-safe:animate-rise">
                        <div>
                            <p className="font-display text-2xl font-extrabold leading-tight text-on-surface sm:text-3xl">
                                {greeting(now.getHours())}
                                {firstName ? `, ${firstName}` : ""}
                            </p>

                            <p className="mt-1 text-[15px] text-on-surface-variant">
                                Ini ringkasan kegiatan belajarmu hari ini.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Chip icon={School}>Kelas {KELAS}</Chip>

                            {user.identifier && (
                                <Chip icon={Hash}>NIS {user.identifier}</Chip>
                            )}
                        </div>

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
                                Kelas, jadwal, tugas, nilai, presensi, dan
                                pengumuman masih berupa tampilan awal. Nama dan
                                NIS berasal dari akunmu.
                            </p>
                        </div>
                    </header>

                    <div className="grid gap-6 lg:grid-cols-12">
                        <NextLesson now={now} />

                        <div className="grid grid-cols-2 gap-4 lg:col-span-5">
                            <Stat
                                icon={BookOpen}
                                label="Pelajaran"
                                value={todayCount}
                                hint="hari ini"
                            />
                            <Stat
                                icon={ClipboardCheck}
                                label="Tugas Aktif"
                                value={activeTasks}
                                hint="belum dikumpulkan"
                            />
                            <Stat
                                icon={CalendarCheck}
                                label="Kehadiran"
                                value={attendancePct}
                                suffix="%"
                                hint="bulan ini"
                            />
                            <Stat
                                icon={Award}
                                label="Rata-rata Nilai"
                                value={overall}
                                decimals={1}
                                hint="semester ini"
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-12">
                        <TodaySchedule now={now} />
                        <UpcomingTasks />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-12">
                        <RecentGrades />
                        <AttendanceCard
                            className="h-full lg:col-span-5"
                            action={<SeeAll href="/siswa/nilai" />}
                        />
                    </div>

                    <Announcements />
                </div>
            </StudentLayout>
        </>
    );
}

