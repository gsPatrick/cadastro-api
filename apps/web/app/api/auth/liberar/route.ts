import { NextRequest, NextResponse } from 'next/server';

const HUB_URL = process.env.CENTRAL_HUB_URL || 'https://api.sbacem.com.br/apicentralizadora';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        // Call the Central Hub to validate the transfer token
        const hubResponse = await fetch(`${HUB_URL}/auth/validate-ticket`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });

        if (!hubResponse.ok) {
            const errorData = await hubResponse.json().catch(() => ({}));
            console.error('[liberar] Hub rejected token:', hubResponse.status, errorData);
            return NextResponse.json(
                { error: 'Acesso negado', detail: errorData },
                { status: 403 }
            );
        }

        const userData = await hubResponse.json();

        // Create the response with user data
        const response = NextResponse.json({ ok: true, user: userData });

        // Set the satellite_session cookie directly on the browser response with the access token
        // We prefix with "token:" to distinguish from the old "user:" format if needed, or just store the token.
        response.cookies.set('satellite_session', `token:${userData.access_token}`, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false, // amplo.app.br uses HTTP
            maxAge: 3600, // 1 hour
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('[liberar] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
