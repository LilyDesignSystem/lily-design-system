// BodyMap: marking regions of the body on a consumer-supplied drawing (spec/healthcare-ui item 11). A fieldset named by
// its legend; the drawing is aria-hidden; every region is a real checkbox in a list, which submits with the form, and a
// click on a shape marked data-region toggles it. Props: BodyMap.md.
import React, { useEffect, useRef, useState } from "react";
import { warnMissingName } from "./dev-warning";

export interface BodyMapRegion {
    id: string;
    label: string;
}

export interface BodyMapProps {
    className?: string;
    /** The question, rendered as the legend. */
    label: string;
    regions: BodyMapRegion[];
    /** Controlled chosen region ids. */
    selected?: string[];
    /** Uncontrolled starting choice. */
    defaultSelected?: string[];
    onChange?: (selected: string[]) => void;
    /** The checkboxes' form name. */
    name?: string;
    /** The drawing; mark each clickable shape with data-region. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function BodyMap({
    className = "",
    label,
    regions,
    selected,
    defaultSelected = [],
    onChange,
    name,
    children,
    ...restProps
}: BodyMapProps) {
    warnMissingName("BodyMap", label, restProps["aria-labelledby"]);
    const [inner, setInner] = useState<string[]>(defaultSelected);
    const current = selected ?? inner;
    const figure = useRef<HTMLDivElement>(null);

    function toggle(id: string) {
        const next = current.includes(id) ? current.filter((s) => s !== id) : [...current, id];
        setInner(next);
        onChange?.(next);
    }

    useEffect(() => {
        for (const shape of figure.current?.querySelectorAll("[data-region]") ?? []) {
            if (current.includes(shape.getAttribute("data-region") ?? ""))
                shape.setAttribute("data-selected", "true");
            else shape.removeAttribute("data-selected");
        }
    });

    return (
        <fieldset
            className={`body-map ${className}`}
            {...restProps}
        >
            <legend className="body-map-legend">{label}</legend>
            {children ? (
                <div
                    ref={figure}
                    className="body-map-figure"
                    aria-hidden="true"
                    onClick={(event) => {
                        const id = (event.target as Element)
                            .closest("[data-region]")
                            ?.getAttribute("data-region");
                        if (id && regions.some((r) => r.id === id)) toggle(id);
                    }}
                >
                    {children}
                </div>
            ) : null}
            <ul className="body-map-regions">
                {regions.map((region) => (
                    <li key={region.id}>
                        <label className="body-map-region">
                            <input
                                type="checkbox"
                                name={name}
                                value={region.id}
                                checked={current.includes(region.id)}
                                onChange={() => toggle(region.id)}
                            />{" "}
                            {region.label}
                        </label>
                    </li>
                ))}
            </ul>
        </fieldset>
    );
}
