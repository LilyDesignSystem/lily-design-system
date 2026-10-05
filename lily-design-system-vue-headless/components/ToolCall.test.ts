import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ToolCall.vue";

const slots = { summary: '<span data-testid="sum">search_web</span>', default: '<span data-testid="body">Body</span>' };

describe("ToolCall", () => {
    test("renders a <details> with the base class, closed by default", () => {
        const { container } = render(Subject, { slots });
        const el = container.querySelector("details.tool-call") as HTMLDetailsElement;
        expect(el).toBeTruthy();
        expect(el.open).toBe(false);
    });

    test("puts the summary slot in <summary class=tool-call-summary>", () => {
        const { container } = render(Subject, { slots });
        expect(container.querySelector("summary.tool-call-summary [data-testid=sum]")).toBeTruthy();
    });

    test("puts the default slot in <div class=tool-call-content>", () => {
        const { container } = render(Subject, { slots });
        expect(container.querySelector("div.tool-call-content [data-testid=body]")).toBeTruthy();
    });

    test("reflects open", () => {
        const { container } = render(Subject, { props: { open: true }, slots });
        expect((container.querySelector("details") as HTMLDetailsElement).open).toBe(true);
    });

    test("sets data-status from status, and omits it without one", () => {
        const a = render(Subject, { props: { status: "done" }, slots });
        expect(a.container.querySelector("details")!.getAttribute("data-status")).toBe("done");
        a.unmount();
        const b = render(Subject, { slots });
        expect(b.container.querySelector("details")!.hasAttribute("data-status")).toBe(false);
    });

    test("is busy only while running", () => {
        const a = render(Subject, { props: { status: "running" }, slots });
        expect(a.container.querySelector("details")!.getAttribute("aria-busy")).toBe("true");
        a.unmount();
        for (const s of ["pending", "done", "error"]) {
            const b = render(Subject, { props: { status: s }, slots });
            expect(b.container.querySelector("details")!.hasAttribute("aria-busy")).toBe(false);
            b.unmount();
        }
    });

    test("merges attrs (class, id) onto the root", () => {
        const { container } = render(Subject, { attrs: { class: "mine", id: "t1" }, slots });
        const el = container.querySelector("details")!;
        expect(el.id).toBe("t1");
        expect(el.getAttribute("class")).toBe("tool-call mine");
    });
});
