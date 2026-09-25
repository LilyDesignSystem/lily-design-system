import { afterEach, describe, expect, test } from "vitest";

import { ZhongguoJuminShenfenzhengHaomaView } from "./zhongguo-jumin-shenfenzheng-haoma-view.js";

if (!customElements.get("lily-zhongguo-jumin-shenfenzheng-haoma-view")) {
    customElements.define("lily-zhongguo-jumin-shenfenzheng-haoma-view", ZhongguoJuminShenfenzhengHaomaView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ZhongguoJuminShenfenzhengHaomaView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-zhongguo-jumin-shenfenzheng-haoma-view label="Resident Identity Card Number (居民身份证号码)" value="11010119800101123X"></lily-zhongguo-jumin-shenfenzheng-haoma-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("zhongguo-jumin-shenfenzheng-haoma-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-zhongguo-jumin-shenfenzheng-haoma-view label="Resident Identity Card Number (居民身份证号码)" value="11010119800101123X"></lily-zhongguo-jumin-shenfenzheng-haoma-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Resident Identity Card Number (居民身份证号码)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-zhongguo-jumin-shenfenzheng-haoma-view label="Resident Identity Card Number (居民身份证号码)" value="11010119800101123X"></lily-zhongguo-jumin-shenfenzheng-haoma-view>') as unknown as ZhongguoJuminShenfenzhengHaomaView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("11010119800101123X");
        expect(host.value).toBe("11010119800101123X");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-zhongguo-jumin-shenfenzheng-haoma-view label="Resident Identity Card Number (居民身份证号码)" value="11010119800101123X"></lily-zhongguo-jumin-shenfenzheng-haoma-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
