// ColorPicker client-side runtime.
//
// Pairs with color-picker.njk. The macro renders the whole control; this module makes it work: choosing a swatch,
// Transparent or a typed colour sets the value (the root's data-value and the hidden input), puts it first in the
// recent row, and brings every field into step; ArrowUp and ArrowDown move a palette row; a form reset restores the
// starting colour.
//
// Events: `lily:valuechange` (`detail: { value }`, once for each new choice) and `lily:recentchange`
// (`detail: { recent }`) on the root.
import {
    CSS_NAMED_COLORS,
    TRANSPARENT,
    cmykToHex,
    hexToCmyk,
    hexToHsb,
    hexToHsl,
    hexToRgb,
    hsbToHex,
    hslToHex,
    nameOfColor,
    normalizeHex,
    pushRecent,
    rgbToHex,
} from "./colors.js";

const MODELS = {
    hsl: { values: (v) => hexToHsl(v) ?? { h: 0, s: 0, l: 0 }, toHex: hslToHex },
    hsb: { values: (v) => hexToHsb(v) ?? { h: 0, s: 0, b: 0 }, toHex: hsbToHex },
    rgb: { values: (v) => hexToRgb(v) ?? { r: 0, g: 0, b: 0 }, toHex: rgbToHex },
    cmyk: { values: (v) => hexToCmyk(v) ?? { c: 0, m: 0, y: 0, k: 100 }, toHex: cmykToHex },
};

/**
 * Wire one `[data-lily-color-picker]` root. `options.colorLabel(color)` names a recent swatch that is not in the
 * palette (default: its CSS name, else its hex value). Returns a function that removes the listeners.
 */
