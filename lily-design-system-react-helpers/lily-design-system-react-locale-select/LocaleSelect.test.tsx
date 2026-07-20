import * as React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import LocaleSelect, {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    type ChildArgs,
} from "./LocaleSelect";

const LOCALES = ["en", "en_US", "fr", "fr_CA", "ar"];

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

function getList(): HTMLElement {
    return document.querySelector(".locale-select-list") as HTMLElement;
}

function resetRoot(): void {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
}

beforeEach(() => {
    resetRoot();
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    cleanup();
    resetRoot();
});

/** Open the listbox and click the option for `code`. */
function pick(code: string, locales: string[] = LOCALES): void {
    fireEvent.click(screen.getByRole("button"));
    const opts = document.querySelectorAll(".locale-select-option");
    fireEvent.click(opts[locales.indexOf(code)]);
}

describe("LocaleSelect — pure helpers (§7.2)", () => {
    test("§7.7 bcp47LocaleTag converts en_US to en-US", () => {
        expect(bcp47LocaleTag("en_US")).toBe("en-US");
    });

    test("§7.8 bcp47LocaleTag converts zh_Hant_TW to zh-Hant-TW", () => {
        expect(bcp47LocaleTag("zh_Hant_TW")).toBe("zh-Hant-TW");
    });

    test("§7.9 bcp47LocaleTag leaves en untouched", () => {
        expect(bcp47LocaleTag("en")).toBe("en");
    });

    test("§7.10 RTL detection for ar, he_IL, and Arabic-script Uzbek", () => {
        expect(isRtlLocale("ar")).toBe(true);
        expect(isRtlLocale("he_IL")).toBe(true);
        expect(isRtlLocale("uz_Arab_AF")).toBe(true);
    });

    test("§7.11 LTR detection for en and fr_CA", () => {
        expect(isRtlLocale("en")).toBe(false);
        expect(isRtlLocale("fr_CA")).toBe(false);
    });

    test("§7.12 localeName resolves en_US via the built-in table", () => {
        expect(localeName("en_US")).toBe("English (United States)");
    });

    test("RTL detection is case-insensitive on script subtag", () => {
        expect(isRtlLocale("uz_arab_af")).toBe(true);
        expect(isRtlLocale("UZ_ARAB_AF")).toBe(true);
    });

    test("matchNavigatorLanguage exact match wins", () => {
        expect(matchNavigatorLanguage(["fr-CA"], ["en", "fr_CA"])).toBe("fr_CA");
    });

    test("matchNavigatorLanguage language-only fallback", () => {
        expect(matchNavigatorLanguage(["fr-CA"], ["en", "fr"])).toBe("fr");
    });

    test("matchNavigatorLanguage returns empty when no match", () => {
        expect(matchNavigatorLanguage(["xx-YY"], ["en", "fr"])).toBe("");
    });
});

