import { useCallback, useEffect, useRef, useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Check,
    ChevronLeft,
    ChevronRight,
    Copy,
    Eye,
    EyeOff,
    Info,
    KeyRound,
    RotateCcw,
    Search,
    Trash2,
    UserPlus,
    X,
} from "lucide-react";
import AdminLayout from "../../Components/AdminLayout";
import SuccessModal from "../../Components/SuccessModal";
import ConfirmModal from "../../Components/ConfirmModal";

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

            {error && <p className="text-xs font-medium text-error">{error}</p>}
        </div>
    );
}

function GeneratedCard({ data }) {
    const [copied, setCopied] = useState(false);
    const [show, setShow] = useState(false);

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
                setelah halaman dimuat ulang, dan pengguna wajib menggantinya
                saat login pertama.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
                <code className="rounded-lg bg-surface px-3 py-2 text-sm font-semibold text-on-surface">
                    {data.login} /{" "}
                    {show ? data.password : "•".repeat(data.password.length)}
                </code>

                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={
                        show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                    }
                    className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-outline-variant bg-surface text-on-surface transition hover:bg-surface-low"
                >
                    {show ? (
                        <EyeOff size={15} aria-hidden="true" />
                    ) : (
                        <Eye size={15} aria-hidden="true" />
                    )}
                </button>

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

function CreateUserForm({ onCreated }) {
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
            onSuccess: (page) => {
                form.reset();
                onCreated?.(page.props.flash?.generated ?? null);
            },
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

function DetailRow({ label, value }) {
    return (
        <div className="flex flex-col gap-0.5 border-b border-outline-variant/60 py-3 last:border-b-0 sm:flex-row sm:gap-4">
            <dt className="text-xs font-semibold text-on-surface-variant sm:w-36 sm:shrink-0">
                {label}
            </dt>
            <dd className="break-words text-sm font-medium text-on-surface">
                {value || "-"}
            </dd>
        </div>
    );
}

function formatDate(value) {
    if (!value) return null;
    return new Date(value).toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
    });
}

