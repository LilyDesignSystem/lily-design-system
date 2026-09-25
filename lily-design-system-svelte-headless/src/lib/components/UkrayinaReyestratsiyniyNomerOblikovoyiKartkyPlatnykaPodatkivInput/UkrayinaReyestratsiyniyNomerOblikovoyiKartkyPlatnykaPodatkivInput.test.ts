import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput from "./UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput.svelte";

describe("UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput", () => {
    test("renders with content", () => {
        render(UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input");
    });
});