export function initColorPicker(root, options = {}) {
    const prefix = root.dataset.id || "color-picker";
    const columns = Number(root.dataset.columns) >= 1 ? Number(root.dataset.columns) : 10;
    const maxRecent = Number(root.dataset.maxRecent) >= 1 ? Number(root.dataset.maxRecent) : 10;
    const recentRow = root.querySelector(".color-picker-recent");
    const palette = root.querySelector(".color-picker-palette");
    const transparent = root.querySelector(".color-picker-transparent");
    const hex = root.querySelector(".color-picker-hex");
    const name = root.querySelector(".color-picker-name");
    const hidden = root.querySelector(":scope > input[type=hidden]");
    if (!recentRow || !palette || !transparent || !hex || !name) return () => {};

    let value = root.dataset.value ?? "";
    const initial = value;
    let recent = Array.from(recentRow.querySelectorAll("input")).map((r) => r.value);
    const disabled = () => palette.disabled;

    const labelOf = (color) => {
        const known = palette.querySelector(`input[value="${color}"]`);
        if (known) return known.getAttribute("aria-label");
        if (options.colorLabel) return options.colorLabel(color);
        if (color === TRANSPARENT) return transparent.textContent.trim();
        return nameOfColor(color) ?? color;
    };

    const swatch = (color) => {
        const input = document.createElement("input");
        input.className = "color-picker-swatch";
        input.type = "radio";
        input.name = `${prefix}-recent`;
        input.value = color;
        input.setAttribute("aria-label", labelOf(color));
        input.setAttribute("data-color", color);
        input.style.setProperty("--color-picker-swatch", color);
        return input;
    };

    const setInvalid = (input, invalid) => {
        const msgId = `${input.id}-invalid`;
        root.querySelector(`[id="${msgId}"]`)?.remove();
        input.removeAttribute("aria-describedby");
        if (!invalid) return input.removeAttribute("aria-invalid");
        input.setAttribute("aria-invalid", "true");
        const text = root.dataset.invalidLabel;
        if (!text) return;
        const span = document.createElement("span");
        span.id = msgId;
        span.className = "color-picker-invalid";
        span.textContent = text;
        input.setAttribute("aria-describedby", msgId);
        input.parentElement.append(span);
    };

    function sync() {
        if (value) root.setAttribute("data-value", value);
        else root.removeAttribute("data-value");
        if (hidden) hidden.value = value;
        // Choosing a recent swatch moves it to the front; moving a node drops its focus, so put focus back on it.
        const hadFocus = recentRow.contains(document.activeElement);
        const kept = new Map(
            Array.from(recentRow.querySelectorAll("input")).map((r) => [r.value, r]),
        );
        recentRow.replaceChildren(...recent.map((c) => kept.get(c) ?? swatch(c)));
        if (hadFocus) kept.get(value)?.focus();
        for (const radio of root.querySelectorAll("input[type=radio]"))
            radio.checked = radio.value === value;
        transparent.setAttribute("aria-pressed", String(value === TRANSPARENT));
        hex.value = value === TRANSPARENT ? "" : value;
        name.value = nameOfColor(value) ?? "";
        setInvalid(hex, false);
        setInvalid(name, false);
        for (const input of root.querySelectorAll("input[data-model]")) {
            input.value = String(MODELS[input.dataset.model].values(value)[input.dataset.key]);
        }
    }

    const emit = (type, detail) =>
        root.dispatchEvent(new CustomEvent(type, { detail, bubbles: true }));

    function choose(color) {
        if (disabled() || color === value) return;
        value = color;
        recent = pushRecent(recent, color, maxRecent);
        sync();
        emit("lily:valuechange", { value: color });
        emit("lily:recentchange", { recent: [...recent] });
    }

    const commitHex = () => {
        const parsed = normalizeHex(hex.value);
        const invalid = hex.value.trim() !== "" && parsed === null;
        if (parsed) choose(parsed);
        setInvalid(hex, invalid);
    };
    const commitName = () => {
        const text = name.value.trim().toLowerCase();
        const parsed = CSS_NAMED_COLORS[text] ?? null;
        const invalid = text !== "" && parsed === null;
        if (parsed) choose(parsed);
        setInvalid(name, invalid);
    };

    const onChange = (event) => {
        const t = event.target;
        if (t.type === "radio" && root.contains(t)) choose(t.value);
        else if (t === hex) commitHex();
        else if (t === name) commitName();
        else if (t.dataset?.model) {
            const raw = t.valueAsNumber;
            if (!Number.isFinite(raw)) return;
            const model = MODELS[t.dataset.model];
            choose(model.toHex({ ...model.values(value), [t.dataset.key]: raw }));
        }
    };
    const onKeydown = (event) => {
        const t = event.target;
        if (event.key === "Enter" && (t === hex || t === name)) {
            event.preventDefault();
            if (t === hex) commitHex();
            else commitName();
            return;
        }
        // Native radios move one swatch with Left and Right; Up and Down move a whole row, as the grid looks.
        if (
            (event.key !== "ArrowUp" && event.key !== "ArrowDown") ||
            t.type !== "radio" ||
            !palette.contains(t)
        )
            return;
        const radios = Array.from(palette.querySelectorAll("input[type=radio]"));
        const next = radios[radios.indexOf(t) + (event.key === "ArrowDown" ? columns : -columns)];
        event.preventDefault();
        if (!next) return;
        next.focus();
        next.checked = true;
        choose(next.value);
    };
    const onClick = (event) => {
        if (event.target.closest(".color-picker-transparent") === transparent) choose(TRANSPARENT);
    };

    // A form reset puts the starting colour back, one tick after the reset (not when a listener cancelled it).
    const form = root.closest("form");
    let timer;
    const onReset = (event) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (event.defaultPrevented) return;
            const changed = value !== initial;
            value = initial;
            sync();
            if (changed) emit("lily:valuechange", { value });
        }, 0);
    };

    root.addEventListener("change", onChange);
    root.addEventListener("keydown", onKeydown);
    root.addEventListener("click", onClick);
    form?.addEventListener("reset", onReset);
    sync();
    return () => {
        clearTimeout(timer);
        root.removeEventListener("change", onChange);
        root.removeEventListener("keydown", onKeydown);
        root.removeEventListener("click", onClick);
        form?.removeEventListener("reset", onReset);
    };
}

/** Wire every `[data-lily-color-picker]` under `scope` (default: the document). */
export function autoInit(scope = document, options = {}) {
    return Array.from(scope.querySelectorAll("[data-lily-color-picker]")).map((root) =>
        initColorPicker(root, options),
    );
}

export {
    CSS_NAMED_COLORS,
    TRANSPARENT,
    cmykToHex,
    cmykToRgb,
    defaultPalette,
    hexToCmyk,
    hexToHsb,
    hexToHsl,
    hexToRgb,
    hsbToHex,
    hsbToRgb,
    hslToHex,
    hslToRgb,
    nameOfColor,
    normalizeHex,
    parseColor,
    pushRecent,
    rgbToCmyk,
    rgbToHex,
    rgbToHsb,
    rgbToHsl,
} from "./colors.js";
