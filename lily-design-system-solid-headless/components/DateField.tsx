// DateField component
//
// A date asked for as three parts, day, month and year, in a <fieldset> named by its
// <legend>, with optional helper text and an error message, all linked by generated
// ids. It suits dates people know by heart, such as a date of birth. The order of the
// parts and every label are the consumer's: there is no regional or English default.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. The legend, naming the whole date.
//   dayLabel, monthLabel, yearLabel — string. The parts' labels; each is required when its part is shown.
//   order — "ymd" | "dmy" | "mdy", default "ymd" (ISO 8601). The order of the parts.
//   precision — "day" | "month" | "year", default "day". A month asks for month and year, a year for the year alone;
//     the value is YYYY-MM or YYYY, never padded with an invented day or month (openEHR DV_DATE, FHIR partial dates).
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

import { omit, createEffect, createSignal, createUniqueId, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { warnMissingName, warnMissingProp } from "./dev-warning";

type Part = "day" | "month" | "year";
type Parts = Record<Part, string>;

const SEQUENCES: Record<"ymd" | "dmy" | "mdy", Part[]> = {
    ymd: ["year", "month", "day"],
    dmy: ["day", "month", "year"],
    mdy: ["month", "day", "year"],
};

type Precision = "day" | "month" | "year";

/** The parts shown at each precision, in ISO order. */
const PARTS: Record<Precision, Part[]> = {
    day: ["year", "month", "day"],
    month: ["year", "month"],
    year: ["year"],
};

/** The parts of a value of this precision (YYYY-MM-DD, YYYY-MM or YYYY), or empty parts for anything else. */
function split(v: string | null | undefined, shown: Part[]): Parts {
    const m = /^(\d{1,4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?$/.exec(v ?? "");
    const filled = m ? [m[1], m[2], m[3]].filter((x) => x !== undefined).length : 0;
    if (!m || filled !== shown.length) return { year: "", month: "", day: "" };
    return { year: m[1], month: m[2] ?? "", day: m[3] ?? "" };
}

/** The value when every shown part is a number, else "". The calendar check is the consumer's. */
function join(p: Parts, shown: Part[]): string {
    if (!shown.every((part) => /^\d+$/.test(p[part]))) return "";
    const iso = [p.year.padStart(4, "0"), p.month.padStart(2, "0"), p.day.padStart(2, "0")];
    return iso.slice(0, shown.length).join("-");
}

export interface DateFieldProps {
    class?: string;
    label: string;
    /** Required when precision is "day". */
    dayLabel?: string;
    /** Required unless precision is "year". */
    monthLabel?: string;
    yearLabel: string;
    order?: "ymd" | "dmy" | "mdy";
    /** How much of the date is asked for. Default "day". */
    precision?: Precision;
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

export default function DateField(props: DateFieldProps) {
    const p = withDefaults(
        {
            class: "" as const,
            order: "ymd" as const,
            precision: "day" as const,
            value: "" as const,
            required: false,
            disabled: false,
        },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "dayLabel",
        "monthLabel",
        "yearLabel",
        "order",
        "precision",
        "value",
        "onChange",
        "name",
        "autocomplete",
        "description",
        "error",
        "required",
        "disabled",
        "id",
    );
    warnMissingName("DateField", p.label, p["aria-label"], p["aria-labelledby"]);
    const shown = () => PARTS[p.precision] ?? PARTS.day;
    if (shown().includes("day"))
        warnMissingProp("DateField", "dayLabel", p.dayLabel, "the day part needs a label.");
    if (shown().includes("month"))
        warnMissingProp("DateField", "monthLabel", p.monthLabel, "the month part needs a label.");
    const generatedId = `date-field-${createUniqueId()}`;
    const baseId = () => p.id ?? generatedId;
    const descriptionId = () => `${baseId()}-desc`;
    const errorId = () => `${baseId()}-error`;
    const describedBy = () =>
        [p.description ? descriptionId() : "", p.error ? errorId() : ""]
            .filter(Boolean)
            .join(" ") || undefined;
    const [parts, setParts] = createSignal<Parts>(untrack(() => () => split(p.value, shown())));

    createEffect(
        () => [p.value, p.precision],
        () =>
            untrack(() => {
                // A p.value set from outside fills the parts(); one the parts() produced leaves them as typed.
                setParts((current) =>
                    join(current, shown()) === p.value ? current : split(p.value, shown()),
                );
            }),
    );

    const labels = (): Parts => ({
        day: p.dayLabel ?? "",
        month: p.monthLabel ?? "",
        year: p.yearLabel,
    });

    function update(part: Part, text: string) {
        const next = { ...parts(), [part]: text };
        setParts(next);
        p.onChange?.(join(next, shown()));
    }

    return (
        <fieldset
            class={`date-field ${p.class}`}
            data-precision={attr(p.precision === "day" ? undefined : p.precision)}
            aria-describedby={describedBy()}
            disabled={p.disabled}
            {...restProps}
        >
            <legend>{p.label}</legend>
            {(SEQUENCES[p.order] ?? SEQUENCES.ymd)
                .filter((part) => shown().includes(part))
                .map((part) => (
                    <>
                        <label for={`${baseId()}-${part}`}>{labels()[part]}</label>
                        <input
                            class={`date-field-${part}`}
                            id={`${baseId()}-${part}`}
                            name={p.name ? `${p.name}-${part}` : undefined}
                            type="text"
                            inputmode="numeric"
                            autocomplete={p.autocomplete === "bday" ? `bday-${part}` : undefined}
                            maxlength={part === "year" ? 4 : 2}
                            value={parts()[part]}
                            onInput={(event) => update(part, event.target.value)}
                            required={p.required}
                            aria-invalid={attr(p.error ? true : undefined)}
                        />
                    </>
                ))}
            {p.description && <p id={descriptionId()}>{p.description}</p>}
            {p.error && (
                <p
                    id={errorId()}
                    role="alert"
                >
                    {p.error}
                </p>
            )}
        </fieldset>
    );
}
