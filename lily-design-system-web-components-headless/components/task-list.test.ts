import { afterEach, describe, expect, test } from "vitest";

import { TaskList } from "./task-list.js";

if (!customElements.get("lily-task-list")) {
    customElements.define("lily-task-list", TaskList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TaskList", () => {
    test("renders a native ordered list", () => {
        const host = render('<lily-task-list label="Today\'s tasks"></lily-task-list>');

        expect(host.querySelector("ol.task-list")).toBeTruthy();
    });

    test("has role=list", () => {
        const host = render('<lily-task-list label="Today\'s tasks"></lily-task-list>');

        expect(host.querySelector("ol")!.getAttribute("role")).toBe("list");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-task-list label="Today\'s tasks"></lily-task-list>');

        expect(host.querySelector("ol")!.getAttribute("aria-label")).toBe("Today's tasks");
    });

    test("moves its children into the ol", () => {
        const host = render('<lily-task-list label="Tasks"><li>Review pull requests</li></lily-task-list>');

        expect(host.querySelector("ol > li")!.textContent).toBe("Review pull requests");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-task-list label="Tasks" class="extra"></lily-task-list>');

        expect(host.querySelector("ol")!.className).toBe("task-list extra");
    });

    test("passes through rest attributes to the ol", () => {
        const host = render('<lily-task-list label="Tasks" data-testid="tasks"></lily-task-list>');

        expect(host.querySelector("ol")!.getAttribute("data-testid")).toBe("tasks");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-task-list label="Tasks"></lily-task-list>');

        (host as unknown as TaskList).connectedCallback();

        expect(host.querySelectorAll("ol").length).toBe(1);
    });
});
