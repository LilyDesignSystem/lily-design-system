// CharacterCounter component
//
// A headless character counter that displays real-time character count
// information for a text input. Renders a <span> holding the visible count, hidden
// from assistive technology, and a visually hidden role="status" that takes
// the same text once typing pauses (announceDelay), so a run of keystrokes is
// announced once, as GOV.UK's character count does. Shows "count / max" when a maximum is provided, or just the count
// otherwise. Used alongside text inputs with character limits such as tweets,
// SMS fields, form fields, or bios.
//
// Props:
//   className — string, optional. CSS class name.
//   count — number, default 0. Current character count.
//   max — number, optional. Maximum allowed characters; enables remaining/over-limit tracking.
//   label — string, optional. Accessible label for the status via aria-label.
//   announceDelay — number, default 1000. Milliseconds of quiet before the status takes the new count.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <CharacterCounter count={text.length} max={280} label="Characters" />
//
// Examples:
//
//   <CharacterCounter count={text.length} max={280} label="Character count" />
//
//
//   <CharacterCounter count={text.length} label="Characters typed" />
//
// Keyboard:
//   None — this component is a passive status display.
//
// Accessibility:
//   - .character-counter-text is the visible count, aria-hidden="true"
//   - .character-counter-status (also .screen-reader-span) is role="status", updated announceDelay ms after the count
//     stops changing: one announcement for a run of keystrokes
//   - aria-label provides context for what the counter represents
//   - data-count, data-max, data-remaining, data-over-limit for CSS selectors
//
// Internationalization:
//   - Label text comes through the label prop; no hardcoded strings
//   - Display format is "count / max" — consumer can override via CSS or wrapper
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - data-over-limit attribute is only present when count exceeds max
//   - Uses computed for computed remaining and overLimit values
//
// References:
//   - WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status

import React, { useEffect, useState } from "react";

export interface CharacterCounterProps {
    className?: string;
    /** Current character count */
    count?: number;
    /** Maximum allowed characters (optional) */
    max?: number;
    /** Accessible label for the status */
    label?: string;
    /** Milliseconds of quiet before the status takes the new count */
    announceDelay?: number;
    [key: string]: unknown;
}

export default function CharacterCounter({
    className = "",
    count = 0,
    max = undefined,
    label = undefined,
    announceDelay = 1000,
    ...restProps
}: CharacterCounterProps) {
    const remaining = max != null ? max - count : undefined;

    const overLimit = max != null && count > max;

    const displayText = max != null ? `${count} / ${max}` : `${count}`;

    // The status takes the text only once the count has stopped changing for announceDelay ms, so a run of keystrokes is
    // announced once, as GOV.UK's character count does. The visible count is hidden from assistive technology.
    const [announced, setAnnounced] = useState(displayText);
    useEffect(() => {
        const timer = setTimeout(() => setAnnounced(displayText), announceDelay);
        return () => clearTimeout(timer);
    }, [displayText, announceDelay]);

    return (
        <span
            className={`character-counter ${className}`}
            data-count={count}
            data-max={max}
            data-remaining={remaining}
            data-over-limit={overLimit || undefined}
            {...restProps}
        >
            <span
                className="character-counter-text"
                aria-hidden="true"
            >
                {displayText}
            </span>
            <span
                className="character-counter-status screen-reader-span"
                role="status"
                aria-label={label}
            >
                {announced}
            </span>
        </span>
    );
}
