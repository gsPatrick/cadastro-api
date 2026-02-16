"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Shield } from "lucide-react";

function LiberarContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const nextPath = searchParams.get("next") || "/";

    useEffect(() => {
        if (!token) return;

        const runHandshake = async () => {
            try {
                // Use relative path for production compatibility
                const res = await fetch(`/api/auth/liberar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                    credentials: 'include'
                });

                if (res.ok) {
                    router.push(nextPath);
                } else {
                    console.error("Falha no handshake");
                    alert("Falha na validação de acesso.");
                }
            } catch (err) {
                console.error("Erro de conexão", err);
            }
        };

        runHandshake();
    }, [token, nextPath, router]);

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
                        <Shield className="h-10 w-10 text-blue-500 animate-pulse" />
                    </div>
                </div>

                {/* Text */}
                <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white/90 drop-shadow-lg text-center">
                    Validando Permissões
                </h2>

                {/* Progress bar simulation */}
                <div className="w-48 h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-blue-600 animate-[progress_2s_ease-in-out_infinite]" />
                </div>

                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-8 opacity-60">
                    Sincronização Segura v2.1
                </p>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0); }
                    100% { transform: translateX(100%); }
                }
            `}} />
        </div>
    );
}

export default function LiberarScreen() {
    return (
        <Suspense fallback={
            <div className="fixed inset-0 flex items-center justify-center bg-[#0f172a] z-50">
                <div className="h-10 w-10 border-2 border-white/10 border-t-red-600 rounded-full animate-spin" />
            </div>
        }>
            <LiberarContent />
        </Suspense>
    );
}
