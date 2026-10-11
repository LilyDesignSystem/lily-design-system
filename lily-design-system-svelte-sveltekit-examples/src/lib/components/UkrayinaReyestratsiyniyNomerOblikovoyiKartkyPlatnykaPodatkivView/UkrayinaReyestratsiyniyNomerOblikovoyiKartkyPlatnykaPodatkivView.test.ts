import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView.svelte";

describe("UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Реєстраційний номер облікової картки платника податків (РНОКПП)", value: "test-value" } });

        const el = screen.getByLabelText("Реєстраційний номер облікової картки платника податків (РНОКПП)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Реєстраційний номер облікової картки платника податків (РНОКПП)", value: "test-value" } });

        const el = screen.getByLabelText("Реєстраційний номер облікової картки платника податків (РНОКПП)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Реєстраційний номер облікової картки платника податків (РНОКПП)" } });

        const el = screen.getByLabelText("Реєстраційний номер облікової картки платника податків (РНОКПП)");
        expect(el.getAttribute("aria-label")).toBe("Реєстраційний номер облікової картки платника податків (РНОКПП)");
    });
});
