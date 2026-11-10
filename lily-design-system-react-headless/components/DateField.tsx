// DateField component
//
// A date asked for as three parts, day, month and year, in a <fieldset> named by its
// <legend>, with optional helper text and an error message, all linked by generated
// ids. It suits dates people know by heart, such as a date of birth. The order of the
// parts and every label are the consumer's: there is no regional or English default.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. The legend, naming the whole date.
//   dayLabel, monthLabel, yearLabel — string, required. The three parts' labels.
//   order — "ymd" | "dmy" | "mdy", default "ymd" (ISO 8601). The order of the parts.
//   value — string, default "". YYYY-MM-DD once all three parts are filled, else "".
//     A new value fills the parts; onChange reports each change.
//   onChange — (value: string) => void, optional.
//   name — string, optional. Base name: the parts are {name}-day, -month, -year.
//   autocomplete — "bday", optional. A date of birth: the parts autocomplete as bday-day, -month, -year.
//   description — string, optional. Helper text, linked from the fieldset.
//   error — string, optional. Error message, linked from the fieldset and announced.
//   required — boolean, default false. Every part is required.
//   disabled — boolean, default false. The fieldset and its parts are disabled.
//   id — string, optional. Base id: the parts are {id}-day, -month, -year.
//   ...restProps — additional HTML attributes spread onto the <fieldset>.
//
// Syntax:
//   <DateField label="Date of birth" dayLabel="Day" monthLabel="Month" yearLabel="Year" value={value} onChange={setValue} />
//
// Keyboard:
//   - Tab moves between the parts; each is a native text field
//
// Accessibility:
//   - <fieldset> + <legend> name the group, announced with each part
//   - <label htmlFor> names each part
//   - aria-describedby on the fieldset links the description and the error
//   - aria-invalid="true" on each part while an error is shown
//   - role="alert" on the error paragraph announces it
//
// Internationalization:
//   - Every label is a prop, and the order is a prop: no English, no regional default
//
// References:
//   - WAI Forms Tutorial, grouping controls: https://www.w3.org/WAI/tutorials/forms/grouping/

import React, { useEffect, useId, useState } from "react";
import { warnMissingName } from "./dev-warning";

type Part = "day" | "month" | "year";
type Parts = Record<Part, string>;

const SEQUENCES: Record<"ymd" | "dmy" | "mdy", Part[]> = {
    ymd: ["year", "month", "day"],
    dmy: ["day", "month", "year"],
    mdy: ["month", "day", "year"],
};

/** The parts of a YYYY-MM-DD value, or empty parts for anything else. */
function split(v: string): Parts {
    const m = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/.exec(v ?? "");
    return m ? { year: m[1], month: m[2], day: m[3] } : { year: "", month: "", day: "" };
}

/** YYYY-MM-DD when every part is a number, else "". The calendar check is the consumer's. */
function join(p: Parts): string {
    if (![p.year, p.month, p.day].every((x) => /^\d+$/.test(x))) return "";
    return `${p.year.padStart(4, "0")}-${p.month.padStart(2, "0")}-${p.day.padStart(2, "0")}`;
}

export interface DateFieldProps {
    className?: string;
    label: string;
    dayLabel: string;
    monthLabel: string;
    yearLabel: string;
    order?: "ymd" | "dmy" | "mdy";
    value?: string;
    onChange?: (value: string) => void;
    name?: string;
    autocomplete?: "bday";
    description?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    id?: string;
    [key: string]: unknown;
}

export default function DateField({
    className = "",
    label,
    dayLabel,
    monthLabel,
    yearLabel,
    order = "ymd",
    value = "",
    onChange,
    name = undefined,
    autocomplete = undefined,
    description = undefined,
    error = undefined,
    required = false,
    disabled = false,
    id = undefined,
    ...restProps
}: DateFieldProps) {
    warnMissingName("DateField", label, restProps["aria-label"], restProps["aria-labelledby"]);
    const generatedId = `date-field-${useId()}`;
    const baseId = id ?? generatedId;
    const descriptionId = `${baseId}-desc`;
    const errorId = `${baseId}-error`;
    const describedBy =
        [description ? descriptionId : "", error ? errorId : ""].filter(Boolean).join(" ") ||
        undefined;
    const [parts, setParts] = useState<Parts>(() => split(value));

    useEffect(() => {
        // A value set from outside fills the parts; one the parts produced leaves them as typed.
        setParts((current) => (join(current) === value ? current : split(value)));
    }, [value]);

    const labels: Parts = { day: dayLabel, month: monthLabel, year: yearLabel };

    function update(part: Part, text: string) {
        const next = { ...parts, [part]: text };
        setParts(next);
        onChange?.(join(next));
    }

    return (
        <fieldset
            className={`date-field ${className}`}
            aria-describedby={describedBy}
            disabled={disabled}
            {...restProps}
        >
            <legend>{label}</legend>
            {(SEQUENCES[order] ?? SEQUENCES.ymd).map((part) => (
                <React.Fragment key={part}>
                    <label htmlFor={`${baseId}-${part}`}>{labels[part]}</label>
                    <input
                        className={`date-field-${part}`}
                        id={`${baseId}-${part}`}
                        name={name ? `${name}-${part}` : undefined}
                        type="text"
                        inputMode="numeric"
                        autoComplete={autocomplete === "bday" ? `bday-${part}` : undefined}
                        maxLength={part === "year" ? 4 : 2}
                        value={parts[part]}
                        onChange={(event) => update(part, event.target.value)}
                        required={required}
                        aria-invalid={error ? true : undefined}
                    />
                </React.Fragment>
            ))}
            {description && <p id={descriptionId}>{description}</p>}
            {error && (
                <p
                    id={errorId}
                    role="alert"
                >
                    {error}
                </p>
            )}
        </fieldset>
    );
}
