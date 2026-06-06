"use client";

/*
    06. Wiring react-intl (FormatJS).

    The picker's `value` + `onChange` pair drives the locale prop on
    `<IntlProvider>`. Every `<FormattedMessage>` in the tree
    re-evaluates against the new dictionary on locale change.

    Prerequisites:
        pnpm add react-intl
        // Create per-locale JSON files exported as Record<string,string>.

    Outcome: choosing a locale flips the message dictionary; the
    document root also gets the new lang/dir from the picker.
*/

import { useState } from "react";
import { LocalePicker } from "../LocalePicker";

// Demo-only stand-ins so this file compiles without react-intl installed.
// In your real app, import from "react-intl":
//   import { IntlProvider, FormattedMessage } from "react-intl";
type IntlProviderProps = {
    locale: string;
    messages: Record<string, string>;
    defaultLocale?: string;
    children: React.ReactNode;
};
function IntlProvider({ children }: IntlProviderProps): React.ReactElement {
    return <>{children}</>;
}
function FormattedMessage({
    id,
    defaultMessage,
}: {
    id: string;
    defaultMessage: string;
}): React.ReactElement {
    return <>{defaultMessage ?? id}</>;
}

const MESSAGES: Record<string, Record<string, string>> = {
    en: {
        "home.heading": "Welcome",
        "home.body": "This page is currently in English.",
    },
    fr: {
        "home.heading": "Bienvenue",
        "home.body": "Cette page est actuellement en français.",
    },
    ar: {
        "home.heading": "أهلاً وسهلاً",
        "home.body": "هذه الصفحة باللغة العربية حالياً.",
    },
};

export function WithReactIntlExample() {
    const [locale, setLocale] = useState("en");

    return (
        <IntlProvider
            locale={locale}
            messages={MESSAGES[locale] ?? MESSAGES.en}
            defaultLocale="en"
        >
            <LocalePicker
                label="Language"
                locales={["en", "fr", "ar"]}
                localeLabels={{ en: "English", fr: "Français", ar: "العربية" }}
                value={locale}
                onChange={setLocale}
                storageKey="app-locale"
                detectFromNavigator
            />

            <h1>
                <FormattedMessage id="home.heading" defaultMessage="Welcome" />
            </h1>
            <p>
                <FormattedMessage id="home.body" defaultMessage="Body text" />
            </p>
        </IntlProvider>
    );
}

export default WithReactIntlExample;