describe("LocaleSelect — markup contract (§4.3, §7.1)", () => {
    test("§7.1 renders a button that controls a listbox", () => {
        render(<LocaleSelect label="Language" locales={LOCALES} />);
        const button = screen.getByRole("button");
        expect(button.tagName).toBe("BUTTON");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-haspopup")).toBe("listbox");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        const listId = button.getAttribute("aria-controls");
        expect(listId).toBeTruthy();
        expect(document.getElementById(listId!)?.getAttribute("role")).toBe(
            "listbox",
        );
    });

    test("§7.1 the button renders the globe glyph, hidden from assistive tech", () => {
        render(<LocaleSelect label="Language" locales={LOCALES} />);
        const icon = document.querySelector(".locale-select-icon") as HTMLElement;
        // U+1F310 GLOBE WITH MERIDIANS + U+FE0E VARIATION SELECTOR-15.
        // VS15 forces text presentation so the globe renders monochrome
        // and matches theme-select's ◑ rather than the blue emoji.
        expect(icon.textContent).toBe("\u{1F310}\uFE0E");
        expect(icon.getAttribute("aria-hidden")).toBe("true");
    });

    test("§7.1 the root is a div carrying the class hook", () => {
        const { container } = render(
            <LocaleSelect label="Language" locales={LOCALES} className="mine" />,
        );
        const root = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("DIV");
        expect(root.className).toBe("locale-select mine");
    });

    test("§7.2 aria-label names the button and the listbox", () => {
        render(<LocaleSelect label="Choose language" locales={LOCALES} />);
        expect(
            screen.getByRole("button", { name: "Choose language" }),
        ).toBeTruthy();
        expect(getList().getAttribute("aria-label")).toBe("Choose language");
    });

    test("§7.3 one option per locale; the hidden input carries the supplied name", async () => {
        render(<LocaleSelect label="Language" locales={LOCALES} name="lang" />);
        await flush();
        const options = document.querySelectorAll(".locale-select-option");
        expect(options.length).toBe(LOCALES.length);
        const hidden = document.querySelector(
            'input[type="hidden"]',
        ) as HTMLInputElement;
        expect(hidden.name).toBe("lang");
        expect(hidden.value).toBe("en");
    });

    test("§7.4 the listbox is hidden until the button is activated", () => {
        render(<LocaleSelect label="Language" locales={LOCALES} />);
        expect(getList().hasAttribute("hidden")).toBe(true);
        fireEvent.click(screen.getByRole("button"));
        expect(getList().hasAttribute("hidden")).toBe(false);
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe(
            "true",
        );
    });

    test("§7.4 the active locale is the aria-selected option", async () => {
        render(<LocaleSelect label="Language" locales={LOCALES} />);
        await flush();
        fireEvent.click(screen.getByRole("button"));
        const selected = document.querySelectorAll(
            '[role="option"][aria-selected="true"]',
        );
        expect(selected.length).toBe(1);
        expect(selected[0].getAttribute("lang")).toBe("en");
    });

    test("§7.5 each option carries lang in BCP 47 hyphen form", () => {
        render(
            <LocaleSelect
                label="Language"
                locales={["en", "en_US", "zh_Hant_TW"]}
            />,
        );
        const opts = document.querySelectorAll<HTMLElement>(
            ".locale-select-option",
        );
        expect(opts[0].getAttribute("lang")).toBe("en");
        expect(opts[1].getAttribute("lang")).toBe("en-US");
        expect(opts[2].getAttribute("lang")).toBe("zh-Hant-TW");
    });

    test("§7.5 the button and the list carry no lang of their own", () => {
        render(<LocaleSelect label="Language" locales={LOCALES} />);
        expect(screen.getByRole("button").hasAttribute("lang")).toBe(false);
        expect(getList().hasAttribute("lang")).toBe(false);
    });

    test("§7.6 visible option text uses localeLabels override when supplied", () => {
        render(
            <LocaleSelect
                label="Language"
                locales={["en", "fr"]}
                localeLabels={{ en: "English", fr: "Français" }}
            />,
        );
        expect(screen.getByText("English")).toBeTruthy();
        expect(screen.getByText("Français")).toBeTruthy();
    });

    test("§7.6 falls back to defaultLocaleLabels when localeLabels missing", () => {
        render(<LocaleSelect label="Language" locales={["en_US"]} />);
        expect(screen.getByText("English (United States)")).toBeTruthy();
    });
});

