import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('auth.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Sign In — Egie's Beauty Boutique" />

            {status && (
                <div className="mb-5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-pink-700 mb-1"
                    >
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        autoFocus
                        placeholder="you@example.com"
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-pink-50/60 text-gray-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                {/* Password */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-pink-700 mb-1"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-pink-50/60 text-gray-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="rounded border-pink-300 text-pink-500 focus:ring-pink-400"
                        />
                        <span className="text-sm text-gray-400">Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-pink-500 hover:text-rose-600 underline underline-offset-2 transition"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={processing}
                    className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-md shadow-pink-200 transition-all duration-200 tracking-wide ${
                        processing
                            ? 'opacity-60 cursor-not-allowed'
                            : 'hover:from-pink-600 hover:to-rose-600 hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                >
                    {processing ? 'Signing in…' : 'Sign In'}
                </button>
            </form>
        </GuestLayout>
    );
}
