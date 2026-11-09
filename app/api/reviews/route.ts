import { getDb } from '../../../db';
import { reviews } from '../../../db/schema';
import { desc } from 'drizzle-orm';
export async function GET() {
  try { return Response.json(await getDb().select().from(reviews).orderBy(desc(reviews.created)).limit(30)); }
  catch { return Response.json({error:'Reviews are temporarily unavailable.'},{status:503}); }
}
// Visitor feedback submissions are disabled; testimonies are edited in source.
export async function POST() {
  return Response.json({error:'Feedback submissions are disabled.'},{status:405,headers:{Allow:'GET'}});
}