describe("LocaleSelect — keyboard contract (APG listbox, §7.6)", () => {
    function openWith(key: string) {
        render(<LocaleSelect label="Language" locales={LOCALES} />);
        const button = screen.getByRole("button");
        fireEvent.keyDown(button, { key });
        return { button, list: getList() };
    }

    test("§7.24 ArrowDown, Enter and Space all open the listbox", () => {
        for (const key of ["ArrowDown", "Enter", " "]) {
            const { list } = openWith(key);
            expect(list.hasAttribute("hidden")).toBe(false);
            cleanup();
        }
    });

    test("§7.24 ArrowUp opens with the last option active", () => {
        const { list } = openWith("ArrowUp");
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[LOCALES.length - 1].id,
        );
    });

    test("§7.24 opening moves focus to the listbox", () => {
        const { list } = openWith("ArrowDown");
        expect(document.activeElement).toBe(list);
    });

    test("§7.25 opening puts the active descendant on the selected locale", () => {
        const { list } = openWith("ArrowDown");
        // "en" resolves as the initial locale, so it is index 0.
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[0].id,
        );
    });

    test("§7.25 ArrowDown / ArrowUp move the active descendant and clamp", () => {
        const { list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "ArrowDown" });
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[1].id,
        );
        fireEvent.keyDown(list, { key: "ArrowUp" });
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[0].id,
        );
        // Clamps at the top rather than wrapping.
        fireEvent.keyDown(list, { key: "ArrowUp" });
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[0].id,
        );
    });

    test("§7.25 ArrowDown clamps at the last option", () => {
        const { list } = openWith("ArrowDown");
        for (let n = 0; n < LOCALES.length + 3; n++) {
            fireEvent.keyDown(list, { key: "ArrowDown" });
        }
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[LOCALES.length - 1].id,
        );
    });

    test("§7.25 the active option is marked with data-active", () => {
        const { list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "ArrowDown" });
        const active = document.querySelectorAll("[data-active]");
        expect(active.length).toBe(1);
        expect(active[0].id).toBe(list.children[1].id);
    });

    test("§7.25 Home and End jump to the first and last option", () => {
        const { list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "End" });
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[LOCALES.length - 1].id,
        );
        fireEvent.keyDown(list, { key: "Home" });
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[0].id,
        );
    });

    test("§7.26 Enter selects the active option, applies it, and closes", async () => {
        const { button, list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "ArrowDown" });
        fireEvent.keyDown(list, { key: "Enter" });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(document.documentElement.getAttribute("lang")).toBe("en-US");
    });

    test("§7.26 Enter returns focus to the button", async () => {
        const { button, list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "ArrowDown" });
        fireEvent.keyDown(list, { key: "Enter" });
        await flush();
        expect(document.activeElement).toBe(button);
    });

    test("§7.26 Space selects the active option and closes", async () => {
        const { list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "End" });
        fireEvent.keyDown(list, { key: " " });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.getAttribute("lang")).toBe("ar");
    });

    test("§7.26 Escape closes without changing the locale", async () => {
        const { button, list } = openWith("ArrowDown");
        await flush();
        fireEvent.keyDown(list, { key: "ArrowDown" });
        fireEvent.keyDown(list, { key: "Escape" });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.getAttribute("lang")).toBe("en");
        expect(document.activeElement).toBe(button);
    });

    test("§7.26 Tab closes the listbox without stealing focus back", async () => {
        const { button, list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "Tab" });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(document.activeElement).not.toBe(button);
    });

    test("§7.27 typeahead moves the active descendant by label prefix", () => {
        const { list } = openWith("ArrowDown");
        fireEvent.keyDown(list, { key: "F" });
        // "French" is index 2 in LOCALES.
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[2].id,
        );
    });

    test("§7.27 the typeahead buffer resets after the idle window", () => {
        vi.useFakeTimers();
        try {
            render(<LocaleSelect label="Language" locales={LOCALES} />);
            const list = getList();
            fireEvent.keyDown(screen.getByRole("button"), { key: "ArrowDown" });
            fireEvent.keyDown(list, { key: "a" });
            // "Arabic" is index 4.
            expect(list.getAttribute("aria-activedescendant")).toBe(
                list.children[4].id,
            );
            vi.advanceTimersByTime(600);
            fireEvent.keyDown(list, { key: "f" });
            // Buffer cleared: a fresh "f" search from index 4 wraps to "French".
            expect(list.getAttribute("aria-activedescendant")).toBe(
                list.children[2].id,
            );
        } finally {
            vi.useRealTimers();
        }
    });

    test("§7.27 clicking an option selects and applies it", async () => {
        render(<LocaleSelect label="Language" locales={LOCALES} />);
        await flush();
        pick("ar");
        await flush();
        expect(document.documentElement.getAttribute("lang")).toBe("ar");
        expect(document.documentElement.getAttribute("dir")).toBe("rtl");
        expect(getList().hasAttribute("hidden")).toBe(true);
    });

    test("§7.27 clicking outside closes the listbox without changing the locale", async () => {
        render(<LocaleSelect label="Language" locales={LOCALES} />);
        await flush();
        fireEvent.click(screen.getByRole("button"));
        expect(getList().hasAttribute("hidden")).toBe(false);
        fireEvent.click(document.body);
        await flush();
        expect(getList().hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.getAttribute("lang")).toBe("en");
    });

    test("§7.27 clicking the button again closes the listbox", () => {
        render(<LocaleSelect label="Language" locales={LOCALES} />);
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(getList().hasAttribute("hidden")).toBe(false);
        fireEvent.click(button);
        expect(getList().hasAttribute("hidden")).toBe(true);
    });
});

