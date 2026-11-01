import { afterEach, describe, expect, test, vi } from "vitest";

import { Popup } from "./popup.js";

if (!customElements.get("lily-popup")) {
    customElements.define("lily-popup", Popup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Popup", () => {
    test("carries the base class", () => {
        const host = render('<lily-popup label="Confirmation"></lily-popup>');

        expect(host.classList.contains("popup")).toBe(true);
    });

    test("has role=dialog", () => {
        const host = render('<lily-popup label="Confirmation"></lily-popup>');

        expect(host.getAttribute("role")).toBe("dialog");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-popup label="Confirmation"></lily-popup>');

        expect(host.getAttribute("aria-label")).toBe("Confirmation");
    });

    test("is hidden when open is absent", () => {
        const host = render('<lily-popup label="Confirmation"></lily-popup>');

        expect(host.hidden).toBe(true);
    });

    test("is visible when open is present", () => {
        const host = render('<lily-popup label="Confirmation" open></lily-popup>');

        expect(host.hidden).toBe(false);
    });

    test("toggling the open attribute externally updates visibility", () => {
        const host = render('<lily-popup label="Confirmation"></lily-popup>');

        host.toggleAttribute("open", true);
        expect(host.hidden).toBe(false);

        host.toggleAttribute("open", false);
        expect(host.hidden).toBe(true);
    });

    test("keeps consumer content in place", () => {
        const host = render(
            '<lily-popup label="Confirmation" open><p>Are you sure?</p></lily-popup>',
        );

        expect(host.querySelector("p")?.textContent).toBe("Are you sure?");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render('<lily-popup label="Confirmation" class="my-popup"></lily-popup>');

        expect(host.getAttribute("class")).toBe("popup my-popup");
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
            const host = render('<lily-popup id="info" label="More information" open></lily-popup>');

            expect(host.getAttribute("popover")).toBe("auto");
            expect(host.hidden).toBe(false);
            expect(show).toHaveBeenCalled();
            host.toggleAttribute("open", false);
            expect(hide).toHaveBeenCalled();
        });

        test("the toggle event (light dismiss, a commandfor trigger) writes open back", () => {
            stub();
            const host = render('<lily-popup label="More information" open></lily-popup>');
            const event = new Event("toggle");
            Object.assign(event, { newState: "closed", oldState: "open" });
            host.dispatchEvent(event);

            expect(host.hasAttribute("open")).toBe(false);
        });
    });
});
