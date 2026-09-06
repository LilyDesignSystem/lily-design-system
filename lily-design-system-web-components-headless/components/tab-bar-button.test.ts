import { afterEach, describe, expect, test } from "vitest";

import { TabBarButton } from "./tab-bar-button.js";

if (!customElements.get("lily-tab-bar-button")) {
    customElements.define("lily-tab-bar-button", TabBarButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TabBarButton", () => {
    test("renders a native button with role=tab", () => {
        const host = render('<lily-tab-bar-button controls="panel-1">General</lily-tab-bar-button>');

        const button = host.querySelector("button.tab-bar-button");
        expect(button).toBeTruthy();
        expect(button!.getAttribute("role")).toBe("tab");
    });

    test("aria-selected is false and tabindex is -1 when not selected", () => {
        const host = render('<lily-tab-bar-button controls="panel-1">General</lily-tab-bar-button>');

        const button = host.querySelector("button")!;
        expect(button.getAttribute("aria-selected")).toBe("false");
        expect(button.tabIndex).toBe(-1);
    });

    test("aria-selected is true and tabindex is 0 when selected", () => {
        const host = render('<lily-tab-bar-button selected controls="panel-1">General</lily-tab-bar-button>');

        const button = host.querySelector("button")!;
        expect(button.getAttribute("aria-selected")).toBe("true");
        expect(button.tabIndex).toBe(0);
    });

    test("sets aria-controls from the controls attribute", () => {
        const host = render('<lily-tab-bar-button controls="panel-overview">Overview</lily-tab-bar-button>');

        expect(host.querySelector("button")!.getAttribute("aria-controls")).toBe("panel-overview");
    });

    test("moves its children into the button", () => {
        const host = render('<lily-tab-bar-button controls="panel-1">Overview</lily-tab-bar-button>');

        expect(host.querySelector("button")!.textContent).toBe("Overview");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-tab-bar-button controls="panel-1" class="extra">Tab</lily-tab-bar-button>');

        expect(host.querySelector("button")!.className).toBe("tab-bar-button extra");
    });

    test("passes through rest attributes to the button", () => {
        const host = render('<lily-tab-bar-button controls="panel-1" data-testid="tbb">Tab</lily-tab-bar-button>');

        expect(host.querySelector("button")!.getAttribute("data-testid")).toBe("tbb");
    });
});
