import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView";

describe("UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Реєстраційний номер платника податків (РНОКПП)"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view",
        );
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Реєстраційний номер платника податків (РНОКПП)"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Реєстраційний номер платника податків (РНОКПП)" />);

        const el = document.querySelector(
            ".ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Реєстраційний номер платника податків (РНОКПП)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
