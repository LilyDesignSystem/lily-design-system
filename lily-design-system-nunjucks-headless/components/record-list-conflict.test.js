// A record list never says "none known" beside an entry (HC-C17, tasks.md P50-T2), in all seven lists.
import { describe, expect, test } from "vitest";
import { render } from "../test/render.js";

const conflictLabel = "The record also says none are known. Check the source.";
const NONE = { status: "none-known", statusLabel: "No known allergies" };

describe.each([
    "record-list",
    "allergy-record-list",
    "medication-record-list",
    "problem-record-list",
    "immunization-record-list",
    "procedure-record-list",
    "device-record-list",
])("%s", (base) => {
    const show = (params) => render(base, params).document.querySelector(`ul.${base}`);
    const status = (ul) => ul.querySelector(`.${base}-status`)?.textContent;

    test("HC-C17: none known beside an entry shows the entry and the conflict, never none known", () => {
        const ul = show({ ...NONE, conflictLabel, html: '<li class="x">Penicillin</li>' });
        expect(ul.textContent).toContain("Penicillin");
        expect(status(ul)).toBe(conflictLabel);
        expect(ul.getAttribute("aria-label")).toBe(conflictLabel);
        expect(ul.getAttribute("data-status")).toBe("conflict");
        expect(ul.outerHTML).not.toContain("No known");
    });

    test.each([undefined, "", "   ", " "])(
        "HC-C17: with no words for it (%j), none known goes and the entry stays",
        (words) => {
            const ul = show({ ...NONE, conflictLabel: words, html: "<li>Penicillin</li>" });
            expect(ul.textContent).toContain("Penicillin");
            expect(ul.outerHTML).not.toContain("No known");
            expect(ul.hasAttribute("aria-label")).toBe(false);
        },
    );

    test.each([
        undefined,
        "",
        "\n  ",
        '<li data-verification-status="refuted">Latex</li>',
        '<li class="x" data-entry-state="entered-in-error">Latex</li>',
        '<li data-status="entered-in-error">Latex</li>',
    ])("no entry, or only a withdrawn one (%j), is none known as before", (html) => {
        const ul = show({ ...NONE, conflictLabel, html });
        expect(status(ul)).toBe("No known allergies");
        expect(ul.getAttribute("data-status")).toBe("none-known");
    });

    test("HC-C17: entries given with call are entries too", () => {
        const { document } = render(base, { ...NONE, conflictLabel }, "<li>Penicillin</li>");
        const ul = document.querySelector(`ul.${base}`);
        expect(ul.textContent).toContain("Penicillin");
        expect(ul.outerHTML).not.toContain("No known");
        const empty = render(
            base,
            { ...NONE, conflictLabel },
            "{% for x in [] %}<li></li>{% endfor %}",
        );
        expect(status(empty.document.querySelector(`ul.${base}`))).toBe("No known allergies");
    });

    test("HC-C17: a withdrawn entry does not hide another", () => {
        const html = '<li data-verification-status="refuted">Latex</li><li>Penicillin</li>';
        expect(status(show({ ...NONE, conflictLabel, html }))).toBe(conflictLabel);
    });

    test("a label that repeats the status goes with it; another stays; other statuses do not change", () => {
        const html = "<li>Penicillin</li>";
        expect(
            show({ ...NONE, conflictLabel, label: NONE.statusLabel, html }).getAttribute(
                "aria-label",
            ),
        ).toBe(conflictLabel);
        expect(
            show({ ...NONE, conflictLabel, label: "Allergies", html }).getAttribute("aria-label"),
        ).toBe("Allergies");
        const unavailable = show({
            status: "unavailable",
            statusLabel: "Unavailable",
            conflictLabel,
            html,
        });
        expect(status(unavailable)).toBe("Unavailable");
        expect(unavailable.getAttribute("data-status")).toBe("unavailable");
    });
});
