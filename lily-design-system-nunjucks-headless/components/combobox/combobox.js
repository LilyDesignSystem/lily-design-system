// Generated from shared/combobox-client.js by bin/sync-shared-modules; edit the shared module, never this copy.
// combobox-client.js: the behaviour of shared/combobox-keys.ts as a plain ES module, for the catalogs with no build
// step of their own (Nunjucks) or none that reaches TypeScript (Blazor, where this file is Combobox.razor.js). The
// `combobox` contract in shared/pattern-contracts.json holds it to the same steps. Edit shared/, never a copy.
//
//   import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/combobox/combobox.js";
//   autoInit();
//
// Every `.combobox` gets the keys. Choosing writes the value into the input and dispatches a bubbling
// "combobox-select" CustomEvent with { value }; closing dispatches "combobox-close". Filtering is the consumer's.

const allOptions = (list) => [...list.querySelectorAll('[role="option"]')];
const usable = (list) =>
    allOptions(list).filter((o) => !o.hidden && o.getAttribute("aria-disabled") !== "true");
const optionValue = (option) => option.dataset.value ?? (option.textContent ?? "").trim();
const isOpen = (input) => input.getAttribute("aria-expanded") === "true";

function setActive(input, list, option) {
    allOptions(list).forEach((el, index) => {
        if (el === option && !el.id) el.id = `${list.id}-option-${index}`;
        el.setAttribute("aria-selected", String(el === option));
        el.toggleAttribute("data-active", el === option);
    });
    if (option) {
        input.setAttribute("aria-activedescendant", option.id);
        option.scrollIntoView?.({ block: "nearest" });
    } else input.removeAttribute("aria-activedescendant");
}

/** Wire one combobox. `host.setOpen(open)` shows or hides the list; `host.choose(value)` takes the chosen value. */
export function attach(input, list, host) {
    const setOpen = (open) => {
        input.setAttribute("aria-expanded", String(open));
        host.setOpen(open);
    };
    const close = () => {
        setActive(input, list, null);
        setOpen(false);
    };
    const choose = (option) => {
        host.choose(optionValue(option));
        close();
    };

    function onKeydown(event) {
        if (event.isComposing) return;
        const open = isOpen(input);
        const options = usable(list);
        const index = options.findIndex(
            (o) => o.id !== "" && o.id === input.getAttribute("aria-activedescendant"),
        );
        const move = (option) => {
            event.preventDefault();
            if (!open) setOpen(true);
            setActive(input, list, option);
        };

        switch (event.key) {
            case "ArrowDown":
                if (event.altKey) {
                    if (open || options.length === 0) return;
                    event.preventDefault();
                    setOpen(true);
                } else if (options.length > 0) {
                    move(options[open ? (index + 1) % options.length : 0]);
                }
                break;
            case "ArrowUp":
                if (event.altKey) {
                    if (!open) return;
                    event.preventDefault();
                    close();
                } else if (options.length > 0) {
                    move(options[open && index > 0 ? index - 1 : options.length - 1]);
                }
                break;
            case "Home":
                if (open && options.length > 0) move(options[0]);
                break;
            case "End":
                if (open && options.length > 0) move(options[options.length - 1]);
                break;
            case "Enter":
                if (open && index >= 0) {
                    event.preventDefault();
                    choose(options[index]);
                }
                break;
            case "Escape":
                if (open) {
                    event.preventDefault();
                    close();
                }
                break;
        }
    }
    function onInput() {
        setActive(input, list, null);
        if (!isOpen(input)) setOpen(true);
    }
    function onBlur() {
        if (isOpen(input)) close();
    }
    function onMousedown(event) {
        event.preventDefault();
    }
    function onClick(event) {
        const option = event.target.closest('[role="option"]');
        if (option && option.getAttribute("aria-disabled") !== "true") choose(option);
    }

    input.addEventListener("keydown", onKeydown);
    input.addEventListener("input", onInput);
    input.addEventListener("blur", onBlur);
    list.addEventListener("mousedown", onMousedown);
    list.addEventListener("click", onClick);
    return {
        /** The host closed the list itself: drop the highlight. */
        clear() {
            setActive(input, list, null);
        },
        dispose() {
            input.removeEventListener("keydown", onKeydown);
            input.removeEventListener("input", onInput);
            input.removeEventListener("blur", onBlur);
            list.removeEventListener("mousedown", onMousedown);
            list.removeEventListener("click", onClick);
        },
    };
}

/** Blazor: the state is C#'s, so the module reports to it. */
export function attachDotNet(input, list, dotnet) {
    return attach(input, list, {
        setOpen: (open) => dotnet.invokeMethodAsync("OnComboboxOpen", open),
        choose: (value) => dotnet.invokeMethodAsync("OnComboboxChoose", value),
    });
}

/** No framework: the list is the Popover API's, or the `hidden` attribute's, and `{hook}-` events tell the page. */
export function initCombobox(root, hook = "combobox") {
    const input = root.querySelector('[role="combobox"]');
    const list = input && root.ownerDocument.getElementById(input.getAttribute("aria-controls"));
    if (!list) return null;
    return attach(input, list, {
        setOpen(open) {
            if (list.hasAttribute("popover") && typeof list.showPopover === "function") {
                try {
                    if (open) list.showPopover();
                    else list.hidePopover();
                } catch {
                    // Already in that state.
                }
            } else list.hidden = !open;
            if (!open)
                root.dispatchEvent(new CustomEvent(`${hook}-close`, { bubbles: true }));
        },
        choose(value) {
            input.value = value;
            root.dispatchEvent(
                new CustomEvent(`${hook}-select`, { bubbles: true, detail: { value } }),
            );
        },
    });
}

/** Wire every `.combobox` on the page, once. */
export function autoInit(doc = document) {
    return [...doc.querySelectorAll(".combobox")].map(initCombobox).filter(Boolean);
}
