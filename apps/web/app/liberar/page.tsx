"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Satellite 1 Backend URL (NestJS)
const SATELLITE_API = "http://localhost:3001"; // NestJS usually 3000 or 3001. Assuming 3001 or configured via env? 
// Based on typical monorepos, check if we need to set this dynammically. 
// For now, I'll use relative path '/auth/liberar' if on same domain via proxy, or localhost if separated.
// The api.ts uses NEXT_PUBLIC_API_BASE_URL.
const useApiBase = true; // Use api.ts logic ideally.

export default function LiberarScreen() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const nextPath = searchParams.get("next") || "/";

    useEffect(() => {
        if (!token) return;

        const runHandshake = async () => {
            try {
                // Using fetch directly to access the AuthController we just made
                // The URL depends on how the frontend calls the backend. 
                // api.ts uses `process.env.NEXT_PUBLIC_API_BASE_URL`.
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333'; // NestJS default often 3000/3333

                const res = await fetch(`${baseUrl}/api/auth/liberar`, {
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
