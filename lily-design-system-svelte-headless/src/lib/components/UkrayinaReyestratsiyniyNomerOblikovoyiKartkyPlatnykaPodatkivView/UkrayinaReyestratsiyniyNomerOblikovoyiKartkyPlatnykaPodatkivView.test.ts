import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView from "./UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView.svelte";

describe("UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView", () => {
    test("renders with content", () => {
        render(UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view");
    });
});
