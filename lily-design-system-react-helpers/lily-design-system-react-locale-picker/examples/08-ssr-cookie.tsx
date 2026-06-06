"use client";

/*
    08. Next.js App Router SSR with cookie persistence.

    No flash of default locale: the server reads the cookie, writes
    `<html lang dir>`, and seeds the client component with `initialLocale`.
    The picker's `onChange` writes the cookie back.

    This file is the CLIENT component. The companion SERVER component
    (the layout) is shown in the block-comment below.

    Outcome: every request paints with the right lang/dir from byte zero.
    Choosing a locale rewrites the cookie and updates the DOM in the
    same tick.
*/

import { useState } from "react";
import { LocalePicker } from "../LocalePicker";

export function LocaleClient({
    initialLocale,
    children,
}: {
    initialLocale: string;
    children?: React.ReactNode;
}) {
    const [locale, setLocale] = useState(initialLocale);

    function writeCookie(code: string) {
        document.cookie =
            `locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
    }

    return (
        <>
            <LocalePicker
                label="Language"
                locales={["en", "fr", "ar", "he"]}
                value={locale}
                onChange={(code) => {
                    setLocale(code);
                    writeCookie(code);
                }}
            />
            {children}
        </>
    );
}

export default LocaleClient;

/*
    Companion server component (place in app/layout.tsx):

    // app/layout.tsx — SERVER component (no "use client")
    import { cookies } from "next/headers";
    import {
        isRtlLocale,
        bcp47LocaleTag,
    } from "lily-design-system-react-locale-picker";
    import { LocaleClient } from "./locale-client";

    const KNOWN = new Set(["en", "fr", "ar", "he"]);

    export default async function RootLayout({
        children,
    }: {
        children: React.ReactNode;
    }) {
        const cookieStore = await cookies();
        const cookieLocale = cookieStore.get("locale")?.value;
        const locale = cookieLocale && KNOWN.has(cookieLocale)
            ? cookieLocale
            : "en";
        const lang = bcp47LocaleTag(locale);
        const dir = isRtlLocale(locale) ? "rtl" : "ltr";

        return (
            <html lang={lang} dir={dir}>
                <body>
                    <LocaleClient initialLocale={locale}>
                        {children}
                    </LocaleClient>
                </body>
            </html>
        );
    }

    Notes:
        - `cookies()` is async in Next 15 / React 19.
        - Import ONLY the pure helpers from a server component; do not
          import LocalePicker itself there (it carries "use client").
        - The cookie value flows: server cookie → initialLocale prop →
          useState initial → value prop → checked radio + lang/dir
          attributes. Server and client agree, no hydration mismatch.
*/
