// A real server render of every component, as prerendering does it: no jsdom and no TestBed, so `document` and
// `window` are undefined. The unit tests cannot see this, because jsdom defines them. See spec/index.md.
import "@angular/compiler";
import { Component, ErrorHandler, provideZonelessChangeDetection, Type } from "@angular/core";
import { NgComponentOutlet } from "@angular/common";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideServerRendering, renderApplication } from "@angular/platform-server";
import * as lily from "../index";

type Inputs = Record<string, unknown>;

/** Required inputs that the name-based defaults below cannot guess, and function inputs they would guess wrongly. */
const INPUTS: Record<string, Inputs> = {
    BarcodeImage: { src: "a.png", alt: "x" },
    Collapsible: { summary: "x" },
    CurrencyInput: { currencyCode: "XTS" },
    FiveStarRatingPicker: { starLabel: undefined },
    HeatmapChartWithYearOfDays: { year: 2026, weekStart: 1 },
    InputWithMask: { mask: "##" },
    KbdShortcut: { keys: ["K"] },
    MiddleTruncation: { text: "x", ellipsis: "x" },
    OneTimePasswordInput: { length: 6 },
    PinInputDiv: { digitLabel: undefined },
    ScrollerVideo: { src: "a.mp4", alt: "x" },
    TextAreaInputWithCharacterCounter: { maxLength: 10, counterTemplate: "x" },
    VideoPlayer: { src: "a.mp4" },
    WheelPicker: { options: [{ value: "a", label: "A" }] },
};

/** Text inputs, set on every component so a required one is never missing. */
const TEXT = /label|title|text|name|id$/i;

/** Inputs that show what is otherwise closed. Everything set in the browser on first render runs here too. */
const OPENING = /^(open|expanded|visible|spy|active|autoplay|modal|checked|selected)$/i;

/** The popover stays in the markup, closed: the browser opens it, and hydration keeps this element. */
const POPOVERS = [
    "ActionGroup",
    "Cascader",
    "Coachmark",
    "Combobox",
    "ContextMenu",
    "ContextualHelp",
    "DropdownMenu",
    "FloatingPanel",
    "HoverCard",
    "MentionsInput",
    "PopconfirmDialog",
    "Popover",
    "Popup",
    "SplitButton",
    "Tooltip",
    "TreeSelect",
];

let current: { type: Type<unknown>; inputs: Inputs };

@Component({
    selector: "app-root",
    imports: [NgComponentOutlet],
    template: `<ng-container *ngComponentOutlet="type; inputs: inputs" />`,
})
class Host {
    readonly type = current.type;
    readonly inputs = current.inputs;
}

async function render(type: Type<unknown>, inputs: Inputs) {
    const errors: string[] = [];
    current = { type, inputs };
    class Collect implements ErrorHandler {
        handleError(error: unknown) {
            errors.push(String((error as Error)?.message ?? error));
        }
    }
    let html = "";
    try {
        html = await renderApplication(
            (context) =>
                bootstrapApplication(
                    Host,
                    {
                        providers: [
                            provideZonelessChangeDetection(),
                            provideServerRendering(),
                            { provide: ErrorHandler, useClass: Collect },
                        ],
                    },
                    context,
                ),
            { document: "<!doctype html><html><body><app-root></app-root></body></html>", url: "/" },
        );
    } catch (error) {
        errors.push(String((error as Error)?.message ?? error));
    }
    return { errors, html };
}

const components = Object.entries(lily).flatMap(([name, value]) => {
    const cmp = (value as { ɵcmp?: { inputs: Inputs } } | undefined)?.ɵcmp;
    return cmp ? [{ name, type: value as Type<unknown>, inputs: Object.keys(cmp.inputs) }] : [];
});

function closedInputs(name: string, inputs: string[]): Inputs {
    return {
        ...Object.fromEntries(inputs.filter((k) => TEXT.test(k)).map((k) => [k, "x"])),
        ...INPUTS[name],
    };
}

describe("prerendering", () => {
    it("finds every component", () => {
        expect(components.length).toBe(609);
    });

    for (const state of ["closed", "open"] as const) {
        it(`renders every component on the server, ${state}`, async () => {
            const failures: Record<string, string[]> = {};
            for (const { name, type, inputs } of components) {
                const closed = closedInputs(name, inputs);
                const opened = Object.fromEntries(
                    inputs.filter((k) => OPENING.test(k)).map((k) => [k, true]),
                );
                const { errors } = await render(
                    type,
                    state === "open" ? { ...closed, ...opened } : closed,
                );
                if (errors.length > 0) failures[name] = [...new Set(errors)];
            }
            expect(failures).toEqual({});
        });
    }

    it("leaves popovers in the markup, not hidden", async () => {
        const stripped: string[] = [];
        for (const { name, type, inputs } of components) {
            if (!POPOVERS.includes(name)) continue;
            const { html } = await render(type, closedInputs(name, inputs));
            if (!html.includes('popover="')) stripped.push(name);
        }
        expect(stripped).toEqual([]);
    });
});
