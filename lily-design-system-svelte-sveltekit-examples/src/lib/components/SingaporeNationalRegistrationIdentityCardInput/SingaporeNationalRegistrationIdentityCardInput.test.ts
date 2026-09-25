import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SingaporeNationalRegistrationIdentityCardInput from "./SingaporeNationalRegistrationIdentityCardInput.svelte";

describe("SingaporeNationalRegistrationIdentityCardInput", () => {
    test("renders with content", () => {
        render(SingaporeNationalRegistrationIdentityCardInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("singapore-national-registration-identity-card-input");
    });
});
