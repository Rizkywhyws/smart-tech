import { useEffect, useState } from "react";

export const KELAS = "XI IPA 1";
export const KKM = 75;

export const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
export const TAB_DAYS = [1, 2, 3, 4, 5, 6];

const L = (start, end, subject, teacher, room) => ({ start, end, subject, teacher, room });
const REST = (start, end, label = "Istirahat") => ({ start, end, subject: label, rest: true });

export const SCHEDULE = {
    1: [
        L("07:00", "08:30", "Matematika", "Ibu Siti Rahmawati, S.Pd.", "R. 3.2"),
        L("08:30", "10:00", "Bahasa Indonesia", "Ibu Dewi Anggraini, S.Pd.", "R. 3.2"),
        REST("10:00", "10:30"),
        L("10:30", "12:00", "Fisika", "Bapak Arif Nugroho, M.Pd.", "Lab IPA"),
        REST("12:00", "12:30", "Ishoma"),
        L("12:30", "14:00", "Bahasa Inggris", "Bapak Bima Santoso, S.Pd.", "R. 3.2"),
    ],
    2: [
        L("07:00", "08:30", "Kimia", "Ibu Rina Kusuma, S.Pd.", "Lab IPA"),
        L("08:30", "10:00", "Biologi", "Ibu Maya Lestari, S.Pd.", "R. 3.2"),
        REST("10:00", "10:30"),
        L("10:30", "12:00", "Sejarah", "Ibu Laras Wulandari, S.Pd.", "R. 3.2"),
        REST("12:00", "12:30", "Ishoma"),
        L("12:30", "14:00", "Informatika", "Bapak Hendra Wijaya, S.Kom.", "Lab Komputer"),
    ],
    3: [
        L("07:00", "08:30", "Matematika", "Ibu Siti Rahmawati, S.Pd.", "R. 3.2"),
        L("08:30", "10:00", "PJOK", "Bapak Rudi Hartono, S.Pd.", "Lapangan"),
        REST("10:00", "10:30"),
        L("10:30", "12:00", "Fisika", "Bapak Arif Nugroho, M.Pd.", "R. 3.2"),
        REST("12:00", "12:30", "Ishoma"),
        L("12:30", "14:00", "Bahasa Indonesia", "Ibu Dewi Anggraini, S.Pd.", "R. 3.2"),
    ],
    4: [
        L("07:00", "08:30", "Biologi", "Ibu Maya Lestari, S.Pd.", "Lab IPA"),
        L("08:30", "10:00", "Kimia", "Ibu Rina Kusuma, S.Pd.", "R. 3.2"),
        REST("10:00", "10:30"),
        L("10:30", "12:00", "Bahasa Inggris", "Bapak Bima Santoso, S.Pd.", "R. 3.2"),
        REST("12:00", "12:30", "Ishoma"),
        L("12:30", "14:00", "Pendidikan Pancasila", "Ibu Anita Sari, S.Pd.", "R. 3.2"),
    ],
    5: [
        L("07:00", "08:30", "Informatika", "Bapak Hendra Wijaya, S.Kom.", "Lab Komputer"),
        L("08:30", "10:00", "Matematika", "Ibu Siti Rahmawati, S.Pd.", "R. 3.2"),
        REST("10:00", "10:30"),
        L("10:30", "11:30", "Pendidikan Agama", "Bapak Ahmad Fauzi, S.Ag.", "R. 3.2"),
    ],
    6: [L("08:00", "10:00", "Ekstrakurikuler", "Pembina ekskul", "Lapangan")],
};

export const SUBJECTS = [
    { name: "Matematika", teacher: "Ibu Siti Rahmawati, S.Pd.", done: 5, total: 8 },
    { name: "Bahasa Indonesia", teacher: "Ibu Dewi Anggraini, S.Pd.", done: 4, total: 7 },
    { name: "Bahasa Inggris", teacher: "Bapak Bima Santoso, S.Pd.", done: 4, total: 6 },
    { name: "Fisika", teacher: "Bapak Arif Nugroho, M.Pd.", done: 3, total: 8 },
    { name: "Kimia", teacher: "Ibu Rina Kusuma, S.Pd.", done: 4, total: 7 },
    { name: "Biologi", teacher: "Ibu Maya Lestari, S.Pd.", done: 5, total: 7 },
    { name: "Sejarah", teacher: "Ibu Laras Wulandari, S.Pd.", done: 3, total: 6 },
    { name: "Informatika", teacher: "Bapak Hendra Wijaya, S.Kom.", done: 4, total: 6 },
    { name: "PJOK", teacher: "Bapak Rudi Hartono, S.Pd.", done: 3, total: 5 },
    { name: "Pendidikan Pancasila", teacher: "Ibu Anita Sari, S.Pd.", done: 2, total: 5 },
    { name: "Pendidikan Agama", teacher: "Bapak Ahmad Fauzi, S.Ag.", done: 3, total: 5 },
];

