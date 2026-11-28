import { afterEach, describe, expect, test } from "vitest";

import { IdentifierView } from "./identifier-view.js";

// The shared base of the 94 national identifier views (tasks.md P48-T10), tested once through a minimal view.
class SampleView extends IdentifierView {
    protected readonly baseClass = "sample-identifier-view";
}
if (!customElements.get("lily-sample-identifier-view"))
    customElements.define("lily-sample-identifier-view", SampleView);

afterEach(() => {
    document.body.innerHTML = "";
});

const shown = (host: Element): string => {
    const span = host.querySelector(":scope > span") as HTMLSpanElement;
    const hidden = span.querySelector(".screen-reader-span")?.textContent ?? "";
    return (span.textContent ?? "").slice(hidden.length);
};

describe("IdentifierView", () => {
    test("shows the value as text, under its base class and the host's class, with a hidden label", () => {
        document.body.innerHTML =
            '<lily-sample-identifier-view class="wide" label="Number" value="123 456" data-x="1"></lily-sample-identifier-view>';
        const host = document.querySelector("lily-sample-identifier-view") as SampleView;
        const span = host.querySelector(":scope > span") as HTMLSpanElement;
        expect(span.className).toBe("sample-identifier-view wide");
        expect(span.querySelector(".screen-reader-span")?.textContent).toBe("Number ");
        expect(shown(host)).toBe("123 456");
        expect(span.getAttribute("data-x")).toBe("1");
        expect(span.hasAttribute("value")).toBe(false);
    });

    test("keeps the identifier out of every attribute (HC-I2): the value attribute is read and removed", () => {
        document.body.innerHTML =
            '<lily-sample-identifier-view value="123 456"></lily-sample-identifier-view>';
        const host = document.querySelector("lily-sample-identifier-view") as SampleView;
        expect(host.hasAttribute("value")).toBe(false);
        host.setAttribute("value", "789");
        expect(shown(host)).toBe("789");
        expect(host.hasAttribute("value")).toBe(false);
        expect(host.value).toBe("789");
    });

    test("a value set before the element is connected is shown when it is", () => {
        const host = document.createElement("lily-sample-identifier-view") as SampleView;
        host.value = "42";
        expect(host.value).toBe("42");
        document.body.append(host);
        expect(shown(host)).toBe("42");
        expect(host.hasAttribute("value")).toBe(false);
    });

    test("a second connect builds nothing twice", () => {
        document.body.innerHTML =
            '<lily-sample-identifier-view value="1"></lily-sample-identifier-view>';
        const host = document.querySelector("lily-sample-identifier-view") as SampleView;
        host.remove();
        document.body.append(host);
        expect(host.querySelectorAll(":scope > span")).toHaveLength(1);
    });
});
