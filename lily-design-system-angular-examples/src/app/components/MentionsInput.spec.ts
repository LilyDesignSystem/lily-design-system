import { describe, expect, test } from "vitest";
import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { MentionsInput } from "./MentionsInput";

describe("MentionsInput", () => {
    function render(inputs: Record<string, unknown> = {}) {
        const fixture = TestBed.createComponent(MentionsInput);
        for (const [k, v] of Object.entries({ label: "Comment", ...inputs }))
            fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        return fixture;
    }
    const parts = (f: ReturnType<typeof render>) => {
        const root = f.nativeElement.querySelector("div.mentions-input");
        return {
            root,
            input: root.querySelector("input.mentions-input-control"),
            panel: root.querySelector(".mentions-input-suggestions"),
        };
    };

    test("renders a div root with the base class, className and the trigger character", () => {
        const { root } = parts(render({ className: "extra" }));
        expect(root.classList.contains("extra")).toBe(true);
        expect(root.getAttribute("data-trigger-char")).toBe("@");
        expect(parts(render({ triggerChar: "#" })).root.getAttribute("data-trigger-char")).toBe(
            "#",
        );
    });

    test("the input is a named list-autocomplete combobox controlling the panel", () => {
        const { input, panel } = parts(render());
        expect(input.getAttribute("type")).toBe("text");
        expect(input.getAttribute("role")).toBe("combobox");
        expect(input.getAttribute("aria-label")).toBe("Comment");
        expect(input.getAttribute("aria-haspopup")).toBe("listbox");
        expect(input.getAttribute("aria-autocomplete")).toBe("list");
        expect(panel.id).toBeTruthy();
        expect(input.getAttribute("aria-controls")).toBe(panel.id);
    });

    test("two inputs get different panel ids", () => {
        expect(parts(render()).panel.id).not.toBe(parts(render()).panel.id);
    });

    test("expanded shows the panel and sets aria-expanded", () => {
        const closed = parts(render());
        expect(closed.panel.hidden).toBe(true);
        expect(closed.input.getAttribute("aria-expanded")).toBe("false");
        const open = parts(render({ expanded: true }));
        expect(open.panel.hidden).toBe(false);
        expect(open.input.getAttribute("aria-expanded")).toBe("true");
    });

    test("shows the value and placeholder, and writes typing back to value", () => {
        const fixture = render({ value: "Hi ", placeholder: "Type @ to mention" });
        const { input } = parts(fixture);
        expect(input.value).toBe("Hi ");
        expect(input.getAttribute("placeholder")).toBe("Type @ to mention");
        input.value = "Hi @ad";
        input.dispatchEvent(new Event("input"));
        expect(fixture.componentInstance.value()).toBe("Hi @ad");
    });

    test("disabled disables the input", () => {
        expect(parts(render({ disabled: true })).input.disabled).toBe(true);
        expect(parts(render()).input.hasAttribute("placeholder")).toBe(false);
    });

    @Component({
        standalone: true,
        imports: [MentionsInput],
        template: `<form><lily-mentions-input label="Comment" [(value)]="text" /></form>`,
    })
    class FormHost {
        text = signal("Hello");
    }

    test("a form reset restores the input and the value", async () => {
        const fixture = TestBed.createComponent(FormHost);
        fixture.detectChanges();
        await fixture.whenStable();
        const form = fixture.nativeElement.querySelector("form");
        const input = form.querySelector("input");
        input.value = "Hello @gr";
        input.dispatchEvent(new Event("input"));
        form.reset();
        await new Promise((r) => setTimeout(r, 0));
        expect(fixture.componentInstance.text()).toBe("Hello");
        expect(input.value).toBe("Hello");
    });
});