export const TASKS = [
    { id: 1, title: "Latihan Soal Bab 5: Fungsi Kuadrat", subject: "Matematika", type: "Tugas", dueInHours: 20, done: false },
    { id: 2, title: "Laporan Praktikum Hukum Newton", subject: "Fisika", type: "Tugas", dueInHours: 52, done: false },
    { id: 3, title: "Kuis Titrasi Asam Basa", subject: "Kimia", type: "Kuis", dueInHours: 76, done: false },
    { id: 4, title: "Esai Teks Eksposisi", subject: "Bahasa Indonesia", type: "Tugas", done: true, note: "Dikumpulkan kemarin" },
    { id: 5, title: "Presentasi Descriptive Text", subject: "Bahasa Inggris", type: "Tugas", done: true, note: "Dikumpulkan 3 hari lalu" },
];

export const GRADES = [
    { subject: "Matematika", title: "Ulangan Harian Bab 4", score: 88, ago: "2 hari lalu" },
    { subject: "Fisika", title: "Kuis Gerak Lurus", score: 92, ago: "4 hari lalu" },
    { subject: "Bahasa Inggris", title: "Tugas Presentasi", score: 85, ago: "6 hari lalu" },
    { subject: "Kimia", title: "Praktikum Larutan", score: 72, ago: "8 hari lalu" },
    { subject: "Bahasa Indonesia", title: "Esai Teks Eksposisi", score: 90, ago: "10 hari lalu" },
];

export const AVERAGES = [
    { subject: "Bahasa Indonesia", avg: 88 },
    { subject: "Matematika", avg: 86 },
    { subject: "Bahasa Inggris", avg: 85 },
    { subject: "Fisika", avg: 84 },
    { subject: "Biologi", avg: 82 },
    { subject: "Kimia", avg: 73 },
];

export const ATTENDANCE = { hadir: 19, izin: 0, sakit: 1, alfa: 0 };

export const ANNOUNCEMENTS = [
    { title: "Penilaian Akhir Semester dimulai 8 Desember", from: "Wakil Kepala Sekolah", ago: "2 hari lalu", tag: "Ujian" },
    { title: "Pembagian rapor semester ganjil pada 19 Desember", from: "Tata Usaha", ago: "4 hari lalu", tag: "Rapor" },
    { title: "Pendaftaran ekstrakurikuler semester genap dibuka", from: "Pembina OSIS", ago: "1 minggu lalu", tag: "Info" },
];

/* ------------------------------ helpers ------------------------------ */

export const toMin = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
};

export function greeting(hour) {
    if (hour < 11) return "Selamat pagi";
    if (hour < 15) return "Selamat siang";
    if (hour < 18) return "Selamat sore";
    return "Selamat malam";
}

export function duration(min) {
    if (min < 60) return `${min} menit`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h} jam ${m} menit` : `${h} jam`;
}

export function initials(name = "") {
    const words = name.split(" ").filter(Boolean);
    return words.length > 1
        ? (words[0][0] + words[1][0]).toUpperCase()
        : name.slice(0, 2);
}

export function scoreTone(score) {
    if (score >= 90) return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300";
    if (score >= KKM) return "bg-secondary-container text-on-secondary-container";
    return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
}

export function dueLabel(hours) {
    if (hours < 24) return `${hours} jam lagi`;
    return `${Math.round(hours / 24)} hari lagi`;
}

export function todayLabel(date = new Date()) {
    return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

/** Pelajaran yang sedang berlangsung atau berikutnya, sampai 7 hari ke depan. */
export function findNext(now) {
    const today = now.getDay();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    for (let offset = 0; offset <= 7; offset++) {
        const day = (today + offset) % 7;
        const lessons = (SCHEDULE[day] ?? []).filter((x) => !x.rest);

        for (let i = 0; i < lessons.length; i++) {
            const l = lessons[i];
            if (offset === 0 && nowMin >= toMin(l.end)) continue;

            return {
                lesson: l,
                offset,
                day,
                nowMin,
                ongoing: offset === 0 && nowMin >= toMin(l.start),
                following: lessons[i + 1] ?? null,
            };
        }
    }

    return null;
}

export function useNow(ms = 30000) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), ms);
        return () => clearInterval(timer);
    }, [ms]);

    return now;
}

export function useCountUp(target, ms = 700) {
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