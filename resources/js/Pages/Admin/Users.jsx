import { useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Copy,
    KeyRound,
    Search,
    Trash2,
    UserPlus,
} from "lucide-react";
import AppHeader from "../../Components/AppHeader";

const ROLE_LABEL = {
    admin: "Admin",
    guru: "Guru / Dosen",
    siswa: "Siswa",
    mahasiswa: "Mahasiswa",
};

const ID_LABEL = {
    admin: "ID Admin (opsional)",
    guru: "NIP",
    siswa: "NIS",
    mahasiswa: "NIM",
};

const ROLE_TONE = {
    admin: "bg-brand-from/15 text-primary",
    guru: "bg-brand-sky/20 text-tertiary",
    siswa: "bg-secondary-container text-on-secondary-container",
    mahasiswa: "bg-surface-high text-on-surface",
};

const INPUT =
    "w-full rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-[15px] text-on-surface placeholder:text-outline transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 aria-invalid:border-error";

function Input({ id, label, error, children, ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={id}
                className="text-[13px] font-semibold text-on-surface"
            >
                {label}
            </label>

            {children ?? (
                <input
                    id={id}
                    aria-invalid={error ? "true" : undefined}
                    className={INPUT}
                    {...props}
                />
            )}

            {error && (
                <p className="text-xs font-medium text-error">{error}</p>
            )}
        </div>
    );
}

function GeneratedCard({ data }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(
                `${data.login} / ${data.password}`,
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {}
    };

    return (
        <div className="rounded-2xl border border-primary/40 bg-secondary-container p-5 text-on-secondary-container">
            <p className="text-sm font-bold">
                Kata sandi sementara untuk {data.name}
            </p>

            <p className="mt-1 text-xs">
                Catat sekarang. Kata sandi ini tidak akan ditampilkan lagi
                setelah halaman dimuat ulang.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
                <code className="rounded-lg bg-surface px-3 py-2 text-sm font-semibold text-on-surface">
                    {data.login} / {data.password}
                </code>

                <button
                    type="button"
                    onClick={copy}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-outline-variant bg-surface px-3 py-2 text-xs font-semibold text-on-surface transition hover:bg-surface-low"
                >
                    {copied ? (
                        <Check size={14} aria-hidden="true" />
                    ) : (
                        <Copy size={14} aria-hidden="true" />
                    )}
                    {copied ? "Tersalin" : "Salin"}
                </button>
            </div>
        </div>
    );
}

