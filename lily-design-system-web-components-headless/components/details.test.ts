import { afterEach, describe, expect, test } from "vitest";

import { Details } from "./details.js";

if (!customElements.get("lily-details")) {
    customElements.define("lily-details", Details);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Details", () => {
    test("renders a native details element, closed by default", () => {
        const host = render('<lily-details summary="More information"></lily-details>');

        const details = host.querySelector("details") as HTMLDetailsElement;
        expect(details).toBeTruthy();
        expect(details.open).toBe(false);
    });

    test("renders the summary text in a native summary element", () => {
        const host = render('<lily-details summary="More information"></lily-details>');

        expect(host.querySelector("details > summary")!.textContent).toBe("More information");
    });

    test("open attribute opens the details", () => {
        const host = render('<lily-details summary="More information" open></lily-details>');

        expect((host.querySelector("details") as HTMLDetailsElement).open).toBe(true);
    });

    test("toggling the open attribute externally updates the rendered details", () => {
        const host = render('<lily-details summary="More information"></lily-details>');

        host.toggleAttribute("open", true);

        expect((host.querySelector("details") as HTMLDetailsElement).open).toBe(true);
    });

    test("a native toggle reflects back onto the host's open attribute", () => {
        const host = render('<lily-details summary="More information"></lily-details>');
        const details = host.querySelector("details") as HTMLDetailsElement;

        details.open = true;
        details.dispatchEvent(new Event("toggle"));

        expect(host.hasAttribute("open")).toBe(true);
    });

    test("moves its children into the details, after the summary", () => {
        const host = render(
            '<lily-details summary="More information"><p id="body"></p></lily-details>',
        );

        const details = host.querySelector("details") as HTMLDetailsElement;
        expect(details.children[0]!.tagName).toBe("SUMMARY");
        expect(details.querySelector("#body")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render(
            '<lily-details summary="More information" class="extra"></lily-details>',
        );

        expect(host.querySelector("details")!.className).toBe("details extra");
    });

    describe("print (P42-T9)", () => {
        const print = (name: "beforeprint" | "afterprint") => window.dispatchEvent(new Event(name));
        const detailsOf = (host: HTMLElement) =>
            host.querySelector("details") as HTMLDetailsElement;

        test("a closed disclosure opens for print and closes again afterwards", () => {
            const host = render('<lily-details summary="Info">Content</lily-details>');
            print("beforeprint");
            expect(detailsOf(host).open).toBe(true);
            print("afterprint");
            expect(detailsOf(host).open).toBe(false);
        });

        test("one the reader had opened stays open", () => {
            const host = render('<lily-details summary="Info" open>Content</lily-details>');
            print("beforeprint");
            print("afterprint");
            expect(detailsOf(host).open).toBe(true);
        });

        test('print-open="false" leaves it closed', () => {
            const host = render(
                '<lily-details summary="Info" print-open="false">Content</lily-details>',
            );
            print("beforeprint");
            expect(detailsOf(host).open).toBe(false);
            expect(detailsOf(host).hasAttribute("print-open")).toBe(false);
        });

        test("stops listening once removed, and listens again when it is put back", () => {
            const host = render('<lily-details summary="Info">Content</lily-details>');
            const details = detailsOf(host);
            host.remove();
            print("beforeprint");
            expect(details.open).toBe(false);
            document.body.append(host);
            print("beforeprint");
            expect(details.open).toBe(true);
            print("afterprint");
            expect(details.open).toBe(false);
        });
    });
});
