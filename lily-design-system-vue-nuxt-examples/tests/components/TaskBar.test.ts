import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/TaskBar.vue";

describe("TaskBar", () => {
    test("renders a toolbar", () => {
        render(Subject, {
            props: { label: "Tasks" },
            slots: { default: "<button>New</button><button>Open</button>" },
        });
        expect(screen.getByRole("toolbar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: { label: "Task actions" },
            slots: { default: "<button>New</button><button>Open</button>" },
        });
        expect(screen.getByRole("toolbar").getAttribute("aria-label")).toBe("Task actions");
    });

    test("renders children", () => {
        render(Subject, {
            props: { label: "Tasks" },
            slots: { default: "<button>New</button><button>Open</button>" },
        });
        expect(screen.getByText("New")).toBeTruthy();
    });

    test("arrow right navigates to next item", () => {
        render(Subject, {
            props: { label: "Tasks" },
            slots: { default: "<button>New</button><button>Open</button>" },
        });
        const buttons = screen.getAllByRole("button");
        buttons[0].focus();
        buttons[0].dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
        );
        expect(document.activeElement).toBe(buttons[1]);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "T", "data-testid": "tb" }, slots: { default: "x" } });
        expect(screen.getByTestId("tb")).toBeTruthy();
    });
});
