// P10-T9: form-reset audit. A control bound with v-model keeps its value in the
// component's model, which the browser's own reset knows nothing about: the
// field blanked while the model kept what the user typed. Every component that
// renders a native control for `modelValue` must put the control AND the model
// back to the value they started with, one tick after `reset`, and do nothing
// when the reset was cancelled.
import { fireEvent, render } from "@testing-library/vue";
import { defineComponent, h, ref } from "vue";
import { describe, expect, test } from "vitest";

import ChatComposer from "./ChatComposer.vue";
import CheckboxInput from "./CheckboxInput.vue";
import DateRange from "./DateRange.vue";
import MultiSelect from "./MultiSelect.vue";
import RadioInput from "./RadioInput.vue";
import Select from "./Select.vue";
import TaskListItem from "./TaskListItem.vue";

// These render their own <form>, so the harness form never receives their reset
// (a nested form is invalid HTML); ChatComposer has its own test below.
const OWN_FORM = new Set(["ChatComposer", "NewsletterSignup"]);
const tick = () => new Promise((resolve) => setTimeout(resolve, 5));
const modules = import.meta.glob("./*.vue", { eager: true }) as Record<string, { default: object }>;

const FIELD =
    "input:not([type=hidden]):not([type=file]):not([type=button]):not([type=submit]):not([type=reset]):not([type=image]), textarea";
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

/** A <form> holding the component, its modelValue held by a parent as v-model would. */
function harness(component: object, initial: unknown) {
    const model = ref<unknown>(initial);
    const Wrapper = defineComponent({
        setup: () => () =>
            h("form", [
                h(component, {
                    label: "x",
                    modelValue: model.value,
                    "onUpdate:modelValue": (value: unknown) => (model.value = value),
                }),
            ]),
    });
    const view = render(Wrapper);
    return { model, view, form: view.container.querySelector("form")! };
}

describe("every component with a modelValue text-like control", () => {
    for (const [path, module] of Object.entries(modules)) {
        const name = path.slice(2, -".vue".length);
        if (OWN_FORM.has(name)) continue;
        test(`${name} restores its control and model on form reset`, async () => {
            let probe;
            try {
                probe = harness(module.default, undefined);
            } catch {
                return;
            }
            const control = probe.view.container.querySelector(FIELD) as HTMLInputElement | null;
            const type = control?.tagName === "TEXTAREA" ? "textarea" : control?.type;
            probe.view.unmount();
            if (!control || !type || INITIAL[type] === undefined) return;

            const { model, view, form } = harness(module.default, INITIAL[type]);
            const field = form.querySelector(FIELD) as HTMLInputElement;
            // Untouched, a reset must still leave the initial value showing: the
            // browser alone would blank it, and the model has nothing to change.
            if (field.value === INITIAL[type]) {
                form.reset();
                await tick();
                expect(field.value).toBe(INITIAL[type]);
            }
            await fireEvent.update(field, CHANGED[type]);
            await tick();
            // Only components that take their value from modelValue are in scope.
            if (field.value !== CHANGED[type] || String(model.value) !== CHANGED[type])
                return view.unmount();

            // A cancelled reset changes nothing.
            const cancel = (event: Event) => event.preventDefault();
            form.addEventListener("reset", cancel);
            form.reset();
            await tick();
            form.removeEventListener("reset", cancel);
            expect(String(model.value)).toBe(CHANGED[type]);

            form.reset();
            await tick();
            expect(field.value).toBe(INITIAL[type]);
            expect(String(model.value)).toBe(INITIAL[type]);
            view.unmount();
        });
    }
});

