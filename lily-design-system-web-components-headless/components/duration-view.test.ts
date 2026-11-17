import { afterEach, describe, expect, test } from "vitest";

import { DurationView } from "./duration-view.js";

if (!customElements.get("lily-duration-view"))
    customElements.define("lily-duration-view", DurationView);

afterEach(() => {
    document.body.innerHTML = "";
});

const root = () => document.querySelector("time.duration-view") as HTMLElement;

describe("DurationView", () => {
    test("renders a time whose datetime is the duration, holding the consumer's words", () => {
        document.body.innerHTML = `<lily-duration-view value="3 days 4 hours" duration="P3DT4H"></lily-duration-view>`;
        expect(root().getAttribute("datetime")).toBe("P3DT4H");
        expect(root().textContent).toBe("3 days 4 hours");
    });

    test("a negative duration keeps its length as datetime and is marked data-negative", () => {
        document.body.innerHTML = `<lily-duration-view value="3 days early" duration="-P3D"></lily-duration-view>`;
        expect(root().getAttribute("datetime")).toBe("P3D");
        expect(root().hasAttribute("data-negative")).toBe(true);
    });

    test("a duration in years is no datetime", () => {
        document.body.innerHTML = `<lily-duration-view value="2 years" duration="P2Y"></lily-duration-view>`;
        expect(root().hasAttribute("datetime")).toBe(false);
    });

    test("names the value with hidden text when a label is given", () => {
        document.body.innerHTML = `<lily-duration-view value="4 days" duration="P4D" label="Length of stay"></lily-duration-view>`;
        expect(root().textContent).toBe("Length of stay 4 days");
    });
});
