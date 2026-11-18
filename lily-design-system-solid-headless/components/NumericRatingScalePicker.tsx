// NumericRatingScalePicker: a 0 to 10 rating such as a numeric pain rating scale (spec/healthcare-ui item 12). A fieldset
// named by its legend, one native radio per number, the consumer's anchor words linked to the end radios. Props:
// NumericRatingScalePicker.md.
import { omit, createSignal, createUniqueId, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface NumericRatingScalePickerProps {
    class?: string;
    /** The question, rendered as the legend. */
    label: string;
    min?: number;
    max?: number;
    /** The words for the lowest value. */
    minLabel?: string;
    /** The words for the highest value. */
    maxLabel?: string;
    /** Controlled value. */
    value?: string;
    /** Uncontrolled starting value. */
    defaultValue?: string;
    onChange?: (value: string) => void;
    name?: string;
    required?: boolean;
    [key: string]: unknown;
}

export default function NumericRatingScalePicker(props: NumericRatingScalePickerProps) {
    const p = withDefaults(
        {
            class: "" as const,
            min: 0,
            max: 10,
            defaultValue: "" as const,
            name: "rating" as const,
            required: false,
        },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "min",
        "max",
        "minLabel",
        "maxLabel",
        "value",
        "defaultValue",
        "onChange",
        "name",
        "required",
    );
    warnMissingName("NumericRatingScalePicker", p.label, p["aria-labelledby"]);
    const id = createUniqueId();
    const [inner, setInner] = createSignal(untrack(() => p.defaultValue));
    const current = () => p.value ?? inner();
    const steps = () => Array.from({ length: Math.max(0, p.max - p.min + 1) }, (_, i) => p.min + i);
    return (
        <fieldset
            class={`numeric-rating-scale-picker ${p.class}`}
            {...restProps}
        >
            <legend class="numeric-rating-scale-picker-legend">{p.label}</legend>
            {p.minLabel ? (
                <span
                    class="numeric-rating-scale-picker-min-label"
                    id={`${id}-min`}
                >
                    {p.minLabel}
                </span>
            ) : null}
            <span class="numeric-rating-scale-picker-options">
                {steps().map((step, i) => (
                    <label class="numeric-rating-scale-picker-option">
                        <input
                            type="radio"
                            name={p.name}
                            value={String(step)}
                            checked={current() === String(step)}
                            defaultChecked={current() === String(step)}
                            required={p.required && i === 0}
                            aria-describedby={
                                i === 0 && p.minLabel
                                    ? `${id}-min`
                                    : i === steps().length - 1 && p.maxLabel
                                      ? `${id}-max`
                                      : undefined
                            }
                            onChange={() => {
                                setInner(String(step));
                                p.onChange?.(String(step));
                            }}
                        />{" "}
                        {step}
                    </label>
                ))}
            </span>
            {p.maxLabel ? (
                <span
                    class="numeric-rating-scale-picker-max-label"
                    id={`${id}-max`}
                >
                    {p.maxLabel}
                </span>
            ) : null}
        </fieldset>
    );
}
