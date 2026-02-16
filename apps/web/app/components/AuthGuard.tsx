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
        // 1. Check if we are in a public route (like the callback /liberar)
        if (pathname.startsWith("/liberar")) {
            setIsAuthorized(true);
            setIsLoading(false);
            return;
        }

        // 2. Check for session cookie
        const hasSession = document.cookie.split("; ").some((row) => row.startsWith("satellite_session="));

        if (!hasSession) {
            // 3. Redirect to Hub if missing
            const returnUrl = window.location.href;
            window.location.href = `${HUB_URL}/auth/verify-session-browser?system_id=${SYSTEM_ID}&redirect_url=${encodeURIComponent(returnUrl)}`;
        } else {
            setIsAuthorized(true);
            setIsLoading(false);
        }
    }, [pathname]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#E30613]" />
                    <p className="text-sm font-medium text-slate-500">Verificando credenciais...</p>
                </div>
            </div>
        );
    }

    return <>{isAuthorized && children}</>;
}
