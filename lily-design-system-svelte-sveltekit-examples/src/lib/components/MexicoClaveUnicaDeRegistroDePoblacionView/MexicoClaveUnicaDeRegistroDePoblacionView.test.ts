import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MexicoClaveUnicaDeRegistroDePoblacionView from "./MexicoClaveUnicaDeRegistroDePoblacionView.svelte";

describe("MexicoClaveUnicaDeRegistroDePoblacionView", () => {
    test("renders with content", () => {
        render(MexicoClaveUnicaDeRegistroDePoblacionView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mexico-clave-unica-de-registro-de-poblacion-view");
    });
});
