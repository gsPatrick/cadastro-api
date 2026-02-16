"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
            <Loader2 className="h-12 w-12 text-red-600 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest font-display">
                Verificando Acesso
            </h2>
            <p className="text-sm text-gray-500 mt-2">
                Conectando ao Sistema de Cadastro...
            </p>
        </div>
    );
}

export default function LiberarScreen() {
    return (
        <Suspense fallback={
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
                <Loader2 className="h-12 w-12 text-red-600 animate-spin mb-4" />
                <p className="text-sm text-gray-500 mt-2 text-center">Iniciando handshake...</p>
            </div>
        }>
            <LiberarContent />
        </Suspense>
    );
}