describe("other controls", () => {
    test("Select puts the chosen option and the model back", async () => {
        const model = ref("b");
        const Wrapper = defineComponent({
            setup: () => () =>
                h("form", [
                    h(
                        Select,
                        {
                            label: "x",
                            modelValue: model.value,
                            "onUpdate:modelValue": (v: string) => (model.value = v),
                        },
                        () => [
                            h("option", { value: "a" }, "a"),
                            h("option", { value: "b" }, "b"),
                            h("option", { value: "c" }, "c"),
                        ],
                    ),
                ]),
        });
        const { container } = render(Wrapper);
        const select = container.querySelector("select") as HTMLSelectElement;
        await fireEvent.update(select, "c");
        await tick();
        expect(model.value).toBe("c");
        container.querySelector("form")!.reset();
        await tick();
        expect(model.value).toBe("b");
        expect(select.value).toBe("b");
    });

    test("MultiSelect puts the selection and the model back", async () => {
        const model = ref<string[]>(["a"]);
        const Wrapper = defineComponent({
            setup: () => () =>
                h("form", [
                    h(
                        MultiSelect,
                        {
                            label: "x",
                            modelValue: model.value,
                            "onUpdate:modelValue": (v: string[]) => (model.value = v),
                        },
                        () => [h("option", { value: "a" }, "a"), h("option", { value: "b" }, "b")],
                    ),
                ]),
        });
        const { container } = render(Wrapper);
        const select = container.querySelector("select") as HTMLSelectElement;
        select.options[0].selected = false;
        select.options[1].selected = true;
        await fireEvent.change(select);
        await tick();
        expect(model.value).toEqual(["b"]);
        container.querySelector("form")!.reset();
        await tick();
        expect(model.value).toEqual(["a"]);
        expect(Array.from(select.selectedOptions).map((o) => o.value)).toEqual(["a"]);
    });

    test.each([
        ["CheckboxInput", CheckboxInput, "checked"],
        ["TaskListItem", TaskListItem, "checked"],
    ])("%s restores its initial checked state and model", async (_name, component, prop) => {
        const model = ref(true);
        const Wrapper = defineComponent({
            setup: () => () =>
                h("form", [
                    h(component as object, {
                        label: "x",
                        [prop]: model.value,
                        [`onUpdate:${prop}`]: (v: boolean) => (model.value = v),
                    }),
                ]),
        });
        const { container } = render(Wrapper);
        const box = container.querySelector("input[type=checkbox]") as HTMLInputElement;
        expect(box.checked).toBe(true);
        await fireEvent.click(box);
        await tick();
        expect(model.value).toBe(false);
        container.querySelector("form")!.reset();
        await tick();
        expect(model.value).toBe(true);
        expect(box.checked).toBe(true);
    });

    test("RadioInput keeps its checked prop through a reset", async () => {
        const { container } = render({
            render: () =>
                h("form", [h(RadioInput, { label: "x", name: "r", value: "a", checked: true })]),
        });
        const radio = container.querySelector("input") as HTMLInputElement;
        expect(radio.checked).toBe(true);
        container.querySelector("form")!.reset();
        await tick();
        expect(radio.checked).toBe(true);
    });

    test("DateRange restores both dates", async () => {
        const start = ref("2020-01-01");
        const end = ref("2020-02-01");
        const Wrapper = defineComponent({
            setup: () => () =>
                h("form", [
                    h(DateRange, {
                        label: "x",
                        startLabel: "s",
                        endLabel: "e",
                        start: start.value,
                        "onUpdate:start": (v: string) => (start.value = v),
                        end: end.value,
                        "onUpdate:end": (v: string) => (end.value = v),
                    }),
                ]),
        });
        const { container } = render(Wrapper);
        const [from, to] = Array.from(container.querySelectorAll("input")) as HTMLInputElement[];
        await fireEvent.update(from, "2021-01-01");
        await fireEvent.update(to, "2021-02-01");
        await tick();
        container.querySelector("form")!.reset();
        await tick();
        expect([from.value, to.value, start.value, end.value]).toEqual([
            "2020-01-01",
            "2020-02-01",
            "2020-01-01",
            "2020-02-01",
        ]);
    });

    test("ChatComposer clears the message when its own form resets", async () => {
        const { container } = render(ChatComposer, {
            props: { label: "m", sendLabel: "s", stopLabel: "x", modelValue: "" },
        });
        const area = container.querySelector("textarea") as HTMLTextAreaElement;
        await fireEvent.update(area, "hello");
        await tick();
        container.querySelector("form")!.reset();
        await tick();
        expect(area.value).toBe("");
    });
});
