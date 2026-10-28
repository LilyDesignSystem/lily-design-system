import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ToolBar.vue";

describe("ToolBar", () => {
    test("renders a toolbar", () => {
        render(Subject, {
            props: { label: "Tools" },
            slots: { default: "<button>Bold</button><button>Italic</button>" },
        });
        expect(screen.getByRole("toolbar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: { label: "Editor tools" },
            slots: { default: "<button>Bold</button><button>Italic</button>" },
        });
        expect(screen.getByLabelText("Editor tools")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, {
            props: { label: "Tools" },
            slots: { default: "<button>Bold</button><button>Italic</button>" },
        });
        expect(screen.getByText("Bold")).toBeTruthy();
    });

    test("arrow right navigates to next item", async () => {
        render(Subject, {
            props: { label: "Tools" },
            slots: { default: "<button>Bold</button><button>Italic</button>" },
        });
        const buttons = screen.getAllByRole("button");
        buttons[0].focus();
        buttons[0].dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
        );
        expect(document.activeElement).toBe(buttons[1]);
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "T", "data-testid": "tb" },
            slots: { default: "<button>Bold</button><button>Italic</button>" },
        });
        expect(screen.getByTestId("tb")).toBeTruthy();
    });
});
