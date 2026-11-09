import { env } from 'cloudflare:workers';

const cookieName = 'nextlevel_admin';
const configuredPassword = () => (env as unknown as { ADMIN_PASSWORD?: string }).ADMIN_PASSWORD || 'nextlevel@events';
const bytes = new TextEncoder();

async function signature(value: string) {
  const key = await crypto.subtle.importKey('raw', bytes.encode(configuredPassword()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signed = await crypto.subtle.sign('HMAC', key, bytes.encode(value));
  return Array.from(new Uint8Array(signed), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function isAdmin(request: Request) {
  const cookie = request.headers.get('cookie')?.split(';').map(part => part.trim()).find(part => part.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
  if (!cookie) return false;
  const [expires, mac] = cookie.split('.');
  if (!expires || !mac || !/^\d+$/.test(expires) || Number(expires) < Date.now()) return false;
  return mac === await signature(expires);
}

export async function sessionCookie(request: Request) {
  const expires = String(Date.now() + 8 * 60 * 60 * 1000);
  return `${cookieName}=${expires}.${await signature(expires)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
}

export function validPassword(input: unknown) { return typeof input === 'string' && input === configuredPassword(); }
export function sameOrigin(request: Request) { return request.headers.get('origin') === new URL(request.url).origin; }
export const unauthorized = () => Response.json({ error: 'Admin sign-in required.' }, { status: 401 });
