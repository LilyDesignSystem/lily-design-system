/*
    Next.js App Router — `app/layout.tsx` (SERVER component).

    Reads the `theme` cookie via `cookies()` and writes `<html
    data-theme="…">` plus the active theme's `<link>` so the first
    paint matches the user's choice — no flash.

    The picker itself lives in page.tsx (client component); this
    server component supplies the resolved theme as a prop.
*/

import { cookies } from "next/headers";
import type { ReactNode } from "react";

const KNOWN_THEMES = new Set(["light", "dark", "abyss"]);

export default async function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    const cookieStore = await cookies();
    const cookieTheme = cookieStore.get("theme")?.value;
    const theme = cookieTheme && KNOWN_THEMES.has(cookieTheme)
        ? cookieTheme
        : "light";

    return (
        <html lang="en" data-theme={theme}>
            <head>
                <link
                    rel="stylesheet"
                    href={`/assets/themes/${theme}.css`}
                />
            </head>
            <body>
                {/*
                    Pass the resolved theme as a data attribute the client
                    component can read. Alternatively, pass via a context
                    provider, or via React 19's `use()` on a server-resolved
                    promise.
                */}
                <div data-initial-theme={theme}>{children}</div>
            </body>
        </html>
    );
}
