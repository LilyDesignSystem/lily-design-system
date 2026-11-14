import { afterEach, describe, expect, test, vi } from "vitest";

import { AllergyRecordListItem } from "./allergy-record-list-item.js";

if (!customElements.get("lily-allergy-record-list-item"))
    customElements.define("lily-allergy-record-list-item", AllergyRecordListItem);

afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body;
}

describe("AllergyRecordListItem", () => {
    test("replaces itself with an li holding each part", () => {
        const body = render(
            `<ul><lily-allergy-record-list-item substance="Penicillin" reaction="Anaphylaxis" severity="severe" severity-label="Severe" updated="2026-11-03" updated-label="Updated 3 Nov 2026"></lily-allergy-record-list-item></ul>`,
        );
        const li = body.querySelector("ul > li.allergy-record-list-item") as HTMLElement;
        expect(body.querySelector("lily-allergy-record-list-item")).toBeNull();
        expect(li.getAttribute("data-severity")).toBe("severe");
        expect(li.querySelector(".allergy-record-list-item-substance")?.textContent).toBe("Penicillin");
        expect(li.querySelector(".allergy-record-list-item-reaction")?.textContent).toBe("Anaphylaxis");
        expect(li.querySelector(".allergy-record-list-item-severity")?.textContent).toBe("Severe");
        expect(li.querySelector("time.allergy-record-list-item-updated")?.getAttribute("datetime")).toBe(
            "2026-11-03",
        );
    });
});
