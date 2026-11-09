import { env } from 'cloudflare:workers';
import { getDb } from '../../../../db';
import { videoAssets } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { isAdmin, sameOrigin, unauthorized } from '../../../../lib/admin-auth';
import { builtInVideos, listVideos } from '../../../../lib/video-assets';

const maxBytes = 100_000_000;
const bucket = () => (env as unknown as { BUCKET?: R2Bucket }).BUCKET;

export async function GET(request: Request) {
  if (!await isAdmin(request)) return unauthorized();
  return Response.json(await listVideos());
}

export async function POST(request: Request) {
  if (!await isAdmin(request)) return unauthorized();
  if (!sameOrigin(request)) return Response.json({ error: 'Invalid origin.' }, { status: 403 });
  const length = Number(request.headers.get('content-length'));
  const type = request.headers.get('content-type') || '';
  const name = decodeURIComponent(request.headers.get('x-file-name') || 'video.mp4').slice(0, 120);
  if (!Number.isInteger(length) || length < 1 || length > maxBytes) return Response.json({ error: 'Choose a video up to 100 MB.' }, { status: 413 });
  if (!['video/mp4', 'video/webm', 'video/quicktime'].includes(type)) return Response.json({ error: 'Use an MP4, WebM or MOV video.' }, { status: 415 });
  if (!request.body || !bucket()) return Response.json({ error: 'Video storage is unavailable.' }, { status: 503 });
  const id = crypto.randomUUID();
  const objectKey = `moments/${id}`;
  try {
    await bucket()!.put(objectKey, request.body, { httpMetadata: { contentType: type } });
    await getDb().insert(videoAssets).values({ id, name, objectKey, deleted: 0, created: Date.now() });
    return Response.json({ id, name, url: `/api/videos/${id}`, builtIn: false }, { status: 201 });
  } catch {
    await bucket()!.delete(objectKey).catch(() => {});
    return Response.json({ error: 'Could not save the video.' }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!await isAdmin(request)) return unauthorized();
  if (!sameOrigin(request)) return Response.json({ error: 'Invalid origin.' }, { status: 403 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return Response.json({ error: 'Video ID required.' }, { status: 400 });
  const builtInIndex = /^built-in-([1-6])$/.exec(id);
  if (builtInIndex) {
    const name = builtInVideos[Number(builtInIndex[1]) - 1];
    await getDb().insert(videoAssets).values({ id, name, objectKey: null, deleted: 1, created: Date.now() }).onConflictDoUpdate({ target: videoAssets.id, set: { deleted: 1 } });
    return new Response(null, { status: 204 });
  }
  const [record] = await getDb().select().from(videoAssets).where(eq(videoAssets.id, id));
  if (!record?.objectKey) return Response.json({ error: 'Video not found.' }, { status: 404 });
  await getDb().update(videoAssets).set({ deleted: 1 }).where(eq(videoAssets.id, id));
  await bucket()?.delete(record.objectKey);
  return new Response(null, { status: 204 });
}
