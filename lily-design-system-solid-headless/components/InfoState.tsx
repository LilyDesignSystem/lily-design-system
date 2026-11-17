// InfoState component
//
// A headless composition for empty, info, error, and success state messages.
// Renders a <section role="status"> with optional illustration, a title <h2>,
// optional description <p>, and an optional action area. The `level` prop is
// exposed via data-level for consumer styling. Consumers may alternatively
// supply `children` for fully custom content.
//
// Props:
//   class     — string, optional. CSS class name.
//   level         — "info" | "empty" | "error" | "success", default "info".
//   title         — string, required. Heading text.
//   description   — string, optional. Body text.
//   label         — string, optional. aria-label override (defaults to title).
//   illustration  — ReactNode, optional. Visual element above title.
//   action        — ReactNode, optional. Action area below description.
//   children      — ReactNode, optional. Custom content (replaces title/description/action).
//   ...restProps  — additional HTML attributes spread onto the <section>.
//
// Syntax:
//   <InfoState level="empty" title="No results" description="Try a different search." />
//
// Examples:
//
//   <InfoState
//     level="empty"
//     title="Your inbox is empty"
//     description="When you get a message it will show up here."
//     illustration={<EmptyIllustration />}
//     action={<button onClick={refresh}>Refresh</button>}
//   />
//
//
//   <InfoState level="error" title="Something went wrong">
//     <p>Custom content goes here.</p>
//   </InfoState>
//
// Keyboard: None — display container.
//
// Accessibility:
//   - role="status" announces the state to assistive technologies politely
//   - aria-label defaults to title; override via label prop
//   - data-level exposed for consumer styling
//
// Internationalization:
//   - title, description, and label all consumer-supplied strings
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - When children is provided, it replaces the default title/description/action layout
//
// References:
//   - WAI-ARIA role="status": https://www.w3.org/WAI/ARIA/apg/patterns/alert/

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
export interface InfoStateProps {
    class?: string;
    /** Severity / category of the state */
    level?: "info" | "empty" | "error" | "success";
    /** Heading text (required) */
    title: string;
    /** Body text */
    description?: string;
    /** aria-label override; defaults to title */
    label?: string;
    /** Visual element rendered above the title */
    illustration?: JSX.Element;
    /** Call-to-action area rendered after description */
    action?: JSX.Element;
    /** Custom content (replaces default title/description/action layout) */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function InfoState(props: InfoStateProps) {
    const p = merge({ class: "" as const, level: "info" as const }, props);
    const restProps = omit(
        p,
        "class",
        "level",
        "title",
        "description",
        "label",
        "illustration",
        "action",
        "children",
    );
    return (
        <section
            class={`info-state ${p.class}`}
            role="status"
            aria-label={p.label ?? p.title}
            data-level={attr(p.level)}
            {...restProps}
        >
            {p.children !== undefined ? (
                p.children
            ) : (
                <>
                    {p.illustration !== undefined ? p.illustration : null}
                    <h2>{p.title}</h2>
                    {p.description !== undefined ? <p>{p.description}</p> : null}
                    {p.action !== undefined ? p.action : null}
                </>
            )}
        </section>
    );
}
