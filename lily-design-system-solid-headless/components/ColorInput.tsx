// ColorInput component
//
// A headless color input wrapping the native HTML <input type="color"> element.
// It provides a browser-native color picker with accessible labelling via aria-label.
// The value is always a hex color string (e.g., "#ff0000"). Useful in settings panels,
// theme editors, or any interface where users need to select a color.
//
// Props:
//   class — string, optional. CSS class name.
//   value — string, default "#000000". Current hex color string; bindable via value + onChange.
//   label — string, required. Accessible name via aria-label.
//   disabled — boolean, default false. Whether the input is disabled.
//   name — string, default undefined. Form field name.
//   id — string, default undefined. Element ID.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <ColorInput label="Background color" value={color} onChange={setColor} />
//
// Examples:
//
//   <ColorInput label="Text color" value={textColor} onChange={setTextColor} disabled name="text_color" />
//
// Keyboard:
//   - None — keyboard behavior is provided by the browser-native color input
//
// Accessibility:
//   - aria-label provides an accessible name since native color inputs have no visible label
//
// Internationalization:
//   - The label prop provides the accessible name; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Renders a bare <input type="color"> with no wrapper element
//
// References:
//   - MDN <input type="color">: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface ColorInputProps {
    class?: string;
    value?: string;
    label: string;
    disabled?: boolean;
    name?: string;
    id?: string;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function ColorInput(props: ColorInputProps) {
    const p = withDefaults(
        { class: "" as const, value: "#000000" as const, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "value", "label", "disabled", "name", "id", "onChange");
    return (
        <input
            class={`color-input ${p.class}`}
            type="color"
            value={p.value}
            onInput={(e) => p.onChange?.(e.currentTarget.value)}
            aria-label={p.label}
            disabled={p.disabled}
            name={p.name}
            id={p.id}
            {...restProps}
        />
    );
}
