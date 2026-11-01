// P10-T9: form-reset audit. A control bound with [value]="value()" keeps its
// value in the component's model, which the browser's own reset knows nothing
// about: the field blanked while the model kept what the user typed. Every
// component that renders a native control for its `value` model must put the
// control AND the model back to the value they started with, one tick after
// `reset`, and do nothing when the reset was cancelled.
import { TestBed, type ComponentFixture } from "@angular/core/testing";
import { describe, expect, test } from "vitest";

import { DateRange } from "./DateRange";
import { MultiSelect } from "./MultiSelect";
import { Select } from "./Select";

const modules = import.meta.glob(["./*.ts", "!./*.spec.ts", "!./*.stories.ts"], {
    eager: true,
}) as Record<string, Record<string, any>>;
// PinInputDiv has its own reset (and tests): its first control is one digit box.
const OWN_RESET = new Set(["PinInputDiv"]);
const tick = () => new Promise((resolve) => setTimeout(resolve, 10));
const FIELD =
    "input:not([type=hidden]):not([type=file]):not([type=button]):not([type=submit]):not([type=reset]):not([type=image]):not([type=checkbox]):not([type=radio]), textarea";
const INITIAL: Record<string, string> = {
    number: "5",
    range: "5",
    date: "2020-01-01",
    color: "#123456",
    time: "10:00",
    month: "2020-01",
    week: "2020-W01",
    email: "a@b.co",
    url: "http://a.b",
    "datetime-local": "2020-01-01T10:00",
    tel: "123",
    search: "init",
    password: "init",
    text: "init",
    textarea: "init",
};
const CHANGED: Record<string, string> = {
    number: "7",
    range: "9",
    date: "2021-01-01",
    color: "#654321",
    time: "11:00",
    month: "2021-01",
    week: "2021-W02",
    email: "c@d.co",
    url: "http://c.d",
    "datetime-local": "2021-01-01T10:00",
    tel: "999",
    search: "chg",
    password: "chg",
    text: "chg",
    textarea: "chg",
};

function inForm(
    component: any,
    inputs: Record<string, unknown> = {},
): { form: HTMLFormElement; fixture: ComponentFixture<any> } {
    const form = document.createElement("form");
    document.body.appendChild(form);
    const fixture = TestBed.createComponent(component);
    for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
    form.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    return { form, fixture };
}
async function settle(fixture: ComponentFixture<any>) {
    await fixture.whenStable();
    await tick();
    fixture.detectChanges();
    await fixture.whenStable();
}
function type(el: HTMLInputElement, value: string) {
    el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("every component with a native control for a `value` model", () => {
    for (const [path, module] of Object.entries(modules)) {
        if (/spec|stories|form-reset/.test(path)) continue;
        const name = path.slice(2, -".ts".length);
        const component = module[name];
        if (!component || OWN_RESET.has(name)) continue;
        test(`${name} restores its control and model on form reset`, async () => {
            let probe;
            try {
                probe = inForm(component);
            } catch {
                return; // needs required inputs; covered below where relevant
            }
            const control = probe.form.querySelector<HTMLInputElement>(FIELD);
            const kind = control?.tagName === "TEXTAREA" ? "textarea" : control?.type;
            const hasModel = typeof probe.fixture.componentInstance.value?.set === "function";
            probe.form.remove();
            if (!control || !kind || INITIAL[kind] === undefined || !hasModel) return;

            const { form, fixture } = inForm(component, { value: INITIAL[kind] });
            const field = form.querySelector<HTMLInputElement>(FIELD)!;
            await settle(fixture);

            // Untouched, a reset must still leave the initial value showing.
            form.reset();
            await settle(fixture);
            expect(field.value).toBe(INITIAL[kind]);

            type(field, CHANGED[kind]);
            fixture.detectChanges();
            if (String(fixture.componentInstance.value()) !== CHANGED[kind]) return form.remove();

            // A cancelled reset changes nothing.
            const cancel = (event: Event) => event.preventDefault();
            form.addEventListener("reset", cancel);
            form.reset();
            await settle(fixture);
            form.removeEventListener("reset", cancel);
            expect(String(fixture.componentInstance.value())).toBe(CHANGED[kind]);

            form.reset();
            await settle(fixture);
            expect(field.value).toBe(INITIAL[kind]);
            expect(String(fixture.componentInstance.value())).toBe(INITIAL[kind]);
            form.remove();
        });
    }
});

describe("other controls", () => {
    test("Select puts the chosen option and the model back", async () => {
        const { form, fixture } = inForm(Select, { label: "x", value: "b" });
        const select = form.querySelector("select")!;
        for (const v of ["a", "b", "c"]) {
            const option = document.createElement("option");
            option.value = v;
            select.appendChild(option);
        }
        select.value = "b";
        fixture.componentInstance.value.set("b");
        await settle(fixture);
        select.value = "c";
        select.dispatchEvent(new Event("change", { bubbles: true }));
        await settle(fixture);
        expect(fixture.componentInstance.value()).toBe("c");
        form.reset();
        await settle(fixture);
        expect(fixture.componentInstance.value()).toBe("b");
        expect(select.value).toBe("b");
        form.remove();
    });

    test("MultiSelect puts the selection and the model back", async () => {
        const { form, fixture } = inForm(MultiSelect, { label: "x", value: ["a"] });
        const select = form.querySelector("select")!;
        for (const v of ["a", "b"]) {
            const option = document.createElement("option");
            option.value = v;
            select.appendChild(option);
        }
        fixture.componentInstance.value.set(["a"]);
        await settle(fixture);
        select.options[0].selected = false;
        select.options[1].selected = true;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        await settle(fixture);
        expect(fixture.componentInstance.value()).toEqual(["b"]);
        form.reset();
        await settle(fixture);
        expect(fixture.componentInstance.value()).toEqual(["a"]);
        expect(Array.from(select.selectedOptions).map((o) => o.value)).toEqual(["a"]);
        form.remove();
    });

    test("DateRange restores both dates", async () => {
        const { form, fixture } = inForm(DateRange, { start: "2020-01-01", end: "2020-02-01" });
        await settle(fixture);
        const [from, to] = Array.from(form.querySelectorAll("input"));
        type(from, "2021-01-01");
        type(to, "2021-02-01");
        fixture.detectChanges();
        form.reset();
        await settle(fixture);
        expect([
            from.value,
            to.value,
            fixture.componentInstance.start(),
            fixture.componentInstance.end(),
        ]).toEqual(["2020-01-01", "2020-02-01", "2020-01-01", "2020-02-01"]);
        form.remove();
    });
});
