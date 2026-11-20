// @vitest-environment jsdom
// The pattern tester must fail a broken widget, or a green contract proves nothing. Each case hands a runner markup
// that is missing a part, or a widget with no behaviour, and checks the runner rejects it with a message naming why.
import { afterEach, describe, expect, test } from "vitest";

import { attachCombobox } from "./combobox-keys";
import { attachCommand } from "./command-keys";
import { attachMenu } from "./menu-keys";
import { runPattern, type PatternName } from "./pattern-tester";
import {
    attachCropper,
    attachGrid,
    attachMentions,
    attachRadioGroup,
    attachSplitter,
    attachToolbar,
    attachTreePopup,
} from "./widget-keys";

function mount(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

// Sabotage listeners on the document are removed after each test, so they cannot leak.
let cleanups: (() => void)[] = [];
afterEach(() => {
    document.body.innerHTML = "";
    for (const cleanup of cleanups) cleanup();
    cleanups = [];
});

const rejects = (pattern: PatternName, html: string, message: RegExp, extra = {}) =>
    expect(runPattern(pattern, { root: mount(html), hook: "x", ...extra })).rejects.toThrow(
        message,
    );

describe("setup failures", () => {
    test.each([
        ["tabs", "tablist"],
        ["menu", "menu"],
        ["menubar", "menubar"],
        ["tree", "tree"],
        ["toolbar", "toolbar"],
        ["radio-group", "radiogroup"],
    ] as const)("%s without its container", async (pattern, role) => {
        await rejects(pattern, "<div></div>", new RegExp(`no \\[role="${role}"\\]`));
    });

    test("a roving container without a name", async () => {
        await rejects("menu", '<div role="menu"></div>', /has no name/);
    });

    test("a submenu contract without its container, or whose opener names nothing", async () => {
        await rejects("menu-submenu", "<div></div>", /no \[role="menu"\]/);
        await rejects(
            "menu-submenu",
            '<div role="menu"><div role="menuitem" aria-haspopup="menu" aria-controls="none">A</div></div>',
            /aria-controls names nothing/,
        );
    });

    test("a picker without its button, or whose button names no popup", async () => {
        await rejects("picker-listbox", "<div></div>", /no \.x-button/);
        await rejects(
            "picker-disclosure",
            '<div><button class="x-button" aria-expanded="false"></button></div>',
            /aria-controls must name it|aria-expanded/,
        );
    });
});

describe("inert widgets", () => {
    test("a roving menu that does not move focus", async () => {
        await rejects("menu", '<div role="menu" aria-label="M"></div>', /focus is on/);
    });

    test("a roving container with too few items", async () => {
        await rejects(
            "toolbar",
            '<div role="toolbar" aria-label="T"><button>One</button></div>',
            /needs three items|focus/,
        );
    });

    test("a submenu that never opens", async () => {
        await rejects(
            "menu-submenu",
            '<div role="menu" aria-label="M"></div>',
            /focus|aria-expanded/,
        );
    });

    test("a picker listbox that never opens", async () => {
        await rejects(
            "picker-listbox",
            `<div><button class="x-button" aria-haspopup="listbox" aria-expanded="false" aria-controls="l"></button>
             <div id="l" role="listbox" aria-label="L" hidden>
               <div id="o0" role="option" aria-selected="true">Apple</div>
               <div id="o1" role="option" aria-selected="false">Banana</div>
               <div id="o2" role="option" aria-selected="false">Cherry</div>
             </div></div>`,
            /aria-expanded is false|focus is on|aria-activedescendant/,
        );
    });

    test("a picker disclosure that never opens", async () => {
        await rejects(
            "picker-disclosure",
            '<div><button class="x-button" aria-expanded="false" aria-controls="p"></button><div id="p" hidden tabindex="-1"></div></div>',
            /aria-expanded is false/,
        );
    });

    test("a combobox that never opens", async () => {
        await rejects(
            "combobox",
            '<div><input role="combobox" aria-label="F" aria-expanded="false" aria-controls="l"><div role="listbox" id="l" aria-label="F" hidden></div></div>',
            /./,
            { open: () => {} },
        );
    });

    test("a tree popup that never opens", async () => {
        await rejects(
            "tree-popup",
            '<div><button class="x-trigger" role="combobox" aria-label="C" aria-haspopup="tree" aria-expanded="false"></button><div class="x-panel" hidden></div></div>',
            /./,
        );
    });

    test("mentions that never open", async () => {
        await rejects(
            "mentions",
            '<div><input role="combobox" aria-label="M" aria-expanded="false" aria-controls="ml"><div id="ml" hidden></div></div>',
            /./,
        );
    });

    test("a cropper that does not move", async () => {
        await rejects(
            "cropper",
            '<div class="x" tabindex="0" aria-label="Crop" data-crop-x="0" data-crop-y="0" data-crop-width="100" data-crop-height="100"></div>',
            /./,
        );
    });

    test("a splitter that does not move", async () => {
        await rejects(
            "splitter",
            '<div role="separator" tabindex="0" aria-label="P" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></div>',
            /./,
        );
    });

    test("a command palette that does nothing", async () => {
        await rejects(
            "command",
            '<div><input type="search" aria-label="A" aria-controls="cl"><div id="cl" role="listbox" aria-label="A"></div></div>',
            /./,
        );
    });

    test("a grid that does not move", async () => {
        await rejects(
            "grid",
            `<table role="grid" aria-label="D"><tbody>
              <tr><th tabindex="0">A</th><th tabindex="-1">B</th><th tabindex="-1">C</th></tr>
              <tr><td tabindex="-1">1</td><td tabindex="-1">2</td><td tabindex="-1">3</td></tr>
              <tr><td tabindex="-1">4</td><td tabindex="-1">5</td><td tabindex="-1">6</td></tr>
            </tbody></table>`,
            /./,
        );
        await rejects("grid-actions", '<table role="grid" aria-label="D"></table>', /./);
    });

    test("an autosuggest that never opens", async () => {
        await rejects(
            "autosuggest",
            `<div><input role="combobox" aria-label="F" aria-autocomplete="list" aria-expanded="false" aria-controls="fl">
             <ul id="fl" role="listbox" aria-label="F" hidden>
               <li id="f0" role="option" aria-selected="false">Apple</li>
               <li id="f1" role="option" aria-selected="false">Banana</li>
               <li id="f2" role="option" aria-selected="false">Cherry</li>
             </ul></div>`,
            /./,
        );
    });

    test("a tree item that does not expand", async () => {
        const root = mount('<li role="treeitem" aria-expanded="false" tabindex="0">B</li>');
        await expect(runPattern("tree-expand", { root, hook: "x" })).rejects.toThrow(/./);
    });

    test("a dialog that does not open modally", async () => {
        await rejects(
            "dialog",
            '<div><dialog aria-label="S"><button>In</button></dialog></div>',
            /./,
            {
                open: () => {},
            },
        );
    });
});

// Working widgets from the shared handlers, as in pattern-tester-direct.test.ts, for sabotage below.
function comboboxWidget(markup?: string) {
    const root = mount(
        markup ??
            `<div><input type="text" role="combobox" aria-label="Fruit" aria-expanded="false" aria-controls="list" aria-autocomplete="list"><div role="listbox" id="list" aria-label="Fruit" hidden></div></div>`,
    );
    const input = root.querySelector("input") as HTMLInputElement;
    const list = root.querySelector<HTMLElement>("#list");
    let open = false;
    const setOpen = (next: boolean) => {
        open = next;
        input.setAttribute("aria-expanded", String(next));
        if (list) list.hidden = !next;
    };
    if (list)
        attachCombobox(input, list, {
            open: () => open,
            setOpen,
            choose: (value) => {
                input.value = value;
            },
        });
    return { root, input, list: list!, open: () => setOpen(true) };
}

/** After the widget has handled each event of these types, run `fn`. */
function after(types: string[], fn: (event: Event) => void): void {
    for (const type of types) {
        document.addEventListener(type, fn);
        cleanups.push(() => document.removeEventListener(type, fn));
    }
}

/** Stop these keys reaching the widget at all, optionally doing something else instead. */
function swallow(keys: string[], instead?: (event: KeyboardEvent) => void): void {
    const stop = (event: KeyboardEvent) => {
        if (!keys.includes(event.key)) return;
        event.stopImmediatePropagation();
        instead?.(event);
    };
    document.addEventListener("keydown", stop, true);
    cleanups.push(() => document.removeEventListener("keydown", stop, true));
}

describe("combobox", () => {
    test("setup: each missing part is named", async () => {
        const broken = (attrs: string, list = 'role="listbox" aria-label="F"') =>
            `<div><input ${attrs} aria-controls="list"><div id="list" ${list} hidden></div></div>`;
        const run = (html: string) =>
            runPattern("combobox", { root: mount(html), hook: "x", open: () => {} });
        await expect(run("<div><input></div>")).rejects.toThrow(/no \[role="combobox"\]/);
        await expect(run('<div><input role="combobox" aria-controls="no"></div>')).rejects.toThrow(
            /names nothing/,
        );
        await expect(
            run(
                broken('role="combobox" aria-label="F" aria-autocomplete="list"', 'aria-label="F"'),
            ),
        ).rejects.toThrow(/lacks role="listbox"/);
        await expect(run(broken('role="combobox" aria-label="F"'))).rejects.toThrow(
            /aria-autocomplete/,
        );
        await expect(run(broken('role="combobox" aria-autocomplete="list"'))).rejects.toThrow(
            /input has no name/,
        );
        await expect(
            run(
                broken('role="combobox" aria-label="F" aria-autocomplete="list"', 'role="listbox"'),
            ),
        ).rejects.toThrow(/listbox has no name/);
    });

    test("without the open option", async () => {
        const { root } = comboboxWidget();
        await expect(runPattern("combobox", { root, hook: "x" })).rejects.toThrow(
            /needs the open option/,
        );
    });

    test("a list whose shown state disagrees with aria-expanded", async () => {
        const w = comboboxWidget();
        await expect(
            runPattern("combobox", {
                root: w.root,
                hook: "x",
                open: () => {
                    w.open();
                    w.list.hidden = true;
                },
            }),
        ).rejects.toThrow(/list shown is false/);
    });

    test("an Escape that is swallowed while closed", async () => {
        const w = comboboxWidget();
        after(["keydown"], (event) => event.preventDefault());
        await expect(
            runPattern("combobox", { root: w.root, hook: "x", open: w.open }),
        ).rejects.toThrow(/defaultPrevented is true, not false/);
    });

    test("a highlight with no aria-activedescendant, or a stray one", async () => {
        let w = comboboxWidget();
        after(["keydown"], () => w.input.removeAttribute("aria-activedescendant"));
        await expect(
            runPattern("combobox", { root: w.root, hook: "x", open: w.open }),
        ).rejects.toThrow(/aria-activedescendant is null/);
        document.body.innerHTML = "";
        w = comboboxWidget();
        await expect(
            runPattern("combobox", {
                root: w.root,
                hook: "x",
                open: () => {
                    w.open();
                    w.input.setAttribute("aria-activedescendant", "stray");
                },
            }),
        ).rejects.toThrow(/aria-activedescendant is stray/);
    });

    test("every option selected", async () => {
        const w = comboboxWidget();
        after(["keydown"], () =>
            w.list
                .querySelectorAll("[role=option]")
                .forEach((o) => o.setAttribute("aria-selected", "true")),
        );
        await expect(
            runPattern("combobox", { root: w.root, hook: "x", open: w.open }),
        ).rejects.toThrow(/option\(s\) have aria-selected="true"/);
    });

    test("a choice that does not reach the input", async () => {
        const w = comboboxWidget();
        after(["keydown"], (event) => {
            if ((event as KeyboardEvent).key === "Enter") w.input.value = "";
        });
        await expect(
            runPattern("combobox", { root: w.root, hook: "x", open: w.open }),
        ).rejects.toThrow(/the input holds ""/);
    });
});

describe("setup failures of the other runners", () => {
    test.each([
        ["mentions", "<div><input></div>", /no \[role="combobox"\]/],
        [
            "mentions",
            '<div><input role="combobox" aria-controls="m"><div id="m"></div></div>',
            /input has no name/,
        ],
        ["mentions", '<div><input role="combobox" aria-label="M"></div>', /names nothing/],
        ["cropper", '<div tabindex="0"></div>', /it has no name/],
        ["cropper", '<div aria-label="C"></div>', /not focusable/],
        ["splitter", "<div></div>", /no \[role="separator"\]/],
        ["splitter", '<div><div role="separator"></div></div>', /separator is not focusable/],
        ["command", "<div><input></div>", /no input\[type="search"\]/],
        [
            "command",
            '<div><input type="search" aria-controls="c"><div id="c" role="listbox" aria-label="C"></div></div>',
            /input has no name/,
        ],
        ["command", '<div><input type="search" aria-label="C"></div>', /names nothing/],
        [
            "command",
            '<div><input type="search" aria-label="C" aria-controls="c"><div id="c" aria-label="C"></div></div>',
            /lacks role="listbox"/,
        ],
        [
            "command",
            '<div><input type="search" aria-label="C" aria-controls="c"><div id="c" role="listbox"></div></div>',
            /listbox has no name/,
        ],
        ["grid", "<div></div>", /no \[role="grid"\]/],
        ["grid", '<table role="grid"></table>', /grid has no name/],
        ["autosuggest", "<div><input></div>", /no \[role="combobox"\]/],
        [
            "autosuggest",
            '<div><input role="combobox" aria-label="A" aria-controls="a"><ul id="a" role="listbox" aria-label="A"></ul></div>',
            /aria-autocomplete/,
        ],
        [
            "autosuggest",
            '<div><input role="combobox" aria-autocomplete="list" aria-controls="a"><ul id="a" role="listbox" aria-label="A"></ul></div>',
            /input has no name/,
        ],
        [
            "autosuggest",
            '<div><input role="combobox" aria-label="A" aria-autocomplete="list"></div>',
            /names nothing/,
        ],
        [
            "autosuggest",
            '<div><input role="combobox" aria-label="A" aria-autocomplete="list" aria-controls="a"><ul id="a" aria-label="A"></ul></div>',
            /lacks role="listbox"/,
        ],
        [
            "autosuggest",
            '<div><input role="combobox" aria-label="A" aria-autocomplete="list" aria-controls="a"><ul id="a" role="listbox"></ul></div>',
            /listbox has no name/,
        ],
        [
            "tree-expand",
            '<div><li role="treeitem" aria-expanded="false" tabindex="0">B</li></div>',
            /needs a parent treeitem/,
        ],
        ["dialog", "<div><dialog></dialog></div>", /needs the open option/],
    ] as [PatternName, string, RegExp][])("%s: %s", async (pattern, html, message) => {
        let root = mount(html);
        if (pattern === "tree-expand") root = root.firstElementChild as HTMLElement;
        await expect(runPattern(pattern, { root, hook: "x" })).rejects.toThrow(message);
    });

    test("tree-popup: each missing part is named", async () => {
        const run = (html: string) => runPattern("tree-popup", { root: mount(html), hook: "x" });
        await expect(run("<div></div>")).rejects.toThrow(/./);
        await expect(
            run(
                '<div><button class="x-trigger" role="combobox" aria-haspopup="tree" aria-expanded="false"></button><div class="x-panel" hidden></div></div>',
            ),
        ).rejects.toThrow(/./);
    });

    test("picker-listbox: the listbox's own parts are checked", async () => {
        const picker = (button: string, list: string, options: string) =>
            `<div><button class="x-button" ${button} aria-expanded="false" aria-controls="l"></button><div id="l" ${list} hidden>${options}</div></div>`;
        const three =
            '<div id="a" role="option" aria-selected="true">Apple</div><div id="b" role="option" aria-selected="false">Banana</div><div id="c" role="option" aria-selected="false">Cherry</div>';
        const run = (html: string) =>
            runPattern("picker-listbox", { root: mount(html), hook: "x" });
        await expect(run(picker("", 'role="listbox" aria-label="L"', three))).rejects.toThrow(
            /aria-haspopup="listbox"/,
        );
        await expect(
            run(picker('aria-haspopup="listbox"', 'aria-label="L"', three)),
        ).rejects.toThrow(/lacks role="listbox"/);
        await expect(
            run(picker('aria-haspopup="listbox"', 'role="listbox"', three)),
        ).rejects.toThrow(/listbox has no name/);
        await expect(
            run(
                picker(
                    'aria-haspopup="listbox"',
                    'role="listbox" aria-label="L"',
                    '<div role="option" aria-selected="true">A</div>',
                ),
            ),
        ).rejects.toThrow(/needs three options/);
        await expect(
            run(
                picker(
                    'aria-haspopup="listbox"',
                    'role="listbox" aria-label="L"',
                    three.replace("Banana", "Avocado"),
                ),
            ),
        ).rejects.toThrow(/different letters/);
        await expect(
            run(
                picker(
                    'aria-haspopup="listbox"',
                    'role="listbox" aria-label="L"',
                    three.replace('aria-selected="false"', ""),
                ),
            ),
        ).rejects.toThrow(/aria-selected=null/);
        await expect(
            run(
                picker(
                    'aria-haspopup="listbox"',
                    'role="listbox" aria-label="L"',
                    three.replace('aria-selected="true"', 'aria-selected="false"'),
                ),
            ),
        ).rejects.toThrow(/selected option\(s\) \[\]/);
        // Open, but hidden: a popup whose hidden state disagrees with aria-expanded.
        await expect(
            run(
                '<div><button class="x-button" aria-haspopup="listbox" aria-expanded="true" aria-controls="l"></button><div id="l" role="listbox" aria-label="L" hidden></div></div>',
            ),
        ).rejects.toThrow(/aria-expanded is true/);
        await expect(
            run(
                `<div><button class="x-button" aria-haspopup="listbox" aria-expanded="false" aria-controls="l"></button><div id="l" role="listbox" aria-label="L">${three}</div></div>`,
            ),
        ).rejects.toThrow(/popup hidden is false/);
    });
});

describe("sabotaged widgets", () => {
    function splitterWidget() {
        const root = mount(
            '<div class="splitter" role="separator" tabindex="0" aria-label="Panes" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></div>',
        );
        attachSplitter(root);
        return root;
    }

    test("a splitter that does not prevent its keys, or moves wrongly", async () => {
        let root = splitterWidget();
        swallow(["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"]);
        await expect(runPattern("splitter", { root, hook: "x" })).rejects.toThrow(
            /aria-valuenow is 50, not 51/,
        );
        for (const c of cleanups) c();
        cleanups = [];
        root = splitterWidget();
        // Handled but never prevented: stop the handler and change the value by hand.
        swallow(["ArrowRight", "ArrowDown"], () => root.setAttribute("aria-valuenow", "51"));
        await expect(runPattern("splitter", { root, hook: "x" })).rejects.toThrow(
            /defaultPrevented is false/,
        );
    });

    test("a cropper whose key is not prevented", async () => {
        const root = mount(
            '<div class="image-cropper" tabindex="0" aria-label="Crop" data-crop-x="0" data-crop-y="0" data-crop-width="100" data-crop-height="100"></div>',
        );
        attachCropper(root);
        swallow(["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"]);
        await expect(runPattern("cropper", { root, hook: "x" })).rejects.toThrow(
            /defaultPrevented is false/,
        );
        expect(root.getAttribute("data-crop-x")).toBe("0");
    });

    test("a cropper that moves the wrong way", async () => {
        const root = mount(
            '<div class="image-cropper" tabindex="0" aria-label="Crop" data-crop-x="0" data-crop-y="0" data-crop-width="100" data-crop-height="100"></div>',
        );
        attachCropper(root);
        after(["keydown"], () => root.setAttribute("data-crop-x", "99"));
        await expect(runPattern("cropper", { root, hook: "x" })).rejects.toThrow(
            /data-crop-x is 99/,
        );
    });

    function commandWidget() {
        const root = mount(`<div class="command">
            <input type="search" aria-label="Actions" aria-controls="command-list">
            <div id="command-list" role="listbox" aria-label="Actions"></div>
        </div>`);
        const input = root.querySelector("input")!;
        const list = root.querySelector<HTMLElement>("[role=listbox]")!;
        attachCommand(input, list);
        return { root, input, list };
    }

    test("a command palette that prevents every key", async () => {
        const { root } = commandWidget();
        after(["keydown"], (event) => event.preventDefault());
        await expect(runPattern("command", { root, hook: "x" })).rejects.toThrow(
            /defaultPrevented is true, not false/,
        );
    });

    test("a command palette with a stray highlight, a wrong one, too many selected, or no click", async () => {
        let w = commandWidget();
        w.input.setAttribute("aria-activedescendant", "stray");
        await expect(runPattern("command", { root: w.root, hook: "x" })).rejects.toThrow(
            /aria-activedescendant is stray/,
        );

        w = commandWidget();
        after(["keydown"], () => w.input.removeAttribute("aria-activedescendant"));
        await expect(runPattern("command", { root: w.root, hook: "x" })).rejects.toThrow(
            /aria-activedescendant is null|aria-activedescendant is undefined/,
        );
        for (const c of cleanups) c();
        cleanups = [];

        w = commandWidget();
        after(["keydown"], () =>
            w.list
                .querySelectorAll("[role=option]")
                .forEach((o) => o.setAttribute("aria-selected", "true")),
        );
        await expect(runPattern("command", { root: w.root, hook: "x" })).rejects.toThrow(
            /option\(s\) have aria-selected/,
        );
        for (const c of cleanups) c();
        cleanups = [];

        w = commandWidget();
        const stopClick = (event: Event) => event.stopImmediatePropagation();
        w.list.addEventListener("click", stopClick, true);
        // The tester listens on the list too; a capture listener on the option's ancestors cannot stop a listener on
        // the same node, so stop it at the document instead.
        document.addEventListener("click", stopClick, true);
        cleanups.push(() => document.removeEventListener("click", stopClick, true));
        await expect(runPattern("command", { root: w.root, hook: "x" })).rejects.toThrow(
            /was not clicked/,
        );
    });

    function gridWidget() {
        const root = mount(`<table role="grid" aria-label="Data"><tbody>
            <tr><th tabindex="0">Alpha</th><th tabindex="-1">Beta</th><th tabindex="-1">Gamma</th></tr>
            <tr><td tabindex="-1">A1</td><td tabindex="-1">B1</td><td tabindex="-1">C1</td></tr>
            <tr><td tabindex="-1">A2</td><td tabindex="-1">B2</td><td tabindex="-1">C2</td></tr>
            <tr><td tabindex="-1">A3</td><td tabindex="-1">B3</td><td tabindex="-1">C3</td></tr>
        </tbody></table>`);
        attachGrid(root);
        return root;
    }

    test("a grid that loses focus, or keeps two tab stops", async () => {
        let root = gridWidget();
        after(["keydown"], () => (document.activeElement as HTMLElement).blur());
        await expect(runPattern("grid", { root, hook: "x" })).rejects.toThrow(/focus is on/);
        for (const c of cleanups) c();
        cleanups = [];
        root = gridWidget();
        after(["keydown"], () => root.querySelectorAll("td").forEach((td) => (td.tabIndex = 0)));
        await expect(runPattern("grid", { root, hook: "x" })).rejects.toThrow(/tab stop\(s\)/);
    });

    function menuWidget() {
        const root = mount('<div role="menu" aria-label="Sections"></div>');
        attachMenu(root, "vertical");
        return root;
    }

    test("a roving menu that loses focus, or does not activate", async () => {
        let root = menuWidget();
        after(["keydown"], () => (document.activeElement as HTMLElement).blur());
        await expect(runPattern("menu", { root, hook: "x" })).rejects.toThrow(
            /focus left the widget|focus is on/,
        );
        for (const c of cleanups) c();
        cleanups = [];
        root = menuWidget();
        swallow(["Enter", " "]);
        await expect(runPattern("menu", { root, hook: "x" })).rejects.toThrow(/was not activated/);
    });

    test("a toolbar with two tab stops", async () => {
        const root = mount(
            '<div role="toolbar" aria-label="Tools"><button type="button">One</button><button type="button">Two</button><button type="button">Three</button></div>',
        );
        attachToolbar(root);
        after(["keydown"], () =>
            root.querySelectorAll("button").forEach((el) => (el.tabIndex = 0)),
        );
        await expect(runPattern("toolbar", { root, hook: "x" })).rejects.toThrow(
            /2 tab stop|3 tab stop/,
        );
    });

    test("a radio group whose check does not follow focus", async () => {
        const root = mount('<div role="radiogroup" aria-label="Choice"></div>');
        attachRadioGroup(root);
        const uncheck = () =>
            root
                .querySelectorAll("[role=radio]")
                .forEach((el) => el.setAttribute("aria-checked", "false"));
        root.addEventListener("focusin", () => queueMicrotask(uncheck));
        await expect(runPattern("radio-group", { root, hook: "x" })).rejects.toThrow(/checked/);
    });

    test("a submenu whose shown state or aria-expanded is wrong, or that loses focus", async () => {
        let root = menuWidget();
        // Escape closes it, but the submenu stays on screen.
        after(["keydown"], (event) => {
            const sub = root.querySelector<HTMLElement>("[role=menu]");
            if (sub && (event as KeyboardEvent).key === "Escape") sub.hidden = false;
        });
        await expect(runPattern("menu-submenu", { root, hook: "x" })).rejects.toThrow(
            /submenu shown is/,
        );
        for (const c of cleanups) c();
        cleanups = [];
        root = menuWidget();
        after(["keydown"], () =>
            root.querySelector("[aria-haspopup]")?.setAttribute("aria-expanded", "maybe"),
        );
        await expect(runPattern("menu-submenu", { root, hook: "x" })).rejects.toThrow(
            /aria-expanded is maybe/,
        );
        for (const c of cleanups) c();
        cleanups = [];
        root = menuWidget();
        after(["keydown"], () => (document.activeElement as HTMLElement).blur());
        await expect(runPattern("menu-submenu", { root, hook: "x" })).rejects.toThrow(
            /focus left the widget|focus is on/,
        );
        for (const c of cleanups) c();
        cleanups = [];
        root = menuWidget();
        root.innerHTML =
            '<div role="menuitem" aria-haspopup="menu" aria-controls="s">Opener</div><div role="menu" id="s" hidden></div>';
        await expect(runPattern("menu-submenu", { root, hook: "x" })).rejects.toThrow(
            /no item "Two"/,
        );
    });

    function treePopupWidget() {
        const root = mount(`<div class="tree-select">
            <button class="tree-select-trigger" role="combobox" aria-label="Choose" aria-haspopup="tree" aria-expanded="false"></button>
            <div class="tree-select-panel" hidden></div>
        </div>`);
        attachTreePopup(root);
        return root;
    }

    test("a tree popup that loses focus, misreports, or prevents nothing", async () => {
        const cases: [(root: HTMLElement) => void, RegExp][] = [
            [
                () => after(["keydown"], () => (document.activeElement as HTMLElement).blur()),
                /focus/,
            ],
            [
                (root) =>
                    after(["keydown"], () => {
                        const panel = root.querySelector<HTMLElement>(".tree-select-panel")!;
                        panel.hidden = !panel.hidden;
                    }),
                /panel shown is/,
            ],
            [
                (root) =>
                    after(["keydown"], () =>
                        root
                            .querySelectorAll("[role=treeitem]")
                            .forEach((el) => el.removeAttribute("aria-selected")),
                    ),
                /is not selected/,
            ],
            // ArrowLeft moves to the parent, then fails to close the branch.
            [
                (root) =>
                    after(["keydown"], (event) => {
                        if ((event as KeyboardEvent).key !== "ArrowLeft") return;
                        [...root.querySelectorAll("[role=treeitem]")]
                            .find(
                                (el) =>
                                    el.firstChild?.textContent?.trim() === "Fruit" ||
                                    el.textContent?.trim().startsWith("Fruit"),
                            )
                            ?.setAttribute("aria-expanded", "true");
                    }),
                /branch's aria-expanded is not false/,
            ],
        ];
        for (const [sabotage, message] of cases) {
            const root = treePopupWidget();
            sabotage(root);
            await expect(runPattern("tree-popup", { root, hook: "tree-select" })).rejects.toThrow(
                message,
            );
            for (const c of cleanups) c();
            cleanups = [];
        }
        const root = treePopupWidget();
        // Enter does what it should, but never prevents the key.
        swallow(["Enter"], () => {
            const trigger = root.querySelector<HTMLElement>(".tree-select-trigger")!;
            trigger.setAttribute("aria-expanded", "false");
            root.querySelector<HTMLElement>(".tree-select-panel")!.hidden = true;
            [...root.querySelectorAll("[role=treeitem]")]
                .find((el) => el.textContent?.trim() === "Tea")
                ?.setAttribute("aria-selected", "true");
            trigger.focus();
        });
        await expect(runPattern("tree-popup", { root, hook: "tree-select" })).rejects.toThrow(
            /defaultPrevented is false/,
        );
    });

    function mentionsWidget() {
        const root = mount(`<div class="mentions-input">
            <input role="combobox" aria-label="Mention" aria-expanded="false" aria-controls="mentions-list">
            <div id="mentions-list" hidden></div>
        </div>`);
        attachMentions(root);
        return root;
    }

    test("mentions that misreport", async () => {
        const cases: [(root: HTMLElement) => void, RegExp][] = [
            [
                () => after(["keydown", "input"], (event) => event.preventDefault()),
                /defaultPrevented/,
            ],
            [
                (root) =>
                    after(["keydown", "input"], () =>
                        root.querySelector("input")!.setAttribute("aria-activedescendant", "stray"),
                    ),
                /aria-activedescendant is stray/,
            ],
            [
                (root) =>
                    after(["keydown", "input"], () =>
                        root.querySelector("input")!.setAttribute("aria-expanded", "maybe"),
                    ),
                /aria-expanded is maybe/,
            ],
            [
                (root) =>
                    after(["keydown", "input"], () => {
                        const p = root.querySelector<HTMLElement>("#mentions-list")!;
                        p.hidden = !p.hidden;
                    }),
                /shown is/,
            ],
        ];
        for (const [sabotage, message] of cases) {
            const root = mentionsWidget();
            sabotage(root);
            await expect(runPattern("mentions", { root, hook: "mentions-input" })).rejects.toThrow(
                message,
            );
            for (const c of cleanups) c();
            cleanups = [];
        }
    });

    test("a dialog that does not report modal, is unnamed, keeps focus out, or does not return it", async () => {
        const make = (attrs: string, inside = "<button>In</button>") => {
            const root = mount(`<div><dialog ${attrs}>${inside}</dialog></div>`);
            const dialog = root.querySelector("dialog")!;
            dialog.addEventListener("cancel", (event) => {
                event.preventDefault();
                dialog.close();
            });
            return { root, dialog };
        };
        let w = make('aria-label="S"');
        await expect(
            runPattern("dialog", { root: w.root, hook: "x", open: () => w.dialog.showModal() }),
        ).rejects.toThrow(/aria-modal/);
        w = make('aria-modal="true"');
        await expect(
            runPattern("dialog", { root: w.root, hook: "x", open: () => w.dialog.showModal() }),
        ).rejects.toThrow(/name/);
        w = make('aria-label="S" aria-modal="true"');
        await expect(
            runPattern("dialog", {
                root: w.root,
                hook: "x",
                open: () => w.dialog.setAttribute("open", ""),
            }),
        ).rejects.toThrow(/showModal\(\) was not called/);
        w = make('aria-label="S" aria-modal="true"');
        await expect(
            runPattern("dialog", {
                root: w.root,
                hook: "x",
                open: () => {
                    w.dialog.showModal();
                    (document.activeElement as HTMLElement).blur();
                },
            }),
        ).rejects.toThrow(/focus/);
        w = make('aria-label="S" aria-modal="true"');
        w.dialog.addEventListener("close", () =>
            queueMicrotask(() => (document.activeElement as HTMLElement)?.blur()),
        );
        after(["keydown"], () =>
            queueMicrotask(() => (document.activeElement as HTMLElement)?.blur()),
        );
        await expect(
            runPattern("dialog", { root: w.root, hook: "x", open: () => w.dialog.showModal() }),
        ).rejects.toThrow(/focus|open is/);
    });

    test("a tree item that expands but loses focus", async () => {
        const parent = mount('<li role="treeitem" tabindex="-1">Parent</li>');
        const branch = document.createElement("li");
        branch.setAttribute("role", "treeitem");
        branch.setAttribute("aria-expanded", "false");
        branch.tabIndex = 0;
        parent.append(branch);
        branch.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") branch.setAttribute("aria-expanded", "true");
            parent.focus();
        });
        await expect(runPattern("tree-expand", { root: branch, hook: "x" })).rejects.toThrow(/./);
    });
});
