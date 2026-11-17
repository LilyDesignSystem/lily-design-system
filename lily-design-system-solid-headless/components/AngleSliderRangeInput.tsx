// AngleSliderRangeInput component
//
// A headless slider for selecting an angle value (0–360 degrees). Built on
// the native <input type="range"> with full ARIA slider semantics. Useful
// for rotation controls, compass direction pickers, hue angle selectors,
// or any circular/angular value input.
//
// Props:
//   class — string, optional. CSS class name.
//   value           — number, default 0, bindable. Current angle in degrees.
//   min             — number, default 0. Minimum angle.
//   max             — number, default 360. Maximum angle.
//   step            — number, default 1. Step increment.
//   label           — string, required. Accessible label for the slider.
//   disabled        — boolean, default false. Whether the slider is disabled.
//   name            — string, optional. Form field name for submission.
//   id              — string, optional. Element ID.
//   valueTextSuffix — string, default "°". Suffix for aria-valuetext
//                     (e.g., "°" makes "90°" for screen readers).
//   ...restProps    — additional HTML attributes spread onto <input>.
//
// Syntax:
//   <AngleSliderRangeInput label="Rotation" value={angle} onChange={setAngle} />
//
// Examples:
//
//   <AngleSliderRangeInput label="Rotation" value={angle} onChange={setAngle} />
//
//
//   <AngleSliderRangeInput label="Direction" value={90} step={15} />
//
//
//   <AngleSliderRangeInput label="Hue" min={0} max={360}
//     valueTextSuffix=" degrees" value={hue} onChange={setHue} />
//
//
//   <AngleSliderRangeInput label="Locked angle" value={45} disabled />
//
// Keyboard:
//   - Arrow Right / Arrow Up: Increase value by step
//   - Arrow Left / Arrow Down: Decrease value by step
//   - Home: Set to min value
//   - End: Set to max value
//   (All provided by native <input type="range"> behavior.)
//
// Accessibility:
//   - Implicit slider role from <input type="range">
//   - aria-label provides accessible name
//   - aria-valuemin, aria-valuemax, aria-valuenow for range semantics
//   - aria-valuetext provides human-readable value (e.g., "90°")
//
// Internationalization:
//   - Label text comes through the label prop
//   - Value text suffix (e.g., "°" or " degrees") via valueTextSuffix prop
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Use native <input type="range">, not custom slider markup
//   - The value prop must use controlled for two-way binding
//   - aria-valuetext is derived from value + valueTextSuffix
//
// References:
//   - WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/

import { merge, omit } from "solid-js";
import { attr } from "./attr";
import { warnMissingName } from "./dev-warning";

export interface AngleSliderRangeInputProps {
    class?: string;
    /** Current angle in degrees */
    value?: number;
    /** Minimum angle */
    min?: number;
    /** Maximum angle */
    max?: number;
    /** Step increment */
    step?: number;
    /** Accessible label for the slider */
    label: string;
    /** Whether the slider is disabled */
    disabled?: boolean;
    /** Form field name */
    name?: string;
    /** Element ID */
    id?: string;
    /** Suffix for the value text (default: "°") */
    valueTextSuffix?: string;
    /** Callback when value changes. */
    onChange?: (value: number) => void;
    [key: string]: unknown;
}

export default function AngleSliderRangeInput(props: AngleSliderRangeInputProps) {
    const p = merge(
        {
            class: "" as const,
            value: 0,
            min: 0,
            max: 360,
            step: 1,
            disabled: false,
            valueTextSuffix: "°" as const,
        },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "value",
        "min",
        "max",
        "step",
        "label",
        "disabled",
        "name",
        "id",
        "valueTextSuffix",
        "onChange",
    );
    warnMissingName("AngleSliderRangeInput", p.label, p["aria-label"], p["aria-labelledby"]);
    const valueText = () => `${p.value}${p.valueTextSuffix}`;

    return (
        <input
            class={`angle-slider-range-input ${p.class}`}
            type="range"
            value={p.value}
            onInput={(e) => p.onChange?.(Number(e.currentTarget.value))}
            min={p.min}
            max={p.max}
            step={p.step}
            disabled={p.disabled}
            name={p.name}
            id={p.id}
            aria-label={p.label}
            aria-valuemin={attr(p.min)}
            aria-valuemax={attr(p.max)}
            aria-valuenow={attr(p.value)}
            aria-valuetext={valueText()}
            {...restProps}
        />
    );
}
