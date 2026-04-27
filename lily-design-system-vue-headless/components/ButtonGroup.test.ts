import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ButtonGroup.vue";


describe("ButtonGroup", () => {
    test("renders as a group with aria-label", () => {
        render(Subject, { props: { label: "Pagination" }, slots: { default: "<button>1</button>" } });

        const group: HTMLElement = screen.getByRole("group", { name: "Pagination" });
        expect(group).toBeTruthy();
    });

    test("has button-group class on root", () => {
        render(Subject, { props: { label: "Actions" }, slots: { default: "<button>Save</button>" } });

        const group: HTMLElement = screen.getByRole("group");
        expect(group.classList.contains("button-group")).toBe(true);
    });

    test("renders children from slot", () => {
        render(Subject, { props: { label: "Actions" }, slots: { default: "<button>Save</button><button>Cancel</button>" } });

        expect(screen.getByText("Save")).toBeTruthy();
        expect(screen.getByText("Cancel")).toBeTruthy();
    });

    test("applies aria-label from prop", () => {
        render(Subject, { props: { label: "Document actions" }, slots: { default: "<button>x</button>" } });

        const group: HTMLElement = screen.getByRole("group");
        expect(group.getAttribute("aria-label")).toBe("Document actions");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Actions", id: "btn-grp" }, slots: { default: "<button>x</button>" } });

        const group: HTMLElement = screen.getByRole("group");
        expect(group.getAttribute("id")).toBe("btn-grp");
    });
});
