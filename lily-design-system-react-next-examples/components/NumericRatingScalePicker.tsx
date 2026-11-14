// NumericRatingScalePicker: a 0 to 10 rating such as a numeric pain rating scale (spec/healthcare-ui item 12). A fieldset
// named by its legend, one native radio per number, the consumer's anchor words linked to the end radios. Props:
// NumericRatingScalePicker.md.
import React, { useId, useState } from "react";
import { warnMissingName } from "./dev-warning";

export interface NumericRatingScalePickerProps {
    className?: string;
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

export default function NumericRatingScalePicker({
    className = "",
    label,
    min = 0,
    max = 10,
    minLabel,
    maxLabel,
    value,
    defaultValue = "",
    onChange,
    name = "rating",
    required = false,
    ...restProps
}: NumericRatingScalePickerProps) {
    warnMissingName("NumericRatingScalePicker", label, restProps["aria-labelledby"]);
    const id = useId();
    const [inner, setInner] = useState(defaultValue);
    const current = value ?? inner;
    const steps = Array.from({ length: Math.max(0, max - min + 1) }, (_, i) => min + i);
    return (
        <fieldset
            className={`numeric-rating-scale-picker ${className}`}
            {...restProps}
        >
            <legend className="numeric-rating-scale-picker-legend">{label}</legend>
            {minLabel ? (
                <span
                    className="numeric-rating-scale-picker-min-label"
                    id={`${id}-min`}
                >
                    {minLabel}
                </span>
            ) : null}
            <span className="numeric-rating-scale-picker-options">
                {steps.map((step, i) => (
                    <label
                        key={step}
                        className="numeric-rating-scale-picker-option"
                    >
                        <input
                            type="radio"
                            name={name}
                            value={String(step)}
                            checked={current === String(step)}
                            required={required && i === 0}
                            aria-describedby={
                                i === 0 && minLabel
                                    ? `${id}-min`
                                    : i === steps.length - 1 && maxLabel
                                      ? `${id}-max`
                                      : undefined
                            }
                            onChange={() => {
                                setInner(String(step));
                                onChange?.(String(step));
                            }}
                        />{" "}
                        {step}
                    </label>
                ))}
            </span>
            {maxLabel ? (
                <span
                    className="numeric-rating-scale-picker-max-label"
                    id={`${id}-max`}
                >
                    {maxLabel}
                </span>
            ) : null}
        </fieldset>
    );
}
