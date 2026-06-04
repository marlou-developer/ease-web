import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 relative overflow-hidden px-4 py-10">
            {/* Decorative background blobs */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 pointer-events-none" />
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 pointer-events-none" />

            {/* Brand header */}
            <div className="relative z-10 text-center">
                <Link
                    href="/"
                    className="inline-flex flex-col items-center group"
                >
                    <img
                        src="/images/logo-egies.png"
                        alt="Egie's POS Logo"
                        className="h-20 w-full fill-current text-gray-500"
                    />
                </Link>
            </div>

            {/* Card */}
            <div className="relative z-10 w-full sm:max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-pink-200 border border-pink-100 px-8 py-8">
                {children}
            </div>

            <p className="relative z-10 text-center text-xs text-pink-300 mt-6">
                © {new Date().getFullYear()} Egie's Beauty Boutique. All rights
                reserved.
            </p>
        </div>
    );
}