describe("LocaleSelect — locale application (§5.5, §7.3)", () => {
    test("§7.13 sets target.lang to the BCP 47 form of the resolved initial locale", async () => {
        render(
            <LocaleSelect
                label="Language"
                locales={LOCALES}
                defaultValue="en_US"
            />,
        );
        await flush();
        expect(document.documentElement.lang).toBe("en-US");
    });

    test("§7.14 sets dir=rtl for an RTL initial locale", async () => {
        render(
            <LocaleSelect
                label="Language"
                locales={["ar", "en"]}
                defaultValue="ar"
            />,
        );
        await flush();
        expect(document.documentElement.dir).toBe("rtl");
    });

    test("§7.14 sets dir=ltr for an LTR initial locale", async () => {
        render(
            <LocaleSelect
                label="Language"
                locales={["en", "ar"]}
                defaultValue="en"
            />,
        );
        await flush();
        expect(document.documentElement.dir).toBe("ltr");
    });

    test("§7.15 when applyDir=false, dir is never written", async () => {
        render(
            <LocaleSelect
                label="Language"
                locales={["ar", "en"]}
                defaultValue="ar"
                applyDir={false}
            />,
        );
        await flush();
        expect(document.documentElement.hasAttribute("dir")).toBe(false);
        expect(document.documentElement.lang).toBe("ar");
    });

    test("§7.16 selecting a different option updates lang, dir, and fires onChange", async () => {
        const onChange = vi.fn();
        render(
            <LocaleSelect
                label="Language"
                locales={LOCALES}
                defaultValue="en"
                onChange={onChange}
            />,
        );
        await flush();
        pick("ar");
        await flush();
        expect(document.documentElement.lang).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
        expect(onChange).toHaveBeenCalledWith("ar");
    });

    test("§7.16 onChange receives the consumer-form code (not BCP 47)", async () => {
        const onChange = vi.fn();
        render(
            <LocaleSelect
                label="Language"
                locales={LOCALES}
                defaultValue="en"
                onChange={onChange}
            />,
        );
        await flush();
        pick("en_US");
        await flush();
        expect(onChange).toHaveBeenLastCalledWith("en_US");
        expect(document.documentElement.lang).toBe("en-US");
    });

    test("§7.17 a custom target receives lang and dir", async () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        render(
            <LocaleSelect
                label="Language"
                locales={["ar", "en"]}
                defaultValue="ar"
                target={target}
            />,
        );
        await flush();
        expect(target.getAttribute("lang")).toBe("ar");
        expect(target.getAttribute("dir")).toBe("rtl");
        // Document root must remain untouched.
        expect(document.documentElement.hasAttribute("lang")).toBe(false);
        expect(document.documentElement.hasAttribute("dir")).toBe(false);
        target.remove();
    });
});

