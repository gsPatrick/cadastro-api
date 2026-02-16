"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SYSTEM_ID = 3; // Sistema-cadastro-associacao
const HUB_URL = "https://api.sbacem.com.br/apicentralizadora";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // 1. Check if we are in a public route
            if (pathname.startsWith("/liberar")) {
                setIsAuthorized(true);
                setIsLoading(false);
                return;
            }

            try {
                // 2. Check session via backend (supports HttpOnly cookies)
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    setIsAuthorized(true);
                } else {
                    throw new Error("Unauthorized");
                }
            } catch (err) {
                // 3. Redirect to Hub if missing
                const returnUrl = window.location.href;
                window.location.href = `${HUB_URL}/auth/verify-session-browser?system_id=${SYSTEM_ID}&redirect_url=${encodeURIComponent(returnUrl)}`;
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f172a] text-white overflow-hidden font-sans">
                {/* Background Animated Elements */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="relative flex flex-col items-center">
                    {/* Core Icon with Pulse */}
                    <div className="relative mb-8 text-center">
                        <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 animate-ping" />
                        <div className="relative h-20 w-20 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl mx-auto">
                            <div className="h-10 w-10 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                    </div>

                    <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white/90 drop-shadow-lg text-center">
                        Verificando Segurança
                    </h2>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-8 opacity-60">
                        Secure Handshake v2.1
                    </p>
                </div>
            </div>
        );
    }

    return <>{isAuthorized && children}</>;
}
