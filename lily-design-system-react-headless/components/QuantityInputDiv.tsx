// QuantityInputDiv: a quantity entered as a number and a unit, each unit with its own min, max and step (tasks.md P29-T8). A
// group with a labelled number input and, for more than one unit, a labelled unit <select>; one unit is text linked by
// aria-describedby. Nothing is converted. Props: QuantityInputDiv.md.
import React, { useEffect, useId, useRef, useState } from "react";
import { warnMissingName, warnMissingProp } from "./dev-warning";

export interface QuantityUnit {
    value: string;
    label: string;
    min?: number;
    max?: number;
    step?: number | "any";
}

export interface QuantityInputDivProps {
    className?: string;
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

export default function QuantityInputDiv({
    className = "",
    label,
    magnitudeLabel,
    unitLabel,
    units = [],
    magnitude: magnitudeProp,
    unit: unitProp,
    onMagnitudeChange,
    onUnitChange,
    name,
    required = false,
    disabled = false,
    id,
    ...restProps
}: QuantityInputDivProps) {
    warnMissingName(
        "QuantityInputDiv",
        label,
        restProps["aria-label"],
        restProps["aria-labelledby"],
    );
    warnMissingProp(
        "QuantityInputDiv",
        "magnitudeLabel",
        magnitudeLabel,
        "the number needs a label.",
    );
    if (units.length > 1)
        warnMissingProp(
            "QuantityInputDiv",
            "unitLabel",
            unitLabel,
            "the unit choice needs a label.",
        );
    const generated = `quantity-input-div-${useId()}`;
    const baseId = id ?? generated;
    const [magnitude, setMagnitude] = useState(magnitudeProp ?? "");
    const [unit, setUnit] = useState(unitProp ?? units[0]?.value ?? "");
    useEffect(() => {
        if (magnitudeProp !== undefined) setMagnitude(magnitudeProp);
    }, [magnitudeProp]);
    useEffect(() => {
        if (unitProp !== undefined) setUnit(unitProp);
    }, [unitProp]);
    const chosen = units.find((u) => u.value === unit) ?? units[0];

    // A form reset puts the native controls back; put the state back with them.
    const root = useRef<HTMLDivElement>(null);
    const initial = useRef({ magnitude, unit });
    useEffect(() => {
        const form = root.current?.closest("form");
        if (!form) return;
        const onReset = () =>
            setTimeout(() => {
                setMagnitude(initial.current.magnitude);
                setUnit(initial.current.unit);
            }, 0);
        form.addEventListener("reset", onReset);
        return () => form.removeEventListener("reset", onReset);
    }, []);

    return (
        <div
            ref={root}
            className={`quantity-input-div ${className}`}
            role="group"
            aria-label={label}
            {...restProps}
        >
            <label htmlFor={`${baseId}-magnitude`}>{magnitudeLabel}</label>
            <input
                className="quantity-input-div-magnitude"
                id={`${baseId}-magnitude`}
                name={name ? `${name}-magnitude` : undefined}
                type="number"
                inputMode="decimal"
                min={chosen?.min}
                max={chosen?.max}
                step={chosen?.step}
                value={magnitude}
                onChange={(event) => {
                    setMagnitude(event.target.value);
                    onMagnitudeChange?.(event.target.value);
                }}
                aria-describedby={units.length === 1 ? `${baseId}-unit` : undefined}
                required={required}
                disabled={disabled}
            />
            {units.length > 1 ? (
                <>
                    <label htmlFor={`${baseId}-unit`}>{unitLabel}</label>
                    <select
                        className="quantity-input-div-unit"
                        id={`${baseId}-unit`}
                        name={name ? `${name}-unit` : undefined}
                        value={unit}
                        onChange={(event) => {
                            setUnit(event.target.value);
                            onUnitChange?.(event.target.value);
                        }}
                        required={required}
                        disabled={disabled}
                    >
                        {units.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </>
            ) : units.length === 1 ? (
                <>
                    <span
                        className="quantity-input-div-unit"
                        id={`${baseId}-unit`}
                    >
                        {units[0].label}
                    </span>
                    {name ? (
                        <input
                            type="hidden"
                            name={`${name}-unit`}
                            value={units[0].value}
                        />
                    ) : null}
                </>
            ) : null}
        </div>
    );
}
