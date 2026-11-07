// macro-keys.js — the keys for the macros that are not covered by shared/widget-keys.ts. widget-init.js wires them, and
// each attach function returns its cleanup. These repeat the HTML catalog's scripts over the markup the macros render,
// so an attribute a macro renders is the state: aria-valuenow, data-active, data-editing, aria-expanded.

import {
    isWheelTypeaheadKey,
    nextWheelIndex,
    nextWheelPrefix,
    WHEEL_MOVE_KEYS,
    wheelTypeaheadIndex,
} from "./wheel-picker.js";

const number = (el, name, fallback) => {
    const value = parseFloat(el.getAttribute(name));
    return Number.isNaN(value) ? fallback : value;
};
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const isRtl = (el) => el.ownerDocument.defaultView.getComputedStyle(el).direction === "rtl";
const listen = (el, type, handler) => {
    el.addEventListener(type, handler);
    return () => el.removeEventListener(type, handler);
};
const emit = (el, name, detail) => {
    const { CustomEvent } = el.ownerDocument.defaultView;
    el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
};

/** input[type=range]: the browser moves it one step, Home and End included. Shift, which it ignores, moves ten. */
export function attachDial(input) {
    return listen(input, "keydown", (event) => {
        if (!event.shiftKey || input.disabled) return;
        const rtl = isRtl(input);
        const up = event.key === "ArrowUp" || event.key === (rtl ? "ArrowLeft" : "ArrowRight");
        const down = event.key === "ArrowDown" || event.key === (rtl ? "ArrowRight" : "ArrowLeft");
        if (!up && !down) return;
        event.preventDefault();
        const step = number(input, "step", 1) * 10;
        const value = Number(input.value) + (up ? step : -step);
        input.value = String(clamp(value, number(input, "min", 0), number(input, "max", 100)));
        emit(input, "input");
        emit(input, "change");
    });
}

/** The arrows slide the thumb, Home goes back, and End, Enter or Space confirms at once: a bubbling "confirm". */
export function attachSliderButton(button) {
    return listen(button, "keydown", (event) => {
        if (button.disabled) return;
        const position = number(button, "aria-valuenow", 0);
        const step = number(button, "data-step", 10);
        let next;
        if (event.key === "ArrowRight") next = position + step;
        else if (event.key === "ArrowLeft") next = position - step;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End" || event.key === "Enter" || event.key === " ") next = 100;
        else return;
        event.preventDefault();
        button.setAttribute("aria-valuenow", String(next >= 100 ? 0 : Math.max(0, next)));
        if (next >= 100) emit(button, "confirm");
    });
}

/** One digit in each input. Typing moves on, Backspace clears and moves back, and the arrows move. Keeps data-value. */
export function attachPinInput(root) {
    const inputs = () => [...root.querySelectorAll("input")];
    const publish = () =>
        root.setAttribute(
            "data-value",
            inputs()
                .map((el) => el.value)
                .join(""),
        );
    const stops = [
        listen(root, "input", (event) => {
            const all = inputs();
            const index = all.indexOf(event.target);
            if (index < 0) return;
            if (event.target.value && !/^\p{Nd}$/u.test(event.target.value))
                event.target.value = "";
            else if (event.target.value && index < all.length - 1) all[index + 1].focus();
            publish();
        }),
        listen(root, "keydown", (event) => {
            const all = inputs();
            const index = all.indexOf(event.target);
            if (index < 0) return;
            if (event.key === "Backspace") {
                event.preventDefault();
                if (!event.target.value && index > 0) {
                    all[index - 1].value = "";
                    all[index - 1].focus();
                } else event.target.value = "";
                publish();
            } else if (event.key === "ArrowLeft" && index > 0) all[index - 1].focus();
            else if (event.key === "ArrowRight" && index < all.length - 1) all[index + 1].focus();
        }),
    ];
    return () => stops.forEach((stop) => stop());
}

/** role="scrollbar": moves aria-valuenow and reports a bubbling "change". What scrolls is the consumer's. */
export function attachScrollBar(root) {
    return listen(root, "keydown", (event) => {
        const min = number(root, "aria-valuemin", 0);
        const max = number(root, "aria-valuemax", 100);
        const step = number(root, "data-step", 1);
        const pageStep = number(root, "data-page-step", 10);
        const value = number(root, "aria-valuenow", min);
        let next;
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = value - step;
        else if (event.key === "ArrowDown" || event.key === "ArrowRight") next = value + step;
        else if (event.key === "PageUp") next = value - pageStep;
        else if (event.key === "PageDown") next = value + pageStep;
        else if (event.key === "Home") next = min;
        else if (event.key === "End") next = max;
        else return;
        event.preventDefault();
        next = clamp(next, min, max);
        root.setAttribute("aria-valuenow", String(next));
        emit(root, "change", { value: next });
    });
}

