import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import AppHeader from "../Components/AppHeader";

const INPUT =
    "w-full rounded-xl border border-outline-variant bg-surface py-3 pl-11 pr-12 text-[15px] text-on-surface placeholder:text-outline transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 aria-invalid:border-error";

function PasswordInput({ id, label, error, ...props }) {
    const [show, setShow] = useState(false);

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-[13px] font-semibold text-on-surface">
                {label}
            </label>

            <div className="relative flex items-center">
                <Lock
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 text-outline"
                />

                <input
                    id={id}
                    type={show ? "text" : "password"}
                    aria-invalid={error ? "true" : undefined}
                    className={INPUT}
                    {...props}
                />

                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    className="absolute right-2.5 grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-outline hover:text-on-surface"
                >
                    {show ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
            </div>

            {error && <p className="text-xs font-medium text-error">{error}</p>}
        </div>
    );
}

export default function ChangePassword({ forced = false }) {
    const form = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const change = (key) => (e) => {
        form.setData(key, e.target.value);
        if (form.errors[key]) form.clearErrors(key);
    };

    const submit = (e) => {
        e.preventDefault();
        form.put("/ganti-sandi", {
            onFinish: () => form.reset(),
        });
    };

    return (
        <>
            <Head title="Ganti Kata Sandi: SmartTech" />

            <div className="min-h-screen bg-surface font-sans text-on-surface antialiased">
                <AppHeader />

                <main className="mx-auto w-full max-w-[520px] px-5 py-10 sm:px-6">
                    <div className="rounded-3xl border border-outline-variant bg-surface-low p-7 sm:p-9">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-brand-from to-brand-to text-white">
                            <ShieldCheck size={22} aria-hidden="true" />
                        </span>

                        <h1 className="mt-5 font-display text-2xl font-extrabold text-on-surface">
                            Ganti Kata Sandi
                        </h1>

                        <p className="mt-2 text-[14px] leading-relaxed text-on-surface-variant">
                            {forced
                                ? "Anda masih memakai kata sandi sementara dari admin. Buat kata sandi baru untuk melanjutkan."
                                : "Gunakan kombinasi huruf besar, huruf kecil, dan angka minimal 8 karakter."}
                        </p>

                        <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-4">
                            <PasswordInput
                                id="cp-current"
                                label="Kata Sandi Saat Ini"
                                autoComplete="current-password"
                                value={form.data.current_password}
                                onChange={change("current_password")}
                                error={form.errors.current_password}
                            />

                            <PasswordInput
                                id="cp-new"
                                label="Kata Sandi Baru"
                                autoComplete="new-password"
                                value={form.data.password}
                                onChange={change("password")}
                                error={form.errors.password}
                            />

                            <PasswordInput
                                id="cp-confirm"
                                label="Ulangi Kata Sandi Baru"
                                autoComplete="new-password"
                                value={form.data.password_confirmation}
                                onChange={change("password_confirmation")}
                                error={form.errors.password_confirmation}
                            />

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-from to-brand-to px-6 py-3 text-[15px] font-semibold text-white shadow-lg shadow-brand-from/25 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {form.processing ? "Menyimpan..." : "Simpan Kata Sandi"}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}