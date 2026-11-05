import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./ErrorMessage";

describe("ErrorMessage keyboard", () => {
    test("is announced as an alert", async () => {
        render(<Subject label="Error">Enter your name</Subject>);

        expect(document.querySelector(".error-message")?.getAttribute("role")).toBe("alert");
    });
});