/** Tiles are the consumer's [data-tile] elements. Left and right go in source order, up and down by position on screen. */
export function attachTileMap(root) {
    return listen(root, "keydown", (event) => {
        const tiles = [...root.querySelectorAll("[data-tile]")];
        if (tiles.length === 0) return;
        const focused = root.ownerDocument.activeElement;
        const index = tiles.indexOf(focused);
        const { key } = event;
        if (key === "ArrowRight" || key === "ArrowLeft") {
            event.preventDefault();
            const forward = (key === "ArrowRight") !== isRtl(root);
            tiles[clamp(index + (forward ? 1 : -1), 0, tiles.length - 1)].focus();
        } else if (key === "ArrowDown" || key === "ArrowUp") {
            event.preventDefault();
            if (index < 0) return;
            const from = focused.getBoundingClientRect();
            const centre = from.left + from.width / 2;
            let best = null;
            let bestScore = Infinity;
            for (const tile of tiles) {
                if (tile === focused) continue;
                const box = tile.getBoundingClientRect();
                if (key === "ArrowDown" ? box.top <= from.top : box.top >= from.top) continue;
                const score =
                    Math.abs(box.left + box.width / 2 - centre) + Math.abs(box.top - from.top);
                if (score < bestScore) {
                    best = tile;
                    bestScore = score;
                }
            }
            best?.focus();
        } else if (key === "Enter" || key === " ") {
            event.preventDefault();
            if (index >= 0) emit(focused, "tile-activate");
        } else if (key === "Escape") {
            event.preventDefault();
            if (index >= 0) focused.blur();
        }
    });
}

/** A listbox whose selection follows the cursor, on shared/wheel-picker.ts. */
export function attachWheelPicker(root) {
    const list = root.querySelector(".wheel-picker-list");
    const optionEls = [...root.querySelectorAll(".wheel-picker-option")];
    const options = optionEls.map((el) => ({
        value: el.getAttribute("data-value"),
        label: el.textContent,
        disabled: el.getAttribute("aria-disabled") === "true",
    }));
    const hidden = root.querySelector('input[type="hidden"]');
    const move = {
        loop: root.hasAttribute("data-loop"),
        pageSize: number(root, "data-page-size", 5),
    };
    let typeahead = { prefix: "", at: 0 };
    let selected = optionEls.findIndex((el) => el.getAttribute("aria-selected") === "true");

    function select(index) {
        if (index < 0 || index === selected) return;
        selected = index;
        optionEls.forEach((el, i) => el.setAttribute("aria-selected", String(i === index)));
        list.setAttribute("aria-activedescendant", optionEls[index].id);
        if (hidden) hidden.value = options[index].value;
        const el = optionEls[index];
        list.scrollTop = el.offsetTop - (list.clientHeight - el.offsetHeight) / 2;
        emit(root, "change", { value: options[index].value });
    }

    const stops = [
        listen(list, "keydown", (event) => {
            if (list.getAttribute("aria-disabled") === "true") return;
            if (WHEEL_MOVE_KEYS.includes(event.key)) {
                event.preventDefault();
                select(nextWheelIndex(options, selected, event.key, move));
            } else if (isWheelTypeaheadKey(event)) {
                typeahead = nextWheelPrefix(typeahead, event.key, Date.now());
                select(wheelTypeaheadIndex(options, selected, typeahead.prefix));
            }
        }),
        listen(list, "click", (event) => {
            if (list.getAttribute("aria-disabled") === "true") return;
            const option = event.target.closest('[role="option"]');
            if (!option || option.getAttribute("aria-disabled") === "true") return;
            select(optionEls.indexOf(option));
            list.focus();
        }),
    ];
    return () => stops.forEach((stop) => stop());
}

/** A focusable scrolling region: the arrows scroll by data-step, default 100, and Home and End go to the ends. */
export function attachHorizontalScroller(root) {
    return listen(root, "keydown", (event) => {
        const step = number(root, "data-step", 100);
        const rtl = isRtl(root);
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            root.scrollBy({ left: event.key === "ArrowRight" ? step : -step, behavior: "smooth" });
        } else if (event.key === "Home") {
            event.preventDefault();
            root.scrollTo({ left: 0, behavior: "smooth" });
        } else if (event.key === "End") {
            event.preventDefault();
            root.scrollTo({ left: rtl ? -root.scrollWidth : root.scrollWidth, behavior: "smooth" });
        }
    });
}

