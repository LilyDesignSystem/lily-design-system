import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import NihonKojinBangoInput from "./NihonKojinBangoInput.svelte";

describe("NihonKojinBangoInput", () => {
    test("renders with content", () => {
        render(NihonKojinBangoInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("nihon-kojin-bango-input");
    });
});
