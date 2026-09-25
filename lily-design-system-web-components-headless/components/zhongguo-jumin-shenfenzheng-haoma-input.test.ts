import { afterEach, describe, expect, test } from "vitest";

import { ZhongguoJuminShenfenzhengHaomaInput } from "./zhongguo-jumin-shenfenzheng-haoma-input.js";

if (!customElements.get("lily-zhongguo-jumin-shenfenzheng-haoma-input")) {
    customElements.define("lily-zhongguo-jumin-shenfenzheng-haoma-input", ZhongguoJuminShenfenzhengHaomaInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ZhongguoJuminShenfenzhengHaomaInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-zhongguo-jumin-shenfenzheng-haoma-input label="Resident Identity Card Number (居民身份证号码)"></lily-zhongguo-jumin-shenfenzheng-haoma-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("zhongguo-jumin-shenfenzheng-haoma-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-zhongguo-jumin-shenfenzheng-haoma-input label="Resident Identity Card Number (居民身份证号码)" autocomplete="on"></lily-zhongguo-jumin-shenfenzheng-haoma-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-zhongguo-jumin-shenfenzheng-haoma-input label="Resident Identity Card Number (居民身份证号码)" value="11010119800101123X"></lily-zhongguo-jumin-shenfenzheng-haoma-input>') as unknown as ZhongguoJuminShenfenzhengHaomaInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("11010119800101123X");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-zhongguo-jumin-shenfenzheng-haoma-input label="Resident Identity Card Number (居民身份证号码)" required disabled></lily-zhongguo-jumin-shenfenzheng-haoma-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-zhongguo-jumin-shenfenzheng-haoma-input label="Resident Identity Card Number (居民身份证号码)"></lily-zhongguo-jumin-shenfenzheng-haoma-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Resident Identity Card Number (居民身份证号码)");
    });
});