/** contenteditable: Enter or Space or a click begins; Enter keeps, reporting "editable-change"; Escape puts it back. */
export function attachEditable(root) {
    let before = null;
    const editing = () => root.getAttribute("contenteditable") === "true";
    const begin = () => {
        if (editing() || root.getAttribute("aria-disabled") === "true") return;
        before = root.textContent;
        root.setAttribute("contenteditable", "true");
        root.focus();
    };
    const end = (keep) => {
        root.setAttribute("contenteditable", "false");
        if (keep) emit(root, "editable-change", { value: root.textContent });
        else root.textContent = before;
        before = null;
    };
    const stops = [
        listen(root, "click", begin),
        listen(root, "keydown", (event) => {
            if (event.isComposing) return;
            if (!editing()) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    begin();
                }
            } else if (event.key === "Enter") {
                event.preventDefault();
                end(true);
            } else if (event.key === "Escape") {
                event.preventDefault();
                end(false);
            }
        }),
    ];
    if (editing()) before = root.textContent;
    return () => stops.forEach((stop) => stop());
}

/** Escape leaves edit mode: data-editing="false", hidden, and a bubbling "cancel". Enter is the browser's submit. */
export function attachEditableForm(form) {
    return listen(form, "keydown", (event) => {
        if (event.key !== "Escape" || event.defaultPrevented || form.hidden) return;
        event.preventDefault();
        form.setAttribute("data-editing", "false");
        form.hidden = true;
        emit(form, "cancel");
    });
}

/** Escape ends the tour: data-active="false", hidden, and a bubbling "close". A tour does not trap focus. */
export function attachTour(root) {
    return listen(root, "keydown", (event) => {
        if (event.key !== "Escape" || event.defaultPrevented || root.hidden) return;
        event.preventDefault();
        root.setAttribute("data-active", "false");
        root.hidden = true;
        emit(root, "close");
    });
}

/** The APG listbox with a roving tab stop: arrows wrap, Home and End jump, and options are read at key time. */
export function attachListbox(root) {
    const options = () => [...root.querySelectorAll('[role="option"]')];
    const rove = (stop) => {
        for (const el of options()) el.tabIndex = el === stop ? 0 : -1;
    };
    const all = options();
    rove(all.find((el) => el.getAttribute("aria-selected") === "true") ?? all[0]);
    return listen(root, "keydown", (event) => {
        const items = options();
        if (items.length === 0) return;
        const last = items.length - 1;
        const index = items.indexOf(root.ownerDocument.activeElement);
        let next;
        if (event.key === "ArrowDown") next = index < last ? index + 1 : 0;
        else if (event.key === "ArrowUp") next = index > 0 ? index - 1 : last;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = last;
        else return;
        event.preventDefault();
        rove(items[next]);
        items[next].focus();
    });
}

const TREE_ITEM = "[role='treeitem']";

