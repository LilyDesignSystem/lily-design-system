import { afterEach, describe, expect, test } from "vitest";

import { RecordProvenanceView } from "./record-provenance-view.js";

if (!customElements.get("lily-record-provenance-view"))
    customElements.define("lily-record-provenance-view", RecordProvenanceView);

afterEach(() => {
    document.body.innerHTML = "";
});

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const R = (props: Record<string, unknown>) => {
    const attrs = Object.entries(props)
        .map(([k, v]) => `${kebab(k)}="${String(v)}"`)
        .join(" ");
    document.body.innerHTML = `<lily-record-provenance-view ${attrs}></lily-record-provenance-view>`;
    return document.querySelector("span.record-provenance-view") as HTMLElement;
};

describe("RecordProvenanceView", () => {
    test("renders a span with each part in the consumer's words, states first", () => {
        const root = R({
            attestation: "pending",
            attestationLabel: "Awaiting signature",
            sync: "pending",
            syncLabel: "Saved on this device, not yet sent",
            source: "device",
            sourceLabel: "From a blood pressure monitor",
            authorLabel: "Dr A Patel",
            observed: "2026-11-03T08:10",
            observedLabel: "Measured 08:10",
            recorded: "2026-11-03T09:00",
            recordedLabel: "Recorded 09:00",
            versionLabel: "Version 2",
        });
        expect(root.tagName).toBe("SPAN");
        expect(root.className).toContain("record-provenance-view");
        expect(root.getAttribute("data-attestation")).toBe("pending");
        expect(root.getAttribute("data-sync")).toBe("pending");
        expect(root.getAttribute("data-source")).toBe("device");
        const parts = [...root.children].map((el) =>
            el.className.replace("record-provenance-view-", ""),
        );
        expect(parts).toEqual([
            "attestation",
            "sync",
            "source",
            "author",
            "observed",
            "recorded",
            "version",
        ]);
        expect(
            root.querySelector(".record-provenance-view-observed")?.getAttribute("datetime"),
        ).toBe("2026-11-03T08:10");
        expect(
            root.querySelector(".record-provenance-view-recorded")?.getAttribute("datetime"),
        ).toBe("2026-11-03T09:00");
    });

    test("an unsigned record shows its own words and state, never a signed one", () => {
        const root = R({ attestation: "unsigned", attestationLabel: "Not signed" });
        expect(root.getAttribute("data-attestation")).toBe("unsigned");
        expect(root.querySelector(".record-provenance-view-attestation")?.textContent).toBe(
            "Not signed",
        );
    });

    test("renders no part and no data attribute it was not given", () => {
        const root = R({ authorLabel: "Dr A Patel" });
        expect(root.hasAttribute("data-attestation")).toBe(false);
        expect(root.hasAttribute("data-sync")).toBe(false);
        expect(root.children).toHaveLength(1);
    });

    test("shows a change to its attributes after it is mounted (P50-T28)", async () => {
        document.body.innerHTML = `<lily-record-provenance-view sync="current" sync-label="Up to date"></lily-record-provenance-view>`;
        const el = document.querySelector("lily-record-provenance-view")!;
        const span = el.querySelector("span.record-provenance-view")!;
        el.setAttribute("sync", "stale");
        el.setAttribute("sync-label", "Out of date");
        el.setAttribute("author-label", "Dr Okoro");
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(el.querySelector("span.record-provenance-view")).toBe(span);
        expect(span.getAttribute("data-sync")).toBe("stale");
        expect(span.querySelector(".record-provenance-view-sync")!.textContent).toBe("Out of date");
        expect(span.querySelector(".record-provenance-view-author")!.textContent).toBe("Dr Okoro");
        el.removeAttribute("sync");
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(span.hasAttribute("data-sync")).toBe(false);
    });
});
