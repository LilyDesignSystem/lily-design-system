import { afterEach, describe, expect, test, vi } from "vitest";

import { AllergyListItem } from "./allergy-list-item.js";

if (!customElements.get("lily-allergy-list-item"))
    customElements.define("lily-allergy-list-item", AllergyListItem);

afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body;
}

describe("AllergyListItem", () => {
    test("replaces itself with an li holding each part", () => {
        const body = render(
            `<ul><lily-allergy-list-item substance="Penicillin" reaction="Anaphylaxis" severity="severe" severity-label="Severe" updated="2026-11-03" updated-label="Updated 3 Nov 2026"></lily-allergy-list-item></ul>`,
        );
        const li = body.querySelector("ul > li.allergy-list-item") as HTMLElement;
        expect(body.querySelector("lily-allergy-list-item")).toBeNull();
        expect(li.getAttribute("data-severity")).toBe("severe");
        expect(li.querySelector(".allergy-list-item-substance")?.textContent).toBe("Penicillin");
        expect(li.querySelector(".allergy-list-item-reaction")?.textContent).toBe("Anaphylaxis");
        expect(li.querySelector(".allergy-list-item-severity")?.textContent).toBe("Severe");
        expect(li.querySelector("time.allergy-list-item-updated")?.getAttribute("datetime")).toBe(
            "2026-11-03",
        );
    });
});
