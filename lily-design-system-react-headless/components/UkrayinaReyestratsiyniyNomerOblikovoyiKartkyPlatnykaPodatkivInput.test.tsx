import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput";

describe("UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Реєстраційний номер платника податків (РНОКПП)" />);

        const input = screen.getByLabelText("Реєстраційний номер платника податків (РНОКПП)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Реєстраційний номер платника податків (РНОКПП)" />);

        const input = screen.getByLabelText("Реєстраційний номер платника податків (РНОКПП)");
        expect(input.getAttribute("class")).toContain("ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Реєстраційний номер платника податків (РНОКПП)" />);

        const input = screen.getByLabelText("Реєстраційний номер платника податків (РНОКПП)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Реєстраційний номер платника податків (РНОКПП)" />);

        const input = screen.getByLabelText("Реєстраційний номер платника податків (РНОКПП)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Реєстраційний номер платника податків (РНОКПП)" required />);

        const input = screen.getByLabelText("Реєстраційний номер платника податків (РНОКПП)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Реєстраційний номер платника податків (РНОКПП)" />);

        const input = screen.getByLabelText("Реєстраційний номер платника податків (РНОКПП)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Реєстраційний номер платника податків (РНОКПП)" disabled />);

        const input = screen.getByLabelText("Реєстраційний номер платника податків (РНОКПП)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Реєстраційний номер платника податків (РНОКПП)" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
