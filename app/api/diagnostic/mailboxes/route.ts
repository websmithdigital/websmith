import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/backend-db';

/**
 * DIAGNOSTIC ENDPOINT ONLY
 * Blocked in production to prevent mail infrastructure exposure.
 */
export async function GET(request: NextRequest) {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    const authHeader = request.headers.get('authorization');
    const secretKey = process.env.DIAGNOSTIC_SECRET || process.env.JWT_SECRET;
    if (secretKey && authHeader !== `Bearer ${secretKey}`) {
        return NextResponse.json({ error: 'Unauthorized diagnostic access' }, { status: 401 });
    }

    try {
        const pool = await getDb();
        const result = await pool.query(
            `SELECT 
        id,
        email_address,
        imap_host,
        imap_port,
        imap_secure,
        imap_username,
        is_enabled,
        sync_status,
        last_sync_at,
        updated_at
       FROM mailboxes
       ORDER BY email_address`
        );

        return NextResponse.json({
            success: true,
            mailboxCount: result.rows.length,
            mailboxes: result.rows.map(row => ({
                id: row.id,
                email: row.email_address,
                imap: {
                    host: row.imap_host,
                    port: row.imap_port,
                    secure: row.imap_secure,
                    username: row.imap_username,
                    passwordConfigured: !!row.imap_username, // Don't expose actual password
                },
                enabled: row.is_enabled,
                syncStatus: row.sync_status,
                lastSync: row.last_sync_at,
            })),
            critical: result.rows.length === 0 ? 'NO MAILBOXES CONFIGURED' :
                !result.rows.find((r: any) => r.email_address?.includes('support@')) ? 'NO SUPPORT@ MAILBOX' :
                    !result.rows.find((r: any) => r.email_address?.includes('support@') && r.is_enabled) ? 'SUPPORT@ DISABLED' :
                        'OK'
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error?.message || 'Unknown error'
        }, { status: 500 });
    }
}
