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

import { merge, omit, createEffect, untrack } from "solid-js";
import { warnMissingName, warnMissingProp } from "./dev-warning";

export interface RangeFieldsetProps {
    class?: string;
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

export default function RangeFieldset(props: RangeFieldsetProps) {
    const p = merge(
        {
            class: "" as const,
            min: 0,
            max: 100,
            get minimum() {
                return props.min ?? 0;
            },
            get maximum() {
                return props.max ?? 100;
            },
            step: 1,
            disabled: false,
        },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "legend",
        "minimumLabel",
        "maximumLabel",
        "min",
        "max",
        "minimum",
        "maximum",
        "step",
        "minimumName",
        "maximumName",
        "disabled",
        "onChange",
    );
    warnMissingProp(
        "RangeFieldset",
        "legend",
        p.legend,
        "The group of thumbs has no visible name.",
    );
    warnMissingName("RangeFieldset minimum", p.minimumLabel);
    warnMissingName("RangeFieldset maximum", p.maximumLabel);

    const lower: { current: HTMLInputElement | null } = { current: null };
    const upper: { current: HTMLInputElement | null } = { current: null };

    createEffect(
        () => [p.minimum],
        () =>
            untrack(() => {
                if (lower.current) lower.current.value = String(p.minimum);
            }),
    );
    createEffect(
        () => [p.maximum],
        () =>
            untrack(() => {
                if (upper.current) upper.current.value = String(p.maximum);
            }),
    );

    function move(which: "lower" | "upper") {
        const low = lower.current!;
        const high = upper.current!;
        if (which === "lower" && Number(low.value) > Number(high.value)) low.value = high.value;
        if (which === "upper" && Number(high.value) < Number(low.value)) high.value = low.value;
        p.onChange?.(Number(low.value), Number(high.value));
    }

    return (
        <fieldset
            class={`range-fieldset ${p.class}`}
            disabled={p.disabled}
            {...restProps}
        >
            <legend class="range-fieldset-legend">{p.legend}</legend>
            <input
                ref={(el) => (lower.current = el)}
                class="range-fieldset-minimum"
                type="range"
                aria-label={p.minimumLabel}
                name={p.minimumName}
                min={p.min}
                max={p.max}
                step={p.step}
                defaultValue={p.minimum}
                onInput={() => move("lower")}
            />
            <input
                ref={(el) => (upper.current = el)}
                class="range-fieldset-maximum"
                type="range"
                aria-label={p.maximumLabel}
                name={p.maximumName}
                min={p.min}
                max={p.max}
                step={p.step}
                defaultValue={p.maximum}
                onInput={() => move("upper")}
            />
        </fieldset>
    );
}