function UserDetailModal({ user, onClose }) {
    useEffect(() => {
        if (!user) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [user, onClose]);

    if (!user) return null;

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="detail-title"
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-3xl border border-outline-variant bg-surface-lowest p-6 shadow-2xl animate-pop"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2
                            id="detail-title"
                            className="font-display text-xl font-bold text-on-surface"
                        >
                            {user.name}
                        </h2>
                        <span
                            className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                                ROLE_TONE[user.role] ?? ""
                            }`}
                        >
                            {ROLE_LABEL[user.role] ?? user.role}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup"
                        className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-outline-variant text-on-surface-variant transition hover:bg-surface"
                    >
                        <X size={16} aria-hidden="true" />
                    </button>
                </div>

                <dl className="mt-4">
                    <DetailRow
                        label={ID_LABEL[user.role]?.replace(" (opsional)", "")}
                        value={user.identifier}
                    />
                    <DetailRow label="Email" value={user.email} />
                    <DetailRow
                        label="Dibuat pada"
                        value={formatDate(user.created_at)}
                    />
                    <DetailRow
                        label="Terakhir diperbarui"
                        value={formatDate(user.updated_at)}
                    />
                    <DetailRow
                        label="Wajib ganti sandi"
                        value={
                            user.must_change_password === undefined
                                ? null
                                : user.must_change_password
                                  ? "Ya (belum login pertama)"
                                  : "Tidak"
                        }
                    />
                </dl>
            </div>
        </div>
    );
}
const ROLE_FILTERS = [
    ["", "Semua peran"],
    ["siswa", "Siswa"],
    ["mahasiswa", "Mahasiswa"],
    ["guru", "Guru / Dosen"],
    ["admin", "Admin"],
];

const STATUS_FILTERS = [
    ["", "Semua status"],
    ["aktif", "Aktif"],
    ["menunggu", "Menunggu ganti sandi"],
];

const PER_PAGE = [10, 25, 50, 100];
const DEFAULTS = { sort: "created_at", dir: "desc", per_page: 10 };
const SELECT = `${INPUT} cursor-pointer py-2 text-sm`;

function formatShortDate(value) {
    if (!value) return "-";

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function SortHeader({ label, column, sort, dir, onSort, className = "" }) {
    const active = sort === column;
    const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;

    return (
        <th
            aria-sort={
                active ? (dir === "asc" ? "ascending" : "descending") : "none"
            }
            className={`py-3 pr-4 font-bold ${className}`}
        >
            <button
                type="button"
                onClick={() => onSort(column)}
                className="inline-flex cursor-pointer items-center gap-1.5 uppercase tracking-wider transition-colors hover:text-on-surface"
            >
                {label}
                <Icon
                    size={13}
                    aria-hidden="true"
                    className={active ? "text-primary" : "opacity-50"}
                />
            </button>
        </th>
    );
}

function pageItems(current, last) {
    const set = new Set([1, last]);

    for (let p = current - 1; p <= current + 1; p++) {
        if (p >= 1 && p <= last) set.add(p);
    }

    const sorted = [...set].sort((a, b) => a - b);
    const out = [];

    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) out.push(`gap-${p}`);
        out.push(p);
    });

    return out;
}

function Pagination({ meta, onPage }) {
    const [jump, setJump] = useState("");

    if (meta.last_page <= 1) return null;

    const items = pageItems(meta.current_page, meta.last_page);

    const base =
        "grid h-9 min-w-9 cursor-pointer place-items-center rounded-lg border px-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";

    const submitJump = (e) => {
        e.preventDefault();

        const n = parseInt(jump, 10);

        if (!Number.isNaN(n)) {
            onPage(Math.min(Math.max(n, 1), meta.last_page));
        }

        setJump("");
    };

    return (
        <nav
            aria-label="Navigasi halaman"
            className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row"
        >
            <div className="flex flex-wrap items-center justify-center gap-1.5">
                <button
                    type="button"
                    disabled={meta.current_page === 1}
                    onClick={() => onPage(meta.current_page - 1)}
                    aria-label="Halaman sebelumnya"
                    className={`${base} border-outline-variant text-on-surface-variant hover:bg-surface`}
                >
                    <ChevronLeft size={16} aria-hidden="true" />
                </button>

                {items.map((item) =>
                    typeof item === "string" ? (
                        <span
                            key={item}
                            aria-hidden="true"
                            className="px-1 text-on-surface-variant"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={item}
                            type="button"
                            onClick={() => onPage(item)}
                            aria-label={`Halaman ${item}`}
                            aria-current={
                                item === meta.current_page ? "page" : undefined
                            }
                            className={`${base} ${
                                item === meta.current_page
                                    ? "border-transparent bg-linear-to-r from-brand-from to-brand-to text-white shadow-sm"
                                    : "border-outline-variant text-on-surface-variant hover:bg-surface"
                            }`}
                        >
                            {item}
                        </button>
                    ),
                )}

                <button
                    type="button"
                    disabled={meta.current_page === meta.last_page}
                    onClick={() => onPage(meta.current_page + 1)}
                    aria-label="Halaman berikutnya"
                    className={`${base} border-outline-variant text-on-surface-variant hover:bg-surface`}
                >
                    <ChevronRight size={16} aria-hidden="true" />
                </button>
            </div>

            <form onSubmit={submitJump} className="flex items-center gap-2">
                <label
                    htmlFor="jump-page"
                    className="text-xs text-on-surface-variant"
                >
                    Ke halaman
                </label>

                <input
                    id="jump-page"
                    type="number"
                    min={1}
                    max={meta.last_page}
                    value={jump}
                    onChange={(e) => setJump(e.target.value)}
                    placeholder={`1-${meta.last_page}`}
                    className="h-9 w-20 rounded-lg border border-outline-variant bg-surface px-2 text-center text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                />

                <button
                    type="submit"
                    className="h-9 cursor-pointer rounded-lg border border-outline-variant px-3 text-sm font-semibold text-on-surface-variant transition hover:bg-surface hover:text-primary"
                >
                    Pergi
                </button>
            </form>
        </nav>
    );
}

export default function AdminUsers({ users, filters, stats }) {
    const { auth, flash } = usePage().props;

    const [q, setQ] = useState(filters.q ?? "");
    const [loading, setLoading] = useState(false);
    const [created, setCreated] = useState(null);
    const [detail, setDetail] = useState(null);
    const [target, setTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const closeCreated = useCallback(() => setCreated(null), []);
    const closeDetail = useCallback(() => setDetail(null), []);
    const closeTarget = useCallback(() => setTarget(null), []);

    const visit = useCallback(
        (patch = {}) => {
            const next = { ...filters, ...patch };
            const params = {};

            for (const [key, value] of Object.entries(next)) {
                if (value === "" || value === null || value === undefined) {
                    continue;
                }

                if (
                    key in DEFAULTS &&
                    String(value) === String(DEFAULTS[key])
                ) {
                    continue;
                }

                params[key] = value;
            }

            router.get("/admin/pengguna", params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            });
        },
        [filters],
    );

    const visitRef = useRef(visit);
    useEffect(() => {
        visitRef.current = visit;
    });

    const firstRender = useRef(true);
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        if (q.trim() === (filters.q ?? "")) return;

        const timer = setTimeout(() => visitRef.current({ q: q.trim() }), 350);

        return () => clearTimeout(timer);
    }, [q]); 

    const onSort = (column) => {
        const same = filters.sort === column;

        visit({
            sort: column,
            dir: same && filters.dir === "asc" ? "desc" : "asc",
        });
    };

    const hasFilters = Boolean(q || filters.role || filters.status);

    const resetFilters = () => {
        setQ("");
        visit({ q: "", role: "", status: "" });
    };

    const resetPassword = (u) => {
        if (!window.confirm(`Reset kata sandi ${u.name}?`)) return;

        router.put(
            `/admin/pengguna/${u.id}/password`,
            {},
            { preserveScroll: true },
        );
    };

    const confirmRemove = () => {
        if (!target) return;

        router.delete(`/admin/pengguna/${target.id}`, {
            preserveScroll: true,
            onStart: () => setDeleting(true),
            onFinish: () => {
                setDeleting(false);
                setTarget(null);
            },
        });
    };

    return (
        <>
            <Head title="Kelola Pengguna: SmartTech" />

            <AdminLayout
                title="Kelola Pengguna"
                subtitle="Buat dan kelola akun siswa, mahasiswa, guru, dan admin"
            >
                <SuccessModal
                    open={created !== null}
                    title="Akun berhasil dibuat"
                    description={
                        created?.generated
                            ? "Kata sandi sementara ada di kartu di bawah."
                            : undefined
                    }
                    onClose={closeCreated}
                />

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

                {flash?.generated && (
                    <GeneratedCard
                        key={`${flash.generated.login}-${flash.generated.password}`}
                        data={flash.generated}
                    />
                )}

                <CreateUserForm
                    onCreated={(generated) => setCreated({ generated })}
                />

                <section className="rounded-3xl border border-outline-variant bg-surface-low p-6 sm:p-7">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="font-display text-xl font-bold text-on-surface">
                                Daftar Pengguna
                                <span className="ml-2 text-sm font-medium text-on-surface-variant">
                                    ({users.total.toLocaleString("id-ID")})
                                </span>
                            </h2>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-surface"
                                >
                                    <RotateCcw size={13} aria-hidden="true" />
                                    Reset filter
                                </button>
                            )}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto]">
                            <div className="relative">
                                <Search
                                    size={16}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-outline"
                                />

                                <input
                                    type="search"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    maxLength={60}
                                    placeholder="Cari nama, NIS/NIM/NIP, atau email"
                                    aria-label="Cari pengguna"
                                    className={`${INPUT} py-2 pl-10 text-sm`}
                                />
                            </div>

                            <select
                                value={filters.role}
                                onChange={(e) =>
                                    visit({ role: e.target.value })
                                }
                                aria-label="Filter peran"
                                className={SELECT}
                            >
                                {ROLE_FILTERS.map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filters.status}
                                onChange={(e) =>
                                    visit({ status: e.target.value })
                                }
                                aria-label="Filter status"
                                className={SELECT}
                            >
                                {STATUS_FILTERS.map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div
                        aria-busy={loading}
                        className={`mt-5 overflow-x-auto transition-opacity duration-150 ${
                            loading ? "opacity-60" : "opacity-100"
                        }`}
                    >
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-outline-variant text-xs uppercase tracking-wider text-on-surface-variant">
                                    <SortHeader
                                        label="Nama"
                                        column="name"
                                        sort={filters.sort}
                                        dir={filters.dir}
                                        onSort={onSort}
                                    />
                                    <SortHeader
                                        label="ID"
                                        column="identifier"
                                        sort={filters.sort}
                                        dir={filters.dir}
                                        onSort={onSort}
                                    />
                                    <th className="py-3 pr-4 font-bold">
                                        Email
                                    </th>
                                    <SortHeader
                                        label="Peran"
                                        column="role"
                                        sort={filters.sort}
                                        dir={filters.dir}
                                        onSort={onSort}
                                    />
                                    <SortHeader
                                        label="Dibuat"
                                        column="created_at"
                                        sort={filters.sort}
                                        dir={filters.dir}
                                        onSort={onSort}
                                        className="hidden lg:table-cell"
                                    />
                                    <th className="py-3 text-right font-bold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-12 text-center text-on-surface-variant"
                                        >
                                            <p>
                                                Tidak ada pengguna yang cocok
                                                dengan pencarian atau filter.
                                            </p>

                                            {hasFilters && (
                                                <button
                                                    type="button"
                                                    onClick={resetFilters}
                                                    className="mt-3 cursor-pointer text-sm font-semibold text-primary hover:underline"
                                                >
                                                    Reset filter
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )}

                                {users.data.map((u) => {
                                    const self = auth?.user?.id === u.id;

                                    return (
                                        <tr
                                            key={u.id}
                                            className="border-b border-outline-variant/60 transition-colors last:border-b-0 hover:bg-surface"
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
                                                        ROLE_TONE[u.role] ?? ""
                                                    }`}
                                                >
                                                    {ROLE_LABEL[u.role] ??
                                                        u.role}
                                                </span>
                                            </td>

                                            <td className="hidden py-3 pr-4 text-on-surface-variant lg:table-cell">
                                                {formatShortDate(u.created_at)}
                                            </td>

                                            <td className="py-3">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setDetail(u)
                                                        }
                                                        aria-label={`Detail ${u.name}`}
                                                        title="Lihat detail"
                                                        className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-outline-variant text-on-surface-variant transition hover:bg-surface hover:text-primary"
                                                    >
                                                        <Info
                                                            size={16}
                                                            aria-hidden="true"
                                                        />
                                                    </button>

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
                                                            setTarget(u)
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

                    <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                        <p className="text-xs text-on-surface-variant">
                            {users.total > 0
                                ? `Menampilkan ${users.from}–${users.to} dari ${users.total.toLocaleString("id-ID")} pengguna`
                                : "Tidak ada data"}
                        </p>

                        <label className="flex items-center gap-2 text-xs text-on-surface-variant">
                            Baris per halaman
                            <select
                                value={filters.per_page}
                                onChange={(e) =>
                                    visit({ per_page: e.target.value })
                                }
                                className="h-9 cursor-pointer rounded-lg border border-outline-variant bg-surface px-2 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                            >
                                {PER_PAGE.map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <Pagination
                        meta={users}
                        onPage={(page) => visit({ page })}
                    />
                </section>

                <UserDetailModal
                    user={detail}
                    isSelf={auth?.user?.id === detail?.id}
                    onClose={closeDetail}
                    onReset={(u) => {
                        closeDetail();
                        resetPassword(u);
                    }}
                    onDelete={(u) => {
                        closeDetail();
                        setTarget(u);
                    }}
                />

                <ConfirmModal
                    open={target !== null}
                    title="Apakah Anda yakin ingin menghapus akun ini?"
                    description={
                        target
                            ? `Akun ${target.name} akan dihapus permanen dan tidak dapat dikembalikan.`
                            : ""
                    }
                    processing={deleting}
                    onConfirm={confirmRemove}
                    onClose={closeTarget}
                />
            </AdminLayout>
        </>
    );
}
