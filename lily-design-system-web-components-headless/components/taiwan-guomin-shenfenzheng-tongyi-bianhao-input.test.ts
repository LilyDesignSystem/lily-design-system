import { afterEach, describe, expect, test } from "vitest";

import { TaiwanGuominShenfenzhengTongyiBianhaoInput } from "./taiwan-guomin-shenfenzheng-tongyi-bianhao-input.js";

if (!customElements.get("lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-input")) {
    customElements.define(
        "lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-input",
        TaiwanGuominShenfenzhengTongyiBianhaoInput,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TaiwanGuominShenfenzhengTongyiBianhaoInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-input label="National Identification Card Number"></lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("taiwan-guomin-shenfenzheng-tongyi-bianhao-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-input label="National Identification Card Number" autocomplete="on"></lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-input label="National Identification Card Number" value="A123456789"></lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-input>',
        ) as unknown as TaiwanGuominShenfenzhengTongyiBianhaoInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("A123456789");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-input label="National Identification Card Number" required disabled></lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-input label="National Identification Card Number"></lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "National Identification Card Number",
        );
    });
});
