"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import React from "react";

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
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                    }}>
                </div>

                {/* Radial Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#152341]/30 to-[#0f172a]" />

                <div className="relative flex flex-col items-center">
                    <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                        {/* Concentric Rings (Animated) */}
                        <div className="absolute border border-[#c11e3c]/30 border-dashed rounded-full w-48 h-48 animate-[spin_10s_linear_infinite]" />
                        <div className="absolute border border-slate-700/50 rounded-full w-64 h-64 animate-[pulse_4s_ease-in-out_infinite]" />

                        {/* Central Shield */}
                        <div className="relative z-10 flex items-center justify-center w-24 h-24 bg-[#152341] rounded-3xl border-2 border-[#c11e3c] shadow-[0_0_50px_-12px_rgba(193,30,60,0.5)]">
                            <Shield className="h-12 w-12 text-[#c11e3c] animate-pulse" />
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-white drop-shadow-2xl">
                            Verificando Segurança
                        </h2>
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-slate-700" />
                            <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Secure Handshake v2.5</span>
                            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-slate-700" />
                        </div>
                    </div>

                    {/* Progress bar simulation */}
                    <div className="w-64 h-1.5 bg-slate-800/50 rounded-full mt-12 overflow-hidden border border-slate-700/30">
                        <div className="h-full bg-gradient-to-r from-[#c11e3c] to-[#f43f5e] animate-[progress_3s_ease-in-out_infinite]" />
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes progress {
                        0% { transform: translateX(-100%); }
                        50% { transform: translateX(0); }
                        100% { transform: translateX(100%); }
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 0.5; transform: scale(1); }
                        50% { opacity: 0.8; transform: scale(1.05); }
                    }
                `}} />
            </div>
        );
    }

    return <>{isAuthorized && children}</>;
}
