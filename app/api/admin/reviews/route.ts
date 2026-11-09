import { getDb } from '../../../../db';
import { reviews } from '../../../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { isAdmin, sameOrigin, unauthorized } from '../../../../lib/admin-auth';

export async function GET(request: Request) {
  if (!await isAdmin(request)) return unauthorized();
  return Response.json(await getDb().select().from(reviews).orderBy(desc(reviews.created)));
}
export async function DELETE(request: Request) {
  if (!await isAdmin(request)) return unauthorized();
  if (!sameOrigin(request)) return Response.json({ error: 'Invalid origin.' }, { status: 403 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return Response.json({ error: 'Review ID required.' }, { status: 400 });
  await getDb().delete(reviews).where(eq(reviews.id, id));
  return new Response(null, { status: 204 });
}
