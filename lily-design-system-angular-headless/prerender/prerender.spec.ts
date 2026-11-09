// A real server render of every component, as prerendering does it: no jsdom and no TestBed, so `document` and
// `window` are undefined. The unit tests cannot see this, because jsdom defines them. See spec/index.md.
import "@angular/compiler";
import {
    Component,
    DOCUMENT,
    ErrorHandler,
    inject,
    provideZonelessChangeDetection,
    Type,
} from "@angular/core";
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
    RedAmberGreenPicker: { statusLabel: undefined },
    RedOrangeYellowGreenBluePicker: { statusLabel: undefined },
    ScrollerVideo: { src: "a.mp4", alt: "x" },
    TextAreaInputWithCharacterCounter: { maxLength: 10, counterTemplate: "x" },
    VideoPlayer: { src: "a.mp4" },
    WheelPicker: { options: [{ value: "a", label: "A" }] },
};

/** Realistic values for every array, object and function input in the catalog. */
const OPTIONS = [
    { value: "a", label: "A" },
    { value: "b", label: "B" },
    { value: "c", label: "C" },
];
const DATA: Record<string, Inputs> = {
    Autosuggest: { suggestions: OPTIONS, value: "a" },
    FileUpload: { selectedLabel: (count: number) => `${count}` },
    FiveFaceRatingPicker: { labels: ["1", "2", "3", "4", "5"] },
    FiveStarRatingPicker: { starLabel: (star: number) => `${star}` },
    ImageCropper: { crop: { x: 10, y: 10, width: 50, height: 50 } },
    Listbox: { navigation: "active-descendant" },
    MiddleTruncation: { text: "a-long-file-name-that-needs-truncating.pdf", ellipsis: "x" },
    MultiSelect: { value: ["a", "b"] },
    MultiSelectWithExtras: { value: ["a", "b"] },
    PinInputDiv: { digitLabel: (position: number, length: number) => `${position}/${length}` },
    RedAmberGreenPicker: { statusLabel: (status: string) => status, value: "amber" },
    RedOrangeYellowGreenBluePicker: { statusLabel: (status: string) => status, value: "yellow" },
    SkipLink: { label: "" },
    WheelPicker: { options: OPTIONS, value: "b" },
};

/** What consumers project: every Angular list, menu, nav and group takes its items as content. */
const CONTENT = `
    <a href="#a">A</a>
    <button type="button" data-value="a">A</button>
    <ul>
        <li role="option" data-value="a">A</li>
        <li role="menuitem" tabindex="-1">B</li>
        <li role="treeitem" aria-expanded="true"><a href="#b">B</a></li>
    </ul>
    <option value="a">A</option>
    <h2 id="a">A</h2>
`;

/** Text inputs, set on every component so a required one is never missing. */
const TEXT = /label|title|text|name|id$/i;

/** Inputs that show what is otherwise closed. Everything set in the browser on first render runs here too. */
const OPENING = /^(open|expanded|visible|editing|spy|active|autoplay|modal|checked|selected)$/i;

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

let current: { type: Type<unknown>; inputs: Inputs; slots: number };

@Component({
    selector: "app-root",
    imports: [NgComponentOutlet],
    template: `<ng-container *ngComponentOutlet="type; inputs: inputs; content: content" />`,
})
class Host {
    readonly type = current.type;
    readonly inputs = current.inputs;
    /** One holder of real nodes per `<ng-content>`, from the server's own document. */
    readonly content = ((document: Document) =>
        Array.from({ length: current.slots }, () => {
            const holder = document.createElement("div");
            holder.innerHTML = CONTENT;
            return Array.from(holder.childNodes);
        }))(inject(DOCUMENT));
}

async function render(type: Type<unknown>, inputs: Inputs, slots = 0) {
    const errors: string[] = [];
    current = { type, inputs, slots };
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
            {
                document: "<!doctype html><html><body><app-root></app-root></body></html>",
                url: "/",
            },
        );
    } catch (error) {
        errors.push(String((error as Error)?.message ?? error));
    }
    return { errors, html };
}

const components = Object.entries(lily).flatMap(([name, value]) => {
    const cmp = (value as { ɵcmp?: { inputs: Inputs; ngContentSelectors?: string[] } } | undefined)
        ?.ɵcmp;
    return cmp
        ? [
              {
                  name,
                  type: value as Type<unknown>,
                  inputs: Object.keys(cmp.inputs),
                  slots: cmp.ngContentSelectors?.length ?? 0,
              },
          ]
        : [];
});

function closedInputs(name: string, inputs: string[]): Inputs {
    return {
        ...Object.fromEntries(inputs.filter((k) => TEXT.test(k)).map((k) => [k, "x"])),
        ...INPUTS[name],
    };
}

function openedInputs(inputs: string[]): Inputs {
    return Object.fromEntries(inputs.filter((k) => OPENING.test(k)).map((k) => [k, true]));
}

describe("prerendering", () => {
    // Angular logs its development mode on every render.
    beforeAll(() => {
        vi.spyOn(console, "log").mockImplementation(() => {});
    });

    it("finds every component", () => {
        expect(components.length).toBe(608);
    });

    const STATES = {
        closed: (name: string, inputs: string[]) => closedInputs(name, inputs),
        open: (name: string, inputs: string[]) => ({
            ...closedInputs(name, inputs),
            ...openedInputs(inputs),
        }),
        populated: (name: string, inputs: string[]) => ({
            ...closedInputs(name, inputs),
            ...openedInputs(inputs),
            ...DATA[name],
        }),
    };

    for (const [state, inputsFor] of Object.entries(STATES)) {
        it(`renders every component on the server, ${state}`, async () => {
            const failures: Record<string, string[]> = {};
            for (const { name, type, inputs, slots } of components) {
                const { errors } = await render(
                    type,
                    inputsFor(name, inputs),
                    state === "populated" ? slots : 0,
                );
                if (errors.length > 0) failures[name] = [...new Set(errors)];
            }
            expect(failures).toEqual({});
        });
    }

    it("projects content into every component that takes it", async () => {
        const taking = components.filter((c) => c.slots > 0);
        expect(taking.length).toBeGreaterThan(300);
        const empty: string[] = [];
        for (const { name, type, inputs, slots } of taking) {
            const { html } = await render(type, STATES.populated(name, inputs), slots);
            if (!html.includes('href="#a"')) empty.push(name);
        }
        expect(empty).toEqual([]);
    });

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
