// Drop this at src/routes/api/theme/+server.ts in your SvelteKit project.
import type { RequestHandler } from "@sveltejs/kit";

const KNOWN_THEMES = new Set(["light", "dark", "abyss"]);

export const POST: RequestHandler = async ({ request, cookies }) => {
    const body = (await request.json().catch(() => ({}))) as { theme?: string };
    const slug = String(body.theme ?? "");
    if (!KNOWN_THEMES.has(slug)) {
        return new Response("Unknown theme", { status: 400 });
    }
    cookies.set("theme", slug, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    return new Response(null, { status: 204 });
};