/** The APG tree, as tree-list/tree.js is, but it stops at the ends, and adds `*` and type-ahead. */
export function attachFileTree(tree) {
    let buffer = "";
    let timer;
    const allItems = () => [...tree.querySelectorAll(TREE_ITEM)];
    const parentItem = (item) => item.parentElement?.closest(TREE_ITEM) ?? null;
    const isVisible = (item) => {
        for (let p = parentItem(item); p; p = parentItem(p)) {
            if (p.getAttribute("aria-expanded") === "false") return false;
        }
        return true;
    };
    const visibleItems = () => allItems().filter(isVisible);
    const ownText = (item) =>
        [...item.childNodes]
            .filter((node) => node.getAttribute?.("role") !== "group")
            .map((node) => node.textContent ?? "")
            .join("")
            .trim()
            .toLocaleLowerCase();
    const setStop = (target) => {
        for (const item of allItems()) item.tabIndex = item === target ? 0 : -1;
    };
    const focusItem = (item) => {
        if (!item) return;
        setStop(item);
        item.focus();
    };
    const normalise = () => {
        const visible = visibleItems();
        if (visible.length === 0) return;
        const stops = allItems().filter((item) => item.getAttribute("tabindex") === "0");
        if (stops.length === 1 && isVisible(stops[0])) return;
        setStop(
            stops.find(isVisible) ??
                visible.find((item) => item.getAttribute("aria-selected") === "true") ??
                visible[0],
        );
    };

    normalise();
    const Observer = tree.ownerDocument.defaultView?.MutationObserver;
    const observer = Observer ? new Observer(normalise) : null;
    observer?.observe(tree, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["aria-expanded"],
    });

    function onFocusin(event) {
        const item = event.target.closest(TREE_ITEM);
        if (item && tree.contains(item)) setStop(item);
    }
    function onKeydown(event) {
        const { target } = event;
        const item = target.closest(TREE_ITEM);
        if (!item || !tree.contains(item)) return;
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        const visible = visibleItems();
        const index = visible.indexOf(item);
        const expanded = item.getAttribute("aria-expanded");
        const rtl = isRtl(item);
        const inward = rtl ? "ArrowLeft" : "ArrowRight";
        const outward = rtl ? "ArrowRight" : "ArrowLeft";
        const go = (next) => {
            event.preventDefault();
            focusItem(next);
        };
        if (event.key === "ArrowDown") return go(visible[Math.min(index + 1, visible.length - 1)]);
        if (event.key === "ArrowUp") return go(visible[Math.max(index - 1, 0)]);
        if (event.key === "Home") return go(visible[0]);
        if (event.key === "End") return go(visible[visible.length - 1]);
        if (
            event.key === inward ||
            event.key === outward ||
            event.key === "Enter" ||
            event.key === " "
        ) {
            if (target !== item) return;
            event.preventDefault();
            if (event.key === "Enter" || event.key === " ") item.click();
            else if (event.key === inward) {
                if (expanded === "false") item.setAttribute("aria-expanded", "true");
                else if (expanded === "true") {
                    focusItem(item.querySelector(`[role='group'] ${TREE_ITEM}`));
                }
            } else if (expanded === "true") item.setAttribute("aria-expanded", "false");
            else focusItem(parentItem(item));
            return;
        }
        if (event.key === "*") {
            event.preventDefault();
            for (const sibling of item.parentElement?.children ?? []) {
                if (sibling.matches(`${TREE_ITEM}[aria-expanded='false']`)) {
                    sibling.setAttribute("aria-expanded", "true");
                }
            }
            return;
        }
        if ([...event.key].length !== 1) return;
        event.preventDefault();
        buffer += event.key.toLocaleLowerCase();
        clearTimeout(timer);
        timer = setTimeout(() => (buffer = ""), 500);
        const cycle = [...buffer].every((c) => c === buffer[0]);
        const needle = cycle ? buffer[0] : buffer;
        const cut = index + (cycle ? 1 : 0);
        const ordered = [...visible.slice(cut), ...visible.slice(0, cut)];
        focusItem(ordered.find((candidate) => ownText(candidate).startsWith(needle)));
    }
    const stops = [listen(tree, "focusin", onFocusin), listen(tree, "keydown", onKeydown)];
    return () => {
        observer?.disconnect();
        clearTimeout(timer);
        stops.forEach((stop) => stop());
    };
}

/** Enter sends and Shift+Enter is a line break, but Enter during IME composition is the IME's. The button follows the text. */
export function attachChatComposer(form) {
    const input = form.querySelector(".chat-composer-input");
    const button = form.querySelector(".chat-composer-button");
    const min = number(form, "data-min-rows", 1);
    const max = number(form, "data-max-rows", 8);
    const busy = () => button.getAttribute("data-state") === "stop";
    const ready = () => !input.disabled && !busy() && input.value.trim() !== "";
    const fit = () => {
        input.rows = clamp(input.value.split("\n").length, min, max);
        if (!busy() && !input.disabled) button.disabled = !ready();
    };
    const stops = [
        listen(input, "input", fit),
        listen(input, "keydown", (event) => {
            if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
            event.preventDefault();
            if (ready()) form.requestSubmit();
        }),
        listen(button, "click", () => {
            if (busy()) emit(form, "stop");
        }),
    ];
    return () => stops.forEach((stop) => stop());
}

/** The button flips aria-expanded and data-expanded and swaps its label. The clamp is the consumer's CSS. */
export function attachShowMore(root) {
    const button = root.querySelector(".show-more-button");
    const content = root.querySelector(".show-more-content");
    if (!button || !content) return () => {};
    return listen(button, "click", () => {
        const expanded = button.getAttribute("aria-expanded") !== "true";
        button.setAttribute("aria-expanded", String(expanded));
        content.setAttribute("data-expanded", String(expanded));
        button.textContent = button.getAttribute(expanded ? "data-less-label" : "data-more-label");
    });
}
