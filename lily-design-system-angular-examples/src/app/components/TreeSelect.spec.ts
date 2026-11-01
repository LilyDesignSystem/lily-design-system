import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TreeSelect } from "./TreeSelect";

describe("TreeSelect", () => {
    function render(inputs: Record<string, unknown> = {}) {
        const fixture = TestBed.createComponent(TreeSelect);
        for (const [k, v] of Object.entries({ label: "Department", ...inputs }))
            fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        return fixture;
    }
    const parts = (f: ReturnType<typeof render>) => {
        const root = f.nativeElement.querySelector("div.tree-select");
        return {
            root,
            trigger: root.querySelector("button.tree-select-trigger"),
            panel: root.querySelector(".tree-select-panel"),
        };
    };

    test("renders a labelled tree combobox div with the base class and className", () => {
        const { root } = parts(render({ className: "extra" }));
        expect(root.getAttribute("role")).toBe("combobox");
        expect(root.getAttribute("aria-haspopup")).toBe("tree");
        expect(root.getAttribute("aria-label")).toBe("Department");
        expect(root.classList.contains("extra")).toBe(true);
    });

    test("expanded shows the panel and sets aria-expanded", () => {
        const closed = parts(render());
        expect(closed.root.getAttribute("aria-expanded")).toBe("false");
        expect(closed.panel.hidden).toBe(true);
        const open = parts(render({ expanded: true }));
        expect(open.root.getAttribute("aria-expanded")).toBe("true");
        expect(open.panel.hidden).toBe(false);
    });

    test("the trigger shows the value, else the placeholder", () => {
        expect(parts(render({ placeholder: "Choose" })).trigger.textContent.trim()).toBe("Choose");
        expect(
            parts(
                render({ placeholder: "Choose", value: "Cardiology" }),
            ).trigger.textContent.trim(),
        ).toBe("Cardiology");
    });

    test("clicking the trigger emits triggerClick; disabled disables it", () => {
        const fixture = render();
        let clicks = 0;
        fixture.componentInstance.triggerClick.subscribe(() => clicks++);
        const { trigger } = parts(fixture);
        expect(trigger.type).toBe("button");
        trigger.click();
        expect(clicks).toBe(1);
        expect(parts(render({ disabled: true })).trigger.disabled).toBe(true);
    });

    test("multiple sets data-multiple", () => {
        expect(parts(render()).root.hasAttribute("data-multiple")).toBe(false);
        expect(parts(render({ multiple: true })).root.getAttribute("data-multiple")).toBe("true");
    });
});
