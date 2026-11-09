import { getDb } from '../../../db';
import { reviews } from '../../../db/schema';
import { desc } from 'drizzle-orm';
export async function GET() {
  try { return Response.json(await getDb().select().from(reviews).orderBy(desc(reviews.created)).limit(30)); }
  catch { return Response.json({error:'Reviews are temporarily unavailable.'},{status:503}); }
}
export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return Response.json({error:'Invalid origin'},{status:403});
  try {
    const body = await request.json() as Record<string, unknown>;
    if (typeof body.name !== 'string' || !body.name.trim() || body.name.length > 70 || typeof body.event !== 'string' || body.event.length > 80 || typeof body.message !== 'string' || body.message.trim().length < 10 || body.message.length > 600 || typeof body.rating !== 'number' || !Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5 || body.website) return Response.json({error:'Please check your review details.'},{status:400});
    const record = {id:crypto.randomUUID(),name:body.name.trim(),event:body.event.trim(),message:body.message.trim(),rating:body.rating,created:Date.now()};
    await getDb().insert(reviews).values(record);
    return Response.json(record,{status:201});
  } catch { return Response.json({error:'Could not save your review. Please try again.'},{status:503}); }
}

