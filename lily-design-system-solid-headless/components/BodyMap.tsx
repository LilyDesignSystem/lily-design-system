// BodyMap: marking regions of the body on a consumer-supplied drawing (spec/healthcare-ui item 11). A fieldset named by
// its legend; the drawing is aria-hidden; every region is a real checkbox in a list, which submits with the form, and a
// click on a shape marked data-region toggles it. Props: BodyMap.md.
import type { JSX } from "@solidjs/web";
import { createEffect, createSignal, omit, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface BodyMapRegion {
    id: string;
    label: string;
}

export interface BodyMapProps {
    class?: string;
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
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function BodyMap(props: BodyMapProps) {
    const p = withDefaults({ class: "" as const, defaultSelected: [] }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "regions",
        "selected",
        "defaultSelected",
        "onChange",
        "name",
        "children",
    );
    warnMissingName("BodyMap", p.label, p["aria-labelledby"]);
    const [inner, setInner] = createSignal<string[]>(untrack(() => p.defaultSelected));
    const current = () => p.selected ?? inner();
    const figure: { current: HTMLDivElement | null } = { current: null };

    function toggle(id: string) {
        const next = current().includes(id)
            ? current().filter((s) => s !== id)
            : [...current(), id];
        setInner(next);
        p.onChange?.(next);
    }

    // Mark the consumer's shapes for the chosen regions, whenever the choice changes.
    createEffect(current, (chosen) => {
        for (const shape of figure.current?.querySelectorAll("[data-region]") ?? []) {
            if (chosen.includes(shape.getAttribute("data-region") ?? ""))
                shape.setAttribute("data-selected", "true");
            else shape.removeAttribute("data-selected");
        }
    });

    return (
        <fieldset
            class={`body-map ${p.class}`}
            {...restProps}
        >
            <legend class="body-map-legend">{p.label}</legend>
            {p.children ? (
                <div
                    ref={(el) => (figure.current = el)}
                    class="body-map-figure"
                    aria-hidden="true"
                    onClick={(event) => {
                        const id = (event.target as Element)
                            .closest("[data-region]")
                            ?.getAttribute("data-region");
                        if (id && p.regions.some((r) => r.id === id)) toggle(id);
                    }}
                >
                    {p.children}
                </div>
            ) : null}
            <ul class="body-map-regions">
                {p.regions.map((region) => (
                    <li>
                        <label class="body-map-region">
                            <input
                                type="checkbox"
                                name={p.name}
                                value={region.id}
                                checked={current().includes(region.id)}
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
