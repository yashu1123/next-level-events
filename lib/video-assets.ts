import { getDb } from '../db';
import { videoAssets } from '../db/schema';

export const builtInVideos = ['video1.mp4', 'Video 2.mp4', 'video3.mp4', 'video 4.mp4', 'video 5.mp4', 'Video 6.mp4'];
export type SiteVideo = { id: string; name: string; url: string; builtIn: boolean };

export async function listVideos(): Promise<SiteVideo[]> {
  const records = await getDb().select().from(videoAssets);
  const hidden = new Set(records.filter(item => item.deleted).map(item => item.id));
  const originals = builtInVideos.map((name, index) => ({ id: `built-in-${index + 1}`, name, url: `/moments/${encodeURIComponent(name)}`, builtIn: true })).filter(item => !hidden.has(item.id));
  const uploads = records.filter(item => item.objectKey && !item.deleted).sort((a, b) => a.created - b.created).map(item => ({ id: item.id, name: item.name, url: `/api/videos/${encodeURIComponent(item.id)}`, builtIn: false }));
  return [...originals, ...uploads];
}
