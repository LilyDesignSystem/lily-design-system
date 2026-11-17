// KbdShortcut component
//
// A headless keyboard-shortcut display: an outer <kbd> holding one inner
// <kbd class="kbd-shortcut-key"> per key, with aria-hidden separators between.
//
// Props:
//   class -- string, optional. CSS class name.
//   keys -- string[], required. Key names in order.
//   separator -- string, default "+". Decorative; aria-hidden.
//   label -- string, optional. Spoken form via aria-label; absent = keys are read.
//   ...restProps -- spread onto the root <kbd>.

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface KbdShortcutProps {
    class?: string;
    /** Key names, in order. */
    keys: string[];
    /** Decorative separator between keys. */
    separator?: string;
    /** Spoken form, read instead of the visible keys. */
    label?: string;
    [key: string]: unknown;
}

export default function KbdShortcut(props: KbdShortcutProps) {
    const p = withDefaults({ class: "" as const, separator: "+" as const }, props);
    const restProps = omit(p, "class", "keys", "separator", "label");
    return (
        <kbd
            class={`kbd-shortcut ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.keys.map((key, i) => (
                <>
                    {i > 0 && (
                        <span
                            class="kbd-shortcut-separator"
                            aria-hidden="true"
                        >
                            {p.separator}
                        </span>
                    )}
                    <kbd
                        class="kbd-shortcut-key"
                        aria-hidden={attr(p.label ? "true" : undefined)}
                    >
                        {key}
                    </kbd>
                </>
            ))}
        </kbd>
    );
}
