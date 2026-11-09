import { env } from 'cloudflare:workers';
import { getDb } from '../../../../db';
import { videoAssets } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [record] = await getDb().select().from(videoAssets).where(eq(videoAssets.id, id));
  if (!record?.objectKey || record.deleted) return new Response('Not found', { status: 404 });
  const bucket = (env as unknown as { BUCKET?: R2Bucket }).BUCKET;
  if (!bucket) return new Response('Storage unavailable', { status: 503 });
  const rangeRequested = request.headers.has('range');
  const object = await bucket.get(record.objectKey, rangeRequested ? { range: request.headers } : undefined);
  if (!object) return new Response('Not found', { status: 404 });
  const headers = new Headers({ 'Content-Type': object.httpMetadata?.contentType || 'video/mp4', 'Accept-Ranges': 'bytes', 'Cache-Control': 'public, max-age=3600' });
  if (rangeRequested && object.range && 'offset' in object.range && typeof object.range.offset === 'number' && typeof object.range.length === 'number') {
    const end = object.range.offset + object.range.length - 1;
    headers.set('Content-Range', `bytes ${object.range.offset}-${end}/${object.size}`);
    headers.set('Content-Length', String(object.range.length));
    return new Response(object.body, { status: 206, headers });
  }
  headers.set('Content-Length', String(object.size));
  return new Response(object.body, { headers });
}