function CreateUserForm() {
    const form = useForm({
        name: "",
        role: "siswa",
        identifier: "",
        email: "",
        password: "",
    });

    const set = (key) => (e) => {
        form.setData(key, e.target.value);
        if (form.errors[key]) form.clearErrors(key);
    };

    const submit = (e) => {
        e.preventDefault();
        form.post("/admin/pengguna", {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <form
            onSubmit={submit}
            noValidate
            className="rounded-3xl border border-outline-variant bg-surface-low p-6 sm:p-7"
        >
            <h2 className="font-display text-xl font-bold text-on-surface">
                Tambah Akun
            </h2>

            <p className="mt-1 text-[13px] text-on-surface-variant">
                Kosongkan kata sandi untuk membuatnya otomatis.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input
                    id="u-name"
                    label="Nama Lengkap"
                    placeholder="Contoh: Nadia Putri"
                    value={form.data.name}
                    onChange={set("name")}
                    error={form.errors.name}
                />

                <Input id="u-role" label="Peran" error={form.errors.role}>
                    <select
                        id="u-role"
                        value={form.data.role}
                        onChange={set("role")}
                        className={`${INPUT} cursor-pointer`}
                    >
                        {Object.entries(ROLE_LABEL).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </Input>

                <Input
                    id="u-identifier"
                    label={ID_LABEL[form.data.role]}
                    placeholder="Contoh: 2026104011"
                    value={form.data.identifier}
                    onChange={set("identifier")}
                    error={form.errors.identifier}
                />

                <Input
                    id="u-email"
                    label={
                        form.data.role === "admin"
                            ? "Email"
                            : "Email (opsional)"
                    }
                    type="email"
                    placeholder="nama@sekolah.ac.id"
                    value={form.data.email}
                    onChange={set("email")}
                    error={form.errors.email}
                />

                <Input
                    id="u-password"
                    label="Kata Sandi (opsional)"
                    type="text"
                    autoComplete="off"
                    placeholder="Minimal 8 karakter"
                    value={form.data.password}
                    onChange={set("password")}
                    error={form.errors.password}
                />

                <div className="flex items-end">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-from to-brand-to px-5 py-2.5 text-[15px] font-semibold text-white shadow-lg shadow-brand-from/25 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <UserPlus size={18} aria-hidden="true" />
                        {form.processing ? "Menyimpan..." : "Buat Akun"}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default function AdminUsers({ users, filters, stats }) {
    const { auth, flash } = usePage().props;
    const [q, setQ] = useState(filters?.q ?? "");

    const search = (e) => {
        e.preventDefault();
        router.get(
            "/admin/pengguna",
            { q },
            { preserveState: true, replace: true },
        );
    };

    const go = (url) => {
        if (url) router.get(url, {}, { preserveState: true });
    };

    const resetPassword = (u) => {
        if (!window.confirm(`Reset kata sandi ${u.name}?`)) return;
        router.put(`/admin/pengguna/${u.id}/password`, {}, { preserveScroll: true });
    };

    const remove = (u) => {
        if (!window.confirm(`Hapus akun ${u.name}? Tindakan ini permanen.`))
            return;
        router.delete(`/admin/pengguna/${u.id}`, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Kelola Pengguna: SmartTech" />

            <div className="min-h-screen bg-surface font-sans text-on-surface antialiased">
                <AppHeader />

                <main className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-5 py-10 sm:px-6">
                    <div>
                        <h1 className="font-display text-3xl font-extrabold leading-tight text-on-surface">
                            Kelola Pengguna
                        </h1>

                        <p className="mt-1 text-[15px] text-on-surface-variant">
                            Buat dan kelola akun siswa, mahasiswa, guru, dan
                            admin.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {["siswa", "mahasiswa", "guru", "admin"].map((r) => (
                            <div
                                key={r}
                                className="rounded-2xl border border-outline-variant bg-surface-low p-4"
                            >
                                <p className="text-xs font-semibold text-on-surface-variant">
                                    {ROLE_LABEL[r]}
                                </p>

                                <p className="mt-1 font-display text-2xl font-bold tabular-nums text-on-surface">
                                    {stats?.[r] ?? 0}
                                </p>
                            </div>
                        ))}
                    </div>

                    {flash?.success && (
                        <div
                            role="status"
                            className="rounded-xl border border-outline-variant bg-surface-low p-3.5 text-sm font-medium text-on-surface"
                        >
                            {flash.success}
                        </div>
                    )}

                    {flash?.generated && (
                        <GeneratedCard data={flash.generated} />
                    )}

                    <CreateUserForm />

                    <section className="rounded-3xl border border-outline-variant bg-surface-low p-6 sm:p-7">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="font-display text-xl font-bold text-on-surface">
                                Daftar Pengguna
                                <span className="ml-2 text-sm font-medium text-on-surface-variant">
                                    ({users.total})
                                </span>
                            </h2>

                            <form
                                onSubmit={search}
                                className="relative w-full sm:w-72"
                            >
                                <Search
                                    size={16}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-outline"
                                />

                                <input
                                    type="search"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Cari nama, NIS/NIM, email"
                                    aria-label="Cari pengguna"
                                    className={`${INPUT} pl-10`}
                                />
                            </form>
                        </div>

                        <div className="mt-5 overflow-x-auto">
                            <table className="w-full min-w-[640px] text-left text-sm">
                                <thead>
                                    <tr className="border-b border-outline-variant text-xs uppercase tracking-wider text-on-surface-variant">
                                        <th className="py-3 pr-4 font-bold">
                                            Nama
                                        </th>
                                        <th className="py-3 pr-4 font-bold">
                                            ID
                                        </th>
                                        <th className="py-3 pr-4 font-bold">
                                            Email
                                        </th>
                                        <th className="py-3 pr-4 font-bold">
                                            Peran
                                        </th>
                                        <th className="py-3 text-right font-bold">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="py-10 text-center text-on-surface-variant"
                                            >
                                                Tidak ada pengguna ditemukan.
                                            </td>
                                        </tr>
                                    )}

                                    {users.data.map((u) => {
                                        const self = auth?.user?.id === u.id;

                                        return (
                                            <tr
                                                key={u.id}
                                                className="border-b border-outline-variant/60 last:border-b-0"
                                            >
                                                <td className="py-3 pr-4 font-semibold text-on-surface">
                                                    {u.name}
                                                    {self && (
                                                        <span className="ml-2 text-xs font-medium text-on-surface-variant">
                                                            (Anda)
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3 pr-4 tabular-nums text-on-surface-variant">
                                                    {u.identifier ?? "-"}
                                                </td>

                                                <td className="py-3 pr-4 text-on-surface-variant">
                                                    {u.email ?? "-"}
                                                </td>

                                                <td className="py-3 pr-4">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                            ROLE_TONE[u.role] ??
                                                            ""
                                                        }`}
                                                    >
                                                        {ROLE_LABEL[u.role] ??
                                                            u.role}
                                                    </span>
                                                </td>

                                                <td className="py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                resetPassword(u)
                                                            }
                                                            aria-label={`Reset kata sandi ${u.name}`}
                                                            title="Reset kata sandi"
                                                            className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-outline-variant text-on-surface-variant transition hover:bg-surface hover:text-primary"
                                                        >
                                                            <KeyRound
                                                                size={16}
                                                                aria-hidden="true"
                                                            />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={self}
                                                            onClick={() =>
                                                                remove(u)
                                                            }
                                                            aria-label={`Hapus ${u.name}`}
                                                            title={
                                                                self
                                                                    ? "Tidak dapat menghapus akun sendiri"
                                                                    : "Hapus akun"
                                                            }
                                                            className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-outline-variant text-on-surface-variant transition hover:bg-surface hover:text-error disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-on-surface-variant"
                                                        >
                                                            <Trash2
                                                                size={16}
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {users.last_page > 1 && (
                            <div className="mt-5 flex items-center justify-between gap-3">
                                <p className="text-xs text-on-surface-variant">
                                    Halaman {users.current_page} dari{" "}
                                    {users.last_page}
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        disabled={!users.prev_page_url}
                                        onClick={() => go(users.prev_page_url)}
                                        aria-label="Halaman sebelumnya"
                                        className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-outline-variant text-on-surface-variant transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronLeft size={16} aria-hidden="true" />
                                    </button>

                                    <button
                                        type="button"
                                        disabled={!users.next_page_url}
                                        onClick={() => go(users.next_page_url)}
                                        aria-label="Halaman berikutnya"
                                        className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-outline-variant text-on-surface-variant transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronRight size={16} aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </>
    );
}