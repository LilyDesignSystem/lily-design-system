// ShowMore component
//
// A headless "show more / show less" toggle. The content is always in the DOM
// and accessibility tree; the visual clamp is consumer CSS keyed on
// data-expanded on .show-more-content (no inline style).
//
// Props:
//   className -- string, optional. CSS class name.
//   moreLabel, lessLabel -- string, required. Button text per state (no default).
//   expanded -- boolean, default false. Bindable; supports onChange.
//   children -- ReactNode. The content.
//   ...restProps -- spread onto the root <div>.
//
// Keyboard: native <button> (Enter / Space).
// Accessibility: aria-expanded + aria-controls on the button.

import React, { useEffect, useId, useState } from "react";

export interface ShowMoreProps {
    className?: string;
    /** Button text while collapsed. */
    moreLabel: string;
    /** Button text while expanded. */
    lessLabel: string;
    /** Whether the content is expanded. Bindable. */
    expanded?: boolean;
    /** The content. */
    children?: React.ReactNode;
    /** Callback when expanded changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function ShowMore({
    className = "",
    moreLabel,
    lessLabel,
    expanded: expandedProp = false,
    onChange,
    children,
    ...restProps
}: ShowMoreProps) {
    const [expanded, setExpanded] = useState(expandedProp);
    useEffect(() => setExpanded(expandedProp), [expandedProp]);
    const contentId = `show-more-${useId()}`;

    return (
        <div className={`show-more ${className}`} {...restProps}>
            <div className="show-more-content" id={contentId} data-expanded={expanded}>
                {children}
            </div>
            <button
                type="button"
                className="show-more-button"
                aria-expanded={expanded}
                aria-controls={contentId}
                onClick={() => {
                    const next = !expanded;
                    setExpanded(next);
                    onChange?.(next);
                }}
            >
                {expanded ? lessLabel : moreLabel}
            </button>
        </div>
    );
}
