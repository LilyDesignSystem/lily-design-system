import { afterEach, describe, expect, test } from "vitest";

import { FeatureCard } from "./feature-card.js";

if (!customElements.get("lily-feature-card")) {
    customElements.define("lily-feature-card", FeatureCard);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FeatureCard", () => {
    test("renders a native article with the heading in a header h3", () => {
        const host = render('<lily-feature-card heading="Privacy first"></lily-feature-card>');

        const article = host.querySelector("article.feature-card")!;
        expect(article).toBeTruthy();
        expect(article.querySelector("header > h3.feature-card-heading")!.textContent).toBe("Privacy first");
    });

    test("defaults data-image-position to start", () => {
        const host = render('<lily-feature-card heading="Privacy first"></lily-feature-card>');

        expect(host.querySelector("article")!.getAttribute("data-image-position")).toBe("start");
    });

    test("data-image-position reflects the image-position attribute", () => {
        const host = render('<lily-feature-card heading="Privacy first" image-position="end"></lily-feature-card>');

        expect(host.querySelector("article")!.getAttribute("data-image-position")).toBe("end");
    });

    test("aria-label defaults to heading, overridden by label", () => {
        const host = render('<lily-feature-card heading="Privacy first"></lily-feature-card>');
        expect(host.querySelector("article")!.getAttribute("aria-label")).toBe("Privacy first");

        const host2 = render('<lily-feature-card heading="Privacy first" label="Custom name"></lily-feature-card>');
        expect(host2.querySelector("article")!.getAttribute("aria-label")).toBe("Custom name");
    });

    test("renders an image only when image-url is provided", () => {
        const host = render('<lily-feature-card heading="Privacy first"></lily-feature-card>');
        expect(host.querySelector(".feature-card-image")).toBeNull();

        const host2 = render(
            '<lily-feature-card heading="Privacy first" image-url="/img.png" image-alt="Alt text"></lily-feature-card>',
        );
        const img = host2.querySelector(".feature-card-image") as HTMLImageElement;
        expect(img).toBeTruthy();
        expect(img.alt).toBe("Alt text");
    });

    test("renders a description only when provided", () => {
        const host = render('<lily-feature-card heading="Privacy first" description="Your data stays yours."></lily-feature-card>');

        expect(host.querySelector(".feature-card-description")!.textContent).toBe("Your data stays yours.");
    });

    test("children render after the description", () => {
        const host = render(
            '<lily-feature-card heading="Privacy first" description="Body"><button id="cta"></button></lily-feature-card>',
        );

        const article = host.querySelector("article")!;
        const lastChild = article.children[article.children.length - 1];
        expect(lastChild.id).toBe("cta");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-feature-card heading="Privacy first" class="extra"></lily-feature-card>');

        expect(host.querySelector("article")!.className).toBe("feature-card extra");
    });
});
