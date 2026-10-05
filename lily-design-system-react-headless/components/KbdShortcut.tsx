// KbdShortcut component
//
// A headless keyboard-shortcut display: an outer <kbd> holding one inner
// <kbd class="kbd-shortcut-key"> per key, with aria-hidden separators between.
//
// Props:
//   className -- string, optional. CSS class name.
//   keys -- string[], required. Key names in order.
//   separator -- string, default "+". Decorative; aria-hidden.
//   label -- string, optional. Spoken form via aria-label; absent = keys are read.
//   ...restProps -- spread onto the root <kbd>.

import React from "react";

export interface KbdShortcutProps {
    className?: string;
    /** Key names, in order. */
    keys: string[];
    /** Decorative separator between keys. */
    separator?: string;
    /** Optional spoken form (aria-label). */
    label?: string;
    [key: string]: unknown;
}

export default function KbdShortcut({
    className = "",
    keys,
    separator = "+",
    label = undefined,
    ...restProps
}: KbdShortcutProps) {
    return (
        <kbd className={`kbd-shortcut ${className}`} aria-label={label} {...restProps}>
            {keys.map((key, i) => (
                <React.Fragment key={i}>
                    {i > 0 && (
                        <span className="kbd-shortcut-separator" aria-hidden="true">
                            {separator}
                        </span>
                    )}
                    <kbd className="kbd-shortcut-key">{key}</kbd>
                </React.Fragment>
            ))}
        </kbd>
    );
}
