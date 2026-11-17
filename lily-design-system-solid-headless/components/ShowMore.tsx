// ShowMore component
//
// A headless "show more / show less" toggle. The content is always in the DOM
// and accessibility tree; the visual clamp is consumer CSS keyed on
// data-expanded on .show-more-content (no inline style).
//
// Props:
//   class -- string, optional. CSS class name.
//   moreLabel, lessLabel -- string, required. Button text per state (no default).
//   expanded -- boolean, default false. Bindable; supports onChange.
//   children -- ReactNode. The content.
//   ...restProps -- spread onto the root <div>.
//
// Keyboard: native <button> (Enter / Space).
// Accessibility: aria-expanded + aria-controls on the button.

import type { JSX } from "@solidjs/web";
import { omit, createSignal, createUniqueId } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface ShowMoreProps {
    class?: string;
    /** Button text while collapsed. */
    moreLabel: string;
    /** Button text while expanded. */
    lessLabel: string;
    /** Whether the content is expanded. Bindable. */
    expanded?: boolean;
    /** The content. */
    children?: JSX.Element;
    /** Callback when expanded changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function ShowMore(props: ShowMoreProps) {
    const p = withDefaults({ class: "" as const, expanded: false }, props);
    const restProps = omit(
        p,
        "class",
        "moreLabel",
        "lessLabel",
        "expanded",
        "onChange",
        "children",
    );
    const [expanded, setExpanded] = createSignal(() => p.expanded);
    const contentId = `show-more-${createUniqueId()}`;

    return (
        <div
            class={`show-more ${p.class}`}
            {...restProps}
        >
            <div
                class="show-more-content"
                id={contentId}
                data-expanded={attr(expanded())}
            >
                {p.children}
            </div>
            <button
                type="button"
                class="show-more-button"
                aria-expanded={attr(expanded())}
                aria-controls={contentId}
                onClick={() => {
                    const next = !expanded();
                    setExpanded(next);
                    p.onChange?.(next);
                }}
            >
                {expanded() ? p.lessLabel : p.moreLabel}
            </button>
        </div>
    );
}
