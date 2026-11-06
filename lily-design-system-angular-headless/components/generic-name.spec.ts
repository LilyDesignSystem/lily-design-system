// Every component rendered with a label: a plain <div> or <span> cannot be named, because ARIA gives its
// generic role no name (tasks.md P25-T14). generic-name.allow.json holds the known cases and may only shrink.
import { TestBed } from "@angular/core/testing";
import { expect, test, vi } from "vitest";
import allowList from "./generic-name.allow.json";

const mods = import.meta.glob(["./*.ts", "!./*.spec.ts", "!./*.stories.ts", "!./index.ts"], {
    eager: true,
}) as Record<string, any>;
const allow: string[] = allowList;
const named = (el: Element | null | undefined) =>
    !!el &&
    ["DIV", "SPAN"].includes(el.tagName.toUpperCase()) &&
    el.hasAttribute("aria-label") &&
    !el.hasAttribute("role");
const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const values: Record<string, unknown> = {
    label: "Example",
    value: "1",
    alt: "A",
    src: "/a",
    href: "/",
    title: "T",
    name: "n",
};

function rootOf(Component: any, fillEveryInput: boolean): Element | null {
    const fixture = TestBed.createComponent(Component);
    const names = fillEveryInput ? Object.keys(Component.ɵcmp.inputs) : Object.keys(values);
    for (const name of names) {
        try {
            fixture.componentRef.setInput(name, values[name] ?? "1");
        } catch {
            // This component has no such input.
        }
    }
    fixture.detectChanges();
    const root = (fixture.nativeElement as HTMLElement).firstElementChild;
    fixture.destroy();
    return root;
}

test("no component names a generic root", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const hits: string[] = [];
    for (const [path, mod] of Object.entries(mods)) {
        const Component = Object.values(mod).find((value: any) => value?.ɵcmp);
        if (!Component) continue;
        let root: Element | null = null;
        try {
            root = rootOf(Component, false);
        } catch {
            try {
                root = rootOf(Component, true);
            } catch {
                // Needs input values this sweep does not give; its own test covers it.
            }
        }
        if (named(root)) hits.push(kebab(path.slice(2, -3)));
    }
    const unexpected = hits.filter((s) => !allow.includes(s));
    const stale = allow.filter((s) => !hits.includes(s));
    expect(unexpected, "names a generic root: use a role, or no label").toEqual([]);
    expect(stale, "fixed: remove from generic-name.allow.json").toEqual([]);
}, 180000);
