// WarningText component
//
// A short warning: an optional decorative icon and one bold line of text (the GOV.UK and DHCW
// warning-text pattern). The icon is the consumer's (Lily bundles none) and is hidden from
// assistive technology. The visually hidden prefix, such as "Warning", is part of the
// consumer's children, in the consumer's language; there is no prop or default for it.
//
// Props:
//   class — string, optional. CSS class name appended to the base class.
//   icon      — ReactNode, optional. Decorative icon, rendered inside an aria-hidden span.
//   children  — ReactNode, required. The hidden prefix, then the warning text.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <WarningText icon="!">
//     <span class="screen-reader-span">Warning</span> You can be fined if you do not register.
//   </WarningText>

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface WarningTextProps {
    class?: string;
    /** Decorative icon (aria-hidden) */
    icon?: JSX.Element;
    /** The visually hidden prefix, then the warning text */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function WarningText(props: WarningTextProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "icon", "children");
    return (
        <div
            class={`warning-text ${p.class}`}
            {...restProps}
        >
            {p.icon != null && p.icon !== false && (
                <span
                    class="warning-text-icon"
                    aria-hidden="true"
                >
                    {p.icon}
                </span>
            )}
            <strong class="warning-text-text">{p.children}</strong>
        </div>
    );
}
