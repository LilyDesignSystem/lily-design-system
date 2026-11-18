// QuantityInputDiv: a quantity entered as a number and a unit, each unit with its own min, max and step (tasks.md P29-T8). A
// group with a labelled number input and, for more than one unit, a labelled unit <select>; one unit is text linked by
// aria-describedby. Nothing is converted. Props: QuantityInputDiv.md.
import { omit, createEffect, createSignal, createUniqueId, onSettled, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName, warnMissingProp } from "./dev-warning";

export interface QuantityUnit {
    value: string;
    label: string;
    min?: number;
    max?: number;
    step?: number | "any";
}

export interface QuantityInputDivProps {
    class?: string;
    /** The group's name. */
    label: string;
    /** The number input's label. */
    magnitudeLabel: string;
    /** The unit select's label; required when there is more than one unit. */
    unitLabel?: string;
    /** The units offered, each with its own limits; the first is the default. */
    units: QuantityUnit[];
    /** The number as typed. */
    magnitude?: string;
    /** The unit chosen. */
    unit?: string;
    onMagnitudeChange?: (magnitude: string) => void;
    onUnitChange?: (unit: string) => void;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    id?: string;
    [key: string]: unknown;
}

export default function QuantityInputDiv(props: QuantityInputDivProps) {
    const p = withDefaults(
        {
            class: "" as const,
            units: [] as NonNullable<QuantityInputDivProps["units"]>,
            required: false,
            disabled: false,
        },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "magnitudeLabel",
        "unitLabel",
        "units",
        "magnitude",
        "unit",
        "onMagnitudeChange",
        "onUnitChange",
        "name",
        "required",
        "disabled",
        "id",
    );
    warnMissingName("QuantityInputDiv", p.label, p["aria-label"], p["aria-labelledby"]);
    warnMissingProp(
        "QuantityInputDiv",
        "magnitudeLabel",
        p.magnitudeLabel,
        "the number needs a label.",
    );
    if (p.units.length > 1)
        warnMissingProp(
            "QuantityInputDiv",
            "unitLabel",
            p.unitLabel,
            "the unit choice needs a label.",
        );
    const generated = `quantity-input-div-${createUniqueId()}`;
    const baseId = () => p.id ?? generated;
    const [magnitude, setMagnitude] = createSignal(untrack(() => p.magnitude ?? ""));
    const [unit, setUnit] = createSignal(untrack(() => p.unit ?? p.units[0]?.value ?? ""));
    createEffect(
        () => [p.magnitude],
        () =>
            untrack(() => {
                if (p.magnitude !== undefined) setMagnitude(p.magnitude);
            }),
    );
    createEffect(
        () => [p.unit],
        () =>
            untrack(() => {
                if (p.unit !== undefined) setUnit(p.unit);
            }),
    );
    const chosen = () => p.units.find((u) => u.value === unit()) ?? p.units[0];

    // A form reset puts the native controls back; put the state back with them.
    const root: { current: HTMLDivElement | null } = { current: null };
    const initial = { current: { magnitude: magnitude(), unit: unit() } };
    onSettled(() =>
        untrack(() => {
            const form = root.current?.closest("form");
            if (!form) return;
            const onReset = () =>
                setTimeout(() => {
                    setMagnitude(initial.current.magnitude);
                    setUnit(initial.current.unit);
                }, 0);
            form.addEventListener("reset", onReset);
            return () => form.removeEventListener("reset", onReset);
        }),
    );

    return (
        <div
            ref={(el) => (root.current = el)}
            class={`quantity-input-div ${p.class}`}
            role="group"
            aria-label={p.label}
            {...restProps}
        >
            <label for={`${baseId()}-magnitude`}>{p.magnitudeLabel}</label>
            <input
                class="quantity-input-div-magnitude"
                id={`${baseId()}-magnitude`}
                name={p.name ? `${p.name}-magnitude` : undefined}
                type="number"
                inputmode="decimal"
                min={chosen()?.min}
                max={chosen()?.max}
                step={chosen()?.step}
                value={magnitude()}
                defaultValue={magnitude()}
                onInput={(event) => {
                    setMagnitude(event.target.value);
                    p.onMagnitudeChange?.(event.target.value);
                }}
                aria-describedby={p.units.length === 1 ? `${baseId()}-unit` : undefined}
                required={p.required}
                disabled={p.disabled}
            />
            {p.units.length > 1 ? (
                <>
                    <label for={`${baseId()}-unit`}>{p.unitLabel}</label>
                    <select
                        class="quantity-input-div-unit"
                        id={`${baseId()}-unit`}
                        name={p.name ? `${p.name}-unit` : undefined}
                        value={unit()}
                        onChange={(event) => {
                            setUnit(event.target.value);
                            p.onUnitChange?.(event.target.value);
                        }}
                        required={p.required}
                        disabled={p.disabled}
                    >
                        {p.units.map((option) => (
                            <option
                                value={option.value}
                                defaultSelected={option.value === unit()}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </>
            ) : p.units.length === 1 ? (
                <>
                    <span
                        class="quantity-input-div-unit"
                        id={`${baseId()}-unit`}
                    >
                        {p.units[0].label}
                    </span>
                    {p.name ? (
                        <input
                            type="hidden"
                            name={`${p.name}-unit`}
                            value={p.units[0].value}
                        />
                    ) : null}
                </>
            ) : null}
        </div>
    );
}
