import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TransferList";

describe("TransferList", () => {
    test("renders a group with the transfer-list root class", () => {
        render(
            <Subject
                label="Permissions"
                sourceLabel="Available"
                targetLabel="Selected"
                source={<ul>src</ul>}
                target={<ul>tgt</ul>}
            />
        );

        const group: HTMLElement = screen.getByRole("group", { name: "Permissions" });
        expect(group.className.includes("transfer-list")).toBe(true);
    });

    test("renders source section with sourceLabel as aria-label", () => {
        const { container } = render(
            <Subject
                label="x"
                sourceLabel="Available"
                targetLabel="Selected"
                source={<ul>src</ul>}
                target={<ul>tgt</ul>}
            />
        );

        const section: HTMLElement = container.querySelector(".transfer-list-source") as HTMLElement;
        expect(section.tagName).toBe("SECTION");
        expect(section.getAttribute("aria-label")).toBe("Available");
        expect(section.textContent).toContain("src");
    });

    test("renders target section with targetLabel as aria-label", () => {
        const { container } = render(
            <Subject
                label="x"
                sourceLabel="Available"
                targetLabel="Selected"
                source={<ul>src</ul>}
                target={<ul>tgt</ul>}
            />
        );

        const section: HTMLElement = container.querySelector(".transfer-list-target") as HTMLElement;
        expect(section.tagName).toBe("SECTION");
        expect(section.getAttribute("aria-label")).toBe("Selected");
        expect(section.textContent).toContain("tgt");
    });

    test("renders actions when provided", () => {
        const { container } = render(
            <Subject
                label="x"
                sourceLabel="A"
                targetLabel="B"
                source={<ul>s</ul>}
                target={<ul>t</ul>}
                actions={<button>Move</button>}
            />
        );

        const actionsEl: HTMLElement | null = container.querySelector(".transfer-list-actions");
        expect(actionsEl).toBeTruthy();
        expect(actionsEl?.textContent).toContain("Move");
    });

    test("does not render actions container when no actions provided", () => {
        const { container } = render(
            <Subject
                label="x"
                sourceLabel="A"
                targetLabel="B"
                source={<ul>s</ul>}
                target={<ul>t</ul>}
            />
        );

        expect(container.querySelector(".transfer-list-actions")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="x"
                sourceLabel="A"
                targetLabel="B"
                source={<ul>s</ul>}
                target={<ul>t</ul>}
                id="transfer-1"
            />
        );

        const group: HTMLElement = screen.getByRole("group");
        expect(group.getAttribute("id")).toBe("transfer-1");
    });
});
