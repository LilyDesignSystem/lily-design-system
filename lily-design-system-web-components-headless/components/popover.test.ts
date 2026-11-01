import { afterEach, describe, expect, test, vi } from "vitest";

import { Popover } from "./popover.js";

if (!customElements.get("lily-popover")) {
    customElements.define("lily-popover", Popover);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Popover", () => {
    test("carries the base class", () => {
        const host = render('<lily-popover label="More information"></lily-popover>');

        expect(host.classList.contains("popover")).toBe(true);
    });

    test("has role=dialog", () => {
        const host = render('<lily-popover label="More information"></lily-popover>');

        expect(host.getAttribute("role")).toBe("dialog");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-popover label="More information"></lily-popover>');

        expect(host.getAttribute("aria-label")).toBe("More information");
    });

    test("is hidden when open is absent", () => {
        const host = render('<lily-popover label="More information"></lily-popover>');

        expect(host.hidden).toBe(true);
    });

    test("is visible when open is present", () => {
        const host = render('<lily-popover label="More information" open></lily-popover>');

        expect(host.hidden).toBe(false);
    });

    test("toggling the open attribute externally updates visibility", () => {
        const host = render('<lily-popover label="More information"></lily-popover>');

        host.toggleAttribute("open", true);
        expect(host.hidden).toBe(false);

        host.toggleAttribute("open", false);
        expect(host.hidden).toBe(true);
    });

    test("keeps consumer content in place", () => {
        const host = render(
            '<lily-popover label="More information" open><p>Content.</p></lily-popover>',
        );

        expect(host.querySelector("p")?.textContent).toBe("Content.");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render(
            '<lily-popover label="More information" class="my-popover"></lily-popover>',
        );

        expect(host.getAttribute("class")).toBe("popover my-popover");
    });

    describe("with the Popover API", () => {
        type Proto = { showPopover?: () => void; hidePopover?: () => void };
        const proto = HTMLElement.prototype as unknown as Proto;
        let show: ReturnType<typeof vi.fn>;
        let hide: ReturnType<typeof vi.fn>;
        function stub(): void {
            show = vi.fn();
            hide = vi.fn();
            proto.showPopover = show as unknown as () => void;
            proto.hidePopover = hide as unknown as () => void;
        }
        afterEach(() => {
            delete proto.showPopover;
            delete proto.hidePopover;
        });

        test("is popover=auto and opens with showPopover, not hidden", () => {
            stub();
            const host = render('<lily-popover id="info" label="More information" open></lily-popover>');

            expect(host.getAttribute("popover")).toBe("auto");
            expect(host.hidden).toBe(false);
            expect(show).toHaveBeenCalled();
            host.toggleAttribute("open", false);
            expect(hide).toHaveBeenCalled();
        });

        test("the toggle event (light dismiss, a commandfor trigger) writes open back", () => {
            stub();
            const host = render('<lily-popover label="More information" open></lily-popover>');
            const event = new Event("toggle");
            Object.assign(event, { newState: "closed", oldState: "open" });
            host.dispatchEvent(event);

            expect(host.hasAttribute("open")).toBe(false);
        });
    });
});
