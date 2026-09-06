import { afterEach, describe, expect, test } from "vitest";

import { HeroHeadline } from "./hero-headline.js";

if (!customElements.get("lily-hero-headline")) {
    customElements.define("lily-hero-headline", HeroHeadline);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("HeroHeadline", () => {
    test("renders as itself with the base class", () => {
        const host = render(
            '<lily-hero-headline label="Feature story"><img slot="media" src="hero.jpg" alt="City" /><h1>The Changing Skyline</h1></lily-hero-headline>',
        );

        expect(host.tagName.toLowerCase()).toBe("lily-hero-headline");
        expect(host.className).toBe("hero-headline");
    });

    test("has aria-label from the label attribute", () => {
        const host = render('<lily-hero-headline label="Feature story"></lily-hero-headline>');

        expect(host.getAttribute("aria-label")).toBe("Feature story");
    });

    test("moves the slot=media child into the media wrapper", () => {
        const host = render(
            '<lily-hero-headline label="Feature story"><img slot="media" src="hero.jpg" alt="City" /><h1>Title</h1></lily-hero-headline>',
        );

        const media = host.querySelector(".hero-headline-media")!;
        expect(media.querySelector("img")).not.toBeNull();
    });

    test("moves remaining content into the content wrapper", () => {
        const host = render(
            '<lily-hero-headline label="Feature story"><img slot="media" src="hero.jpg" alt="City" /><h1>The Changing Skyline</h1><p>Subtext</p></lily-hero-headline>',
        );

        const content = host.querySelector(".hero-headline-content")!;
        expect(content.querySelector("h1")!.textContent).toBe("The Changing Skyline");
        expect(content.querySelector("p")!.textContent).toBe("Subtext");
    });

    test("renders both wrappers even without media content", () => {
        const host = render('<lily-hero-headline label="Feature story"><h1>Title</h1></lily-hero-headline>');

        expect(host.querySelector(".hero-headline-media")).not.toBeNull();
        expect(host.querySelector(".hero-headline-content")!.textContent).toBe("Title");
    });

    test("appends the consumer's class hook to the base class", () => {
        const host = render('<lily-hero-headline label="Feature story" class="story-lead"></lily-hero-headline>');

        expect(host.className).toBe("hero-headline story-lead");
    });
});
