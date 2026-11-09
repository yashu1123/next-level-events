import { isAdmin, sameOrigin, sessionCookie, unauthorized, validPassword } from '../../../../lib/admin-auth';

export async function GET(request: Request) { return Response.json({ authenticated: await isAdmin(request) }); }
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Invalid origin.' }, { status: 403 });
  const body = await request.json().catch(() => null) as { password?: string } | null;
  if (!validPassword(body?.password)) return unauthorized();
  return new Response(JSON.stringify({ authenticated: true }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': await sessionCookie(request), 'Cache-Control': 'no-store' } });
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Invalid origin.' }, { status: 403 });
  return new Response(null, { status: 204, headers: { 'Set-Cookie': 'nextlevel_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' } });
}
