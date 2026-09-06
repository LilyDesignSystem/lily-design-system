import { afterEach, describe, expect, test } from "vitest";

import { Pictogram } from "./pictogram.js";

if (!customElements.get("lily-pictogram")) {
    customElements.define("lily-pictogram", Pictogram);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Pictogram", () => {
    test("renders a figure with the base class and data-layout defaulting to centered", () => {
        const host = render('<lily-pictogram heading="Privacy"><span slot="icon">&#128274;</span></lily-pictogram>');

        const figure = host.querySelector("figure")!;
        expect(figure.className).toBe("pictogram");
        expect(figure.getAttribute("data-layout")).toBe("centered");
    });

    test("honours an explicit layout", () => {
        const host = render('<lily-pictogram layout="side" heading="Privacy"><span slot="icon">lock</span></lily-pictogram>');

        expect(host.querySelector("figure")!.getAttribute("data-layout")).toBe("side");
    });

    test("moves the icon slot into an aria-hidden pictogram-icon div", () => {
        const host = render('<lily-pictogram heading="Privacy"><span slot="icon">lock-icon</span></lily-pictogram>');

        const iconDiv = host.querySelector(".pictogram-icon")!;
        expect(iconDiv.getAttribute("aria-hidden")).toBe("true");
        expect(iconDiv.textContent).toBe("lock-icon");
    });

    test("renders heading and description inside the figcaption", () => {
        const host = render(
            '<lily-pictogram heading="Privacy" description="Your data stays on your device."><span slot="icon">lock</span></lily-pictogram>',
        );

        const figcaption = host.querySelector("figcaption.pictogram-caption")!;
        expect(figcaption.querySelector("h3.pictogram-heading")!.textContent).toBe("Privacy");
        expect(figcaption.querySelector("p.pictogram-description")!.textContent).toBe("Your data stays on your device.");
    });

    test("additional children override the description", () => {
        const host = render(
            '<lily-pictogram heading="Privacy" description="Ignored"><span slot="icon">lock</span><p>Custom body.</p></lily-pictogram>',
        );

        const figcaption = host.querySelector("figcaption.pictogram-caption")!;
        expect(figcaption.querySelector(".pictogram-description")).toBeNull();
        expect(figcaption.textContent).toContain("Custom body.");
    });

    test("sets aria-label from the label prop when provided", () => {
        const host = render('<lily-pictogram label="Privacy pictogram"><span slot="icon">lock</span></lily-pictogram>');

        expect(host.querySelector("figure")!.getAttribute("aria-label")).toBe("Privacy pictogram");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-pictogram heading="Privacy"><span slot="icon">lock</span></lily-pictogram>');

        (host as unknown as Pictogram).connectedCallback();

        expect(host.querySelectorAll("figure").length).toBe(1);
    });
});
