import { NextRequest, NextResponse } from 'next/server';

const HUB_URL = 'https://hub.sbacem.app.br';

export async function GET(req: NextRequest) {
    const sessionCookie = req.cookies.get('satellite_session');

    if (!sessionCookie?.value || !sessionCookie.value.startsWith('token:')) {
        return NextResponse.json({ error: 'Sessão inválida ou expirada' }, { status: 401 });
    }

    const token = sessionCookie.value.replace('token:', '');

    try {
        // Validate against the Hub to ensure immediate revocation
        const hubResponse = await fetch(`${HUB_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!hubResponse.ok) {
            console.warn(`[me] Hub rejected session: ${hubResponse.status}`);
            return NextResponse.json({ error: 'Sessão revogada ou expirada' }, { status: 401 });
        }

        const userData = await hubResponse.json();

        return NextResponse.json({
            status: 'authenticated',
            user: userData.email, // Return email or full user object
            data: userData
        });

    } catch (error) {
        console.error('[me] Error contacting Hub:', error);
        // If Hub is down, do we fail open or closed? Closed for security.
        return NextResponse.json({ error: 'Erro ao validar sessão' }, { status: 500 });
    }
}
