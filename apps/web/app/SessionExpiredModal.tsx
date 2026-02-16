"use client";

import { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";

const HUB_VERIFY_URL = "http://localhost:8000/auth/verify-session-browser";
const SYSTEM_ID = "3";

export function SessionExpiredModal() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleSessionExpired = () => setOpen(true);
        window.addEventListener("session-expired", handleSessionExpired);
        return () => window.removeEventListener("session-expired", handleSessionExpired);
    }, []);

    const handleVerify = () => {
        const currentUrl = window.location.href;
        window.location.href = `${HUB_VERIFY_URL}?system_id=${SYSTEM_ID}&redirect_url=${encodeURIComponent(currentUrl)}`;
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 border-l-4 border-red-600">
                <div className="flex flex-col items-center text-center">
                    <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mb-5 text-red-600">
                        <CircleAlert className="h-8 w-8" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">Sessão Expirada</h2>
                    <p className="text-gray-500 mb-6 text-sm">
                        Para sua segurança, renove suas credenciais no Hub Central.
                    </p>

                    <button
                        onClick={handleVerify}
                        className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors uppercase text-xs tracking-wider"
                    >
                        Validar Acesso
                    </button>
                </div>
            </div>
        </div>
    );
}
