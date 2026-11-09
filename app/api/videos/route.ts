import { listVideos } from '../../../lib/video-assets';
export async function GET() { try { return Response.json(await listVideos()); } catch { return Response.json({ error: 'Videos unavailable.' }, { status: 503 }); } }
