// RangeFieldset component
//
// A headless two-thumb range: a <fieldset> with a visible <legend> and two native
// <input type="range"> on one scale, for the minimum and the maximum of a span of values.
// The thumbs cannot cross: a thumb moved past the other stops where the other is. Each
// input is its own form field, and a form reset puts both back (tasks.md P34-T1).
//
// The inputs are uncontrolled (defaultValue), so a native form reset restores them; a
// change to the minimum or maximum prop moves the thumb.
//
// Keyboard: native range keys on each thumb; Tab moves from the lower to the upper.
// References: https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/

import React, { useEffect, useRef } from "react";
import { warnMissingName, warnMissingProp } from "./dev-warning";

export interface RangeFieldsetProps {
    className?: string;
    /** Visible name of the whole range. */
    legend: string;
    /** Accessible name of the lower thumb. */
    minimumLabel: string;
    /** Accessible name of the upper thumb. */
    maximumLabel: string;
    /** Lowest value either thumb can take. */
    min?: number;
    /** Highest value either thumb can take. */
    max?: number;
    /** Lower value. */
    minimum?: number;
    /** Upper value. */
    maximum?: number;
    /** Increment of both thumbs. */
    step?: number;
    /** Form field name of the lower value. */
    minimumName?: string;
    /** Form field name of the upper value. */
    maximumName?: string;
    /** Disables both thumbs. */
    disabled?: boolean;
    /** Called when either value changes. */
    onChange?: (minimum: number, maximum: number) => void;
    [key: string]: unknown;
}

export default function RangeFieldset({
    className = "",
    legend,
    minimumLabel,
    maximumLabel,
    min = 0,
    max = 100,
    minimum = min,
    maximum = max,
    step = 1,
    minimumName,
    maximumName,
    disabled = false,
    onChange,
    ...restProps
}: RangeFieldsetProps) {
    warnMissingProp("RangeFieldset", "legend", legend, "The group of thumbs has no visible name.");
    warnMissingName("RangeFieldset minimum", minimumLabel);
    warnMissingName("RangeFieldset maximum", maximumLabel);

    const lower = useRef<HTMLInputElement>(null);
    const upper = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (lower.current) lower.current.value = String(minimum);
    }, [minimum]);
    useEffect(() => {
        if (upper.current) upper.current.value = String(maximum);
    }, [maximum]);

    function move(which: "lower" | "upper") {
        const low = lower.current!;
        const high = upper.current!;
        if (which === "lower" && Number(low.value) > Number(high.value)) low.value = high.value;
        if (which === "upper" && Number(high.value) < Number(low.value)) high.value = low.value;
        onChange?.(Number(low.value), Number(high.value));
    }

    return (
        <fieldset
            className={`range-fieldset ${className}`}
            disabled={disabled}
            {...restProps}
        >
            <legend className="range-fieldset-legend">{legend}</legend>
            <input
                ref={lower}
                className="range-fieldset-minimum"
                type="range"
                aria-label={minimumLabel}
                name={minimumName}
                min={min}
                max={max}
                step={step}
                defaultValue={minimum}
                onInput={() => move("lower")}
            />
            <input
                ref={upper}
                className="range-fieldset-maximum"
                type="range"
                aria-label={maximumLabel}
                name={maximumName}
                min={min}
                max={max}
                step={step}
                defaultValue={maximum}
                onInput={() => move("upper")}
            />
        </fieldset>
    );
}
