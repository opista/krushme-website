import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { secret } = await req.json();

    if (secret !== process.env.REVALIDATE_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    revalidatePath("/");

    return new Response(JSON.stringify({ revalidated: true, path: "/" }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ revalidated: false }), {
      status: 500,
    });
  }
}
