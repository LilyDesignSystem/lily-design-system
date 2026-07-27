// functions/api/theme.js
//
// Cloudflare Pages Functions endpoint that writes the `theme`
// cookie when the client.js's onChange fires.

const SUPPORTED = new Set(["light", "dark", "abyss"]);

export async function onRequestPost({ request }) {
    let body;
    try {
        body = await request.json();
    } catch {
        return new Response("Bad JSON", { status: 400 });
    }
    const theme = String(body?.theme ?? "");
    if (!SUPPORTED.has(theme)) {
        return new Response("Unknown theme", { status: 400 });
    }
    return new Response(null, {
        status: 204,
        headers: {
            "set-cookie": [
                `theme=${encodeURIComponent(theme)}`,
                "Path=/",
                "Max-Age=31536000",
                "SameSite=Lax",
            ].join("; "),
        },
    });
}