describe("LocaleSelect — initial-value resolution (§5.2, §5.3, §7.4)", () => {
    test("§7.18 persists to localStorage and reads back on a fresh mount", async () => {
        const { unmount } = render(
            <LocaleSelect
                label="Language"
                locales={LOCALES}
                storageKey="lily-locale"
            />,
        );
        await flush();
        pick("fr");
        await flush();
        expect(localStorage.getItem("lily-locale")).toBe("fr");
        unmount();
        resetRoot();

        render(
            <LocaleSelect
                label="Language"
                locales={LOCALES}
                storageKey="lily-locale"
            />,
        );
        await flush();
        expect(document.documentElement.lang).toBe("fr");
    });

    test("§7.19 a supplied non-empty value prop wins over storage and defaults", async () => {
        localStorage.setItem("lily-locale", "ar");
        render(
            <LocaleSelect
                label="Language"
                locales={LOCALES}
                value="en"
                storageKey="lily-locale"
                defaultValue="fr"
            />,
        );
        await flush();
        expect(document.documentElement.lang).toBe("en");
    });

    test("§7.20 navigator detection resolves exact match", async () => {
        const original = Object.getOwnPropertyDescriptor(
            window.navigator,
            "languages",
        );
        Object.defineProperty(window.navigator, "languages", {
            configurable: true,
            get: () => ["fr-CA", "fr"],
        });
        render(
            <LocaleSelect
                label="Language"
                locales={["en", "fr_CA", "fr"]}
                detectFromNavigator
            />,
        );
        await flush();
        expect(document.documentElement.lang).toBe("fr-CA");
        if (original)
            Object.defineProperty(window.navigator, "languages", original);
    });

    test("§7.21 navigator detection falls back to language-only match", async () => {
        const original = Object.getOwnPropertyDescriptor(
            window.navigator,
            "languages",
        );
        Object.defineProperty(window.navigator, "languages", {
            configurable: true,
            get: () => ["fr-CA"],
        });
        render(
            <LocaleSelect
                label="Language"
                locales={["en", "fr"]}
                detectFromNavigator
            />,
        );
        await flush();
        expect(document.documentElement.lang).toBe("fr");
        if (original)
            Object.defineProperty(window.navigator, "languages", original);
    });
});

describe("LocaleSelect — spread + custom children (§4.1, §7.5)", () => {
    test("§7.22 extra attributes spread onto the root div", () => {
        render(
            <LocaleSelect label="Language" locales={LOCALES} data-testid="lp" />,
        );
        const root = screen.getByTestId("lp");
        expect(root.tagName).toBe("DIV");
        expect(root.className).toContain("locale-select");
    });

    test("§7.23 children replace the button glyph and receive ChildArgs", async () => {
        render(
            <LocaleSelect label="Language" locales={LOCALES} value="fr">
                {(args: ChildArgs) => (
                    <span
                        data-testid="custom"
                        data-open={String(args.open)}
                        data-value={args.value}
                        data-label-en-us={args.labelFor("en_US")}
                    >
                        custom glyph
                    </span>
                )}
            </LocaleSelect>,
        );
        await flush();
        const node = screen.getByTestId("custom");
        // The custom glyph replaces the default globe inside the button.
        expect(node.closest("button")?.className).toContain(
            "locale-select-button",
        );
        expect(document.querySelector(".locale-select-icon")).toBeNull();
        expect(node.getAttribute("data-open")).toBe("false");
        expect(node.getAttribute("data-value")).toBe("fr");
        expect(node.getAttribute("data-label-en-us")).toBe(
            "English (United States)",
        );
    });

    test("§7.23 children see open=true once the listbox is expanded", () => {
        render(
            <LocaleSelect label="Language" locales={LOCALES} value="fr">
                {(args: ChildArgs) => (
                    <span data-testid="custom" data-open={String(args.open)}>
                        glyph
                    </span>
                )}
            </LocaleSelect>,
        );
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByTestId("custom").getAttribute("data-open")).toBe(
            "true",
        );
    });
});
