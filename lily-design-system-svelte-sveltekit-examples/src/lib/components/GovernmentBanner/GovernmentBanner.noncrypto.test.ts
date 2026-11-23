import { render } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import Subject from "./GovernmentBanner.svelte";

describe("GovernmentBanner ids without crypto.randomUUID", () => {
    afterEach(() => vi.unstubAllGlobals());

    test("its expand button still points at a panel id", () => {
        vi.stubGlobal("crypto", {});
        const { container } = render(Subject, {
            props: {
                label: "Official government website",
                headerText: "An official website",
                expandLabel: "Here's how you know",
            },
        });
        const button = container.querySelector("button") as HTMLElement;
        expect(button.getAttribute("aria-controls")).toMatch(/^government-banner-panel-/);
    });
});
