// @vitest-environment jsdom
// Exercise the pattern tester through the same framework-neutral handlers that the catalogs ship. The package suites
// run these contracts through rendered components; these direct cases keep coverage of the harness visible in shared/.
import { afterEach, describe, test } from "vitest";

import { attachCommand } from "./command-keys";
import { attachMenu } from "./menu-keys";
import { runPattern } from "./pattern-tester";
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

afterEach(() => {
    document.body.innerHTML = "";
});

describe("pattern tester through shared handlers", () => {
    test("menu and submenu", async () => {
        const root = mount('<div role="menu" aria-label="Sections"></div>');
        const detach = attachMenu(root, "vertical");
        await runPattern("menu", { root, hook: "menu" });
        root.innerHTML = "";
        await runPattern("menu-submenu", { root, hook: "menu" });
        detach();
    });

    test("toolbar and radio group", async () => {
        const toolbar = mount('<div role="toolbar" aria-label="Tools"></div>');
        toolbar.innerHTML =
            '<button type="button">One</button><button type="button">Two</button><button type="button">Three</button>';
        const detachToolbar = attachToolbar(toolbar);
        await runPattern("toolbar", { root: toolbar, hook: "toolbar" });
        detachToolbar();

        const radios = mount('<div role="radiogroup" aria-label="Choice"></div>');
        const detachRadios = attachRadioGroup(radios);
        await runPattern("radio-group", { root: radios, hook: "radio-group" });
        detachRadios();
    });

    test("tree popup", async () => {
        const root = mount(`<div class="tree-select">
            <button class="tree-select-trigger" role="combobox" aria-label="Choose" aria-haspopup="tree" aria-expanded="false"></button>
            <div class="tree-select-panel" hidden></div>
        </div>`);
        const detach = attachTreePopup(root);
        await runPattern("tree-popup", { root, hook: "tree-select" });
        detach();
    });

    test("mentions", async () => {
        const root = mount(`<div class="mentions-input">
            <input role="combobox" aria-label="Mention" aria-expanded="false" aria-controls="mentions-list">
            <div id="mentions-list" hidden></div>
        </div>`);
        const detach = attachMentions(root);
        await runPattern("mentions", { root, hook: "mentions-input" });
        detach();
    });

    test("cropper", async () => {
        const root = mount(
            '<div class="image-cropper" tabindex="0" aria-label="Crop" data-crop-x="0" data-crop-y="0" data-crop-width="100" data-crop-height="100"></div>',
        );
        const detach = attachCropper(root);
        await runPattern("cropper", { root, hook: "image-cropper" });
        detach();
    });

    test("splitter", async () => {
        const root = mount(
            '<div class="splitter" role="separator" tabindex="0" aria-label="Panes" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></div>',
        );
        const detach = attachSplitter(root);
        await runPattern("splitter", { root, hook: "splitter" });
        detach();
    });

    test("command", async () => {
        const root = mount(`<div class="command">
            <input type="search" aria-label="Actions" aria-controls="command-list">
            <div id="command-list" role="listbox" aria-label="Actions"></div>
        </div>`);
        const input = root.querySelector("input")!;
        const list = root.querySelector<HTMLElement>("[role=listbox]")!;
        const detach = attachCommand(input, list);
        await runPattern("command", { root, hook: "command" });
        detach();
    });

    test("plain grid", async () => {
        const root = mount(`<table role="grid" aria-label="Data"><tbody>
            <tr><th tabindex="0">Alpha</th><th tabindex="-1">Beta</th><th tabindex="-1">Gamma</th></tr>
            <tr><td tabindex="-1">A1</td><td tabindex="-1">B1</td><td tabindex="-1">C1</td></tr>
            <tr><td tabindex="-1">A2</td><td tabindex="-1">B2</td><td tabindex="-1">C2</td></tr>
            <tr><td tabindex="-1">A3</td><td tabindex="-1">B3</td><td tabindex="-1">C3</td></tr>
        </tbody></table>`);
        const detach = attachGrid(root);
        await runPattern("grid", { root, hook: "grid" });
        detach();
    });

    test("autosuggest", async () => {
        const root = mount(`<div class="autosuggest">
            <input role="combobox" aria-label="Fruit" aria-autocomplete="list" aria-expanded="false" aria-controls="fruit-list">
            <ul id="fruit-list" role="listbox" aria-label="Fruit" hidden>
                <li id="fruit-0" role="option" aria-selected="false">Apple</li>
                <li id="fruit-1" role="option" aria-selected="false">Banana</li>
                <li id="fruit-2" role="option" aria-selected="false">Cherry</li>
            </ul>
        </div>`);
        const input = root.querySelector<HTMLInputElement>("input")!;
        const list = root.querySelector<HTMLElement>("[role=listbox]")!;
        const options = [...list.querySelectorAll<HTMLElement>("[role=option]")];
        let active = -1;
        let open = false;
        const render = () => {
            input.setAttribute("aria-expanded", String(open));
            list.hidden = !open;
            options.forEach((option, index) =>
                option.setAttribute("aria-selected", String(index === active)),
            );
            if (active < 0) input.removeAttribute("aria-activedescendant");
            else input.setAttribute("aria-activedescendant", options[active].id);
        };
        input.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !open) return;
            if (event.altKey && event.key === "ArrowDown") {
                open = true;
            } else if (event.altKey && event.key === "ArrowUp") {
                open = false;
                active = -1;
            } else if (event.key === "ArrowDown") {
                active = open ? (active + 1) % options.length : 0;
                open = true;
            } else if (event.key === "ArrowUp") {
                active = open && active > 0 ? active - 1 : options.length - 1;
                open = true;
            } else if (event.key === "Home" && open) active = 0;
            else if (event.key === "End" && open) active = options.length - 1;
            else if (event.key === "Enter" && open && active >= 0) {
                input.value = options[active].textContent ?? "";
                open = false;
                active = -1;
            } else if (event.key === "Escape" && open) {
                open = false;
                active = -1;
            } else return;
            event.preventDefault();
            render();
        });
        await runPattern("autosuggest", { root, hook: "autosuggest" });
    });

    test("tree expansion", async () => {
        const parent = mount('<li role="treeitem" tabindex="-1">Parent</li>');
        const branch = document.createElement("li");
        branch.setAttribute("role", "treeitem");
        branch.setAttribute("aria-expanded", "false");
        branch.tabIndex = 0;
        parent.append(branch);
        branch.addEventListener("keydown", (event) => {
            const child = branch.querySelector<HTMLElement>('[role="treeitem"]');
            if (event.key === "ArrowRight") {
                if (branch.getAttribute("aria-expanded") === "false")
                    branch.setAttribute("aria-expanded", "true");
                else child?.focus();
                event.preventDefault();
            } else if (event.key === "ArrowLeft") {
                if (branch.getAttribute("aria-expanded") === "true")
                    branch.setAttribute("aria-expanded", "false");
                else parent.focus();
                event.preventDefault();
            }
        });
        await runPattern("tree-expand", { root: branch, hook: "tree-list-item" });
    });

    test("native modal dialog", async () => {
        const root = mount(
            '<div><dialog aria-label="Settings" aria-modal="true"><button type="button">Inside</button></dialog></div>',
        );
        const dialog = root.querySelector<HTMLDialogElement>("dialog")!;
        dialog.addEventListener("cancel", (event) => {
            event.preventDefault();
            dialog.close();
        });
        await runPattern("dialog", {
            root,
            hook: "dialog",
            open: () => dialog.showModal(),
        });
    });

    test("picker disclosure", async () => {
        const root = mount(`<div class="share-picker">
            <button class="share-picker-button" aria-expanded="false" aria-controls="share-popup">Share</button>
            <div id="share-popup" hidden tabindex="-1">Content</div>
        </div>`);
        const button = root.querySelector<HTMLButtonElement>("button")!;
        const popup = root.querySelector<HTMLElement>("#share-popup")!;
        const setOpen = (open: boolean) => {
            button.setAttribute("aria-expanded", String(open));
            popup.hidden = !open;
        };
        button.addEventListener("click", () =>
            setOpen(button.getAttribute("aria-expanded") !== "true"),
        );
        popup.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") return;
            setOpen(false);
            button.focus();
        });
        await runPattern("picker-disclosure", { root, hook: "share-picker" });
    });

    test("picker listbox", async () => {
        const root = mount(`<div class="theme-picker">
            <button class="theme-picker-button" aria-haspopup="listbox" aria-expanded="false" aria-controls="theme-list">Theme</button>
            <div id="theme-list" role="listbox" aria-label="Theme" hidden tabindex="-1">
                <div id="theme-0" role="option" aria-selected="true">Apple</div>
                <div id="theme-1" role="option" aria-selected="false">Banana</div>
                <div id="theme-2" role="option" aria-selected="false">Cherry</div>
            </div>
        </div>`);
        const button = root.querySelector<HTMLButtonElement>("button")!;
        const list = root.querySelector<HTMLElement>("[role=listbox]")!;
        const options = [...list.querySelectorAll<HTMLElement>("[role=option]")];
        let active = 0;
        const mark = () => {
            list.setAttribute("aria-activedescendant", options[active].id);
            options.forEach((option, index) =>
                option.toggleAttribute("data-active", index === active),
            );
        };
        const open = (index: number) => {
            active = index;
            button.setAttribute("aria-expanded", "true");
            list.hidden = false;
            mark();
            list.focus();
        };
        const close = () => {
            button.setAttribute("aria-expanded", "false");
            list.hidden = true;
            button.focus();
        };
        button.addEventListener("keydown", (event) => {
            const selected = options.findIndex(
                (option) => option.getAttribute("aria-selected") === "true",
            );
            if (event.key === "ArrowDown" || event.key === "Enter") open(selected);
            else if (event.key === "ArrowUp") open(options.length - 1);
        });
        list.addEventListener("keydown", (event) => {
            if (event.key === "ArrowDown") active = Math.min(options.length - 1, active + 1);
            else if (event.key === "ArrowUp") active = Math.max(0, active - 1);
            else if (event.key === "Home") active = 0;
            else if (event.key === "End") active = options.length - 1;
            else if (event.key === "Escape") return close();
            else if (event.key === "Enter" || event.key === " ") {
                options.forEach((option, index) =>
                    option.setAttribute("aria-selected", String(index === active)),
                );
                return close();
            } else {
                const typed = event.key.toLocaleLowerCase();
                const found = options.findIndex((option) =>
                    option.textContent?.trim().toLocaleLowerCase().startsWith(typed),
                );
                if (found >= 0) active = found;
            }
            mark();
        });
        await runPattern("picker-listbox", { root, hook: "theme-picker" });
    });
});
