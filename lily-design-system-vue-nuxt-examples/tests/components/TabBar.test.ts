import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/TabBar.vue";

describe("TabBar", () => {
    test("renders a tablist", () => {
        render(Subject, {
            props: { label: "Settings" },
            slots: {
                default:
                    "<button role='tab' tabindex='-1'>General</button><button role='tab' tabindex='-1'>Advanced</button>",
            },
        });
        expect(screen.getByRole("tablist")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: { label: "Settings" },
            slots: {
                default:
                    "<button role='tab' tabindex='-1'>General</button><button role='tab' tabindex='-1'>Advanced</button>",
            },
        });
        expect(screen.getByRole("tablist").getAttribute("aria-label")).toBe("Settings");
    });

    test("renders children", () => {
        render(Subject, {
            props: { label: "Settings" },
            slots: {
                default:
                    "<button role='tab' tabindex='-1'>General</button><button role='tab' tabindex='-1'>Advanced</button>",
            },
        });
        expect(screen.getByText("General")).toBeTruthy();
        expect(screen.getByText("Advanced")).toBeTruthy();
    });

    test("arrow right navigates to next tab", () => {
        render(Subject, {
            props: { label: "Settings" },
            slots: {
                default:
                    "<button role='tab' tabindex='-1'>General</button><button role='tab' tabindex='-1'>Advanced</button>",
            },
        });
        const tabs = screen.getAllByRole("tab");
        tabs[0].focus();
        tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(tabs[1]);
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "S", "data-testid": "tbar" },
            slots: {
                default:
                    "<button role='tab' tabindex='-1'>General</button><button role='tab' tabindex='-1'>Advanced</button>",
            },
        });
        expect(screen.getByTestId("tbar")).toBeTruthy();
    });
});
