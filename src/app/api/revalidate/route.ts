import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    revalidatePath("/");
    fetch(process.env.APP_URL!, {
      headers: {
        "Cache-Control": "no-cache",
      },
    }).catch(err => console.error('Revalidation fetch failed:', err));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Error revalidating" }, { status: 500 });
  }
}
