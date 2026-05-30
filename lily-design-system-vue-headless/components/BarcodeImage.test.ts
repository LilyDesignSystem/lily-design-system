import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./BarcodeImage.vue";

describe("BarcodeImage", () => {
    test("renders an img element with class barcode-image", () => {
        const { container } = render(Subject, { props: { src: "/code.png", alt: "Order 12345" } });
        const root = container.querySelector(".barcode-image");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("IMG");
    });

    test("has the supplied src", () => {
        render(Subject, { props: { src: "/abc.svg", alt: "Code" } });
        expect(screen.getByRole("img").getAttribute("src")).toBe("/abc.svg");
    });

    test("uses alt as the accessible name", () => {
        render(Subject, { props: { src: "/x.png", alt: "Item 42" } });
        expect(screen.getByRole("img", { name: "Item 42" })).toBeTruthy();
    });

    test("applies loading attribute when provided", () => {
        render(Subject, { props: { src: "/x.png", alt: "Code", loading: "lazy" } });
        expect(screen.getByRole("img").getAttribute("loading")).toBe("lazy");
    });

    test("passes through additional attributes", () => {
        render(Subject, { props: { src: "/x.png", alt: "Code", "data-testid": "bc" } });
        expect(screen.getByTestId("bc")).toBeTruthy();
    });
});
