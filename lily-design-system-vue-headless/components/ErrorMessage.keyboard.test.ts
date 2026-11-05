import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./ErrorMessage.vue";

describe("ErrorMessage keyboard", () => {
    test("is announced as an alert", async () => {
        render(Subject, { props: { label: "Error" }, slots: { default: "Enter your name" } });

        expect(document.querySelector(".error-message")?.getAttribute("role")).toBe("alert");
    });
});
