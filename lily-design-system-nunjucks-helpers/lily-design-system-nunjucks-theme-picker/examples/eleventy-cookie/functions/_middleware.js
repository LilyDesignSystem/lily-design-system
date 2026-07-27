// functions/_middleware.js
//
// Cloudflare Pages Functions edge middleware: read the `theme`
// cookie on every request and substitute the __THEME__ placeholder
// in the built HTML so the first paint matches the user's choice.
//
// Equivalent patterns work on Netlify Edge Functions, Vercel Edge
// Functions, Deno Deploy, etc. — read the cookie, rewrite the body.

const SUPPORTED = new Set(["light", "dark", "abyss"]);
const DEFAULT_THEME = "light";

function parseCookie(cookieHeader, name) {
    const re = new RegExp(`(?:^|; )${name}=([^;]+)`);
    const m = re.exec(cookieHeader ?? "");
    return m ? decodeURIComponent(m[1]) : null;
}

export async function onRequest(context) {
    const response = await context.next();
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("text/html")) return response;

    const cookieHeader = context.request.headers.get("cookie") ?? "";
    const cookieTheme = parseCookie(cookieHeader, "theme");
    const theme = cookieTheme && SUPPORTED.has(cookieTheme)
        ? cookieTheme
        : DEFAULT_THEME;

    const html = await response.text();
    const patched = html.replaceAll("__THEME__", theme);
    return new Response(patched, response);
}
