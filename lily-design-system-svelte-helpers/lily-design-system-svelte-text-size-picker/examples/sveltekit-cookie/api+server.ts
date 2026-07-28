// Drop this at src/routes/api/text-size/+server.ts in your SvelteKit project.
import type { RequestHandler } from "@sveltejs/kit";

const KNOWN_SIZES = new Set(["small", "medium", "large", "x-large"]);

export const POST: RequestHandler = async ({ request, cookies }) => {
    const body = (await request.json().catch(() => ({}))) as { textSize?: string };
    const slug = String(body.textSize ?? "");
    if (!KNOWN_SIZES.has(slug)) {
        return new Response("Unknown text size", { status: 400 });
    }
    cookies.set("text-size", slug, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    return new Response(null, { status: 204 });
};
