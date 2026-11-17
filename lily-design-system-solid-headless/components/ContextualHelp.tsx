// ContextualHelp component
//
// A help button that opens a popover with explanatory content. Inspired
// by Adobe Spectrum.
//
// Props:
//   class     — string, optional. CSS class name.
//   label         — string, REQUIRED. aria-label for the help trigger button (its accessible name).
//   triggerLabel  — string, REQUIRED. Visible text of the trigger, such as "?" or "؟". No default:
//                   the glyph is the consumer's, per script and locale; pass "" when CSS draws an icon.
//   expanded      — boolean, default false. Whether the popover is open (initial and controlled value).
//   onChange      — (value: boolean) => void. Called when the panel opens or closes (trigger,
//                   Escape, light dismiss).
//   onClick       — trigger click handler; event.preventDefault() stops the toggle.
//   children      — ReactNode, optional. Popover content.
//   ...restProps  — additional HTML attributes spread onto the root <div>.
//
// Behavior:
//   - Renders a <button> trigger with aria-haspopup="dialog", aria-expanded, aria-controls, and
//     command="toggle-popover" commandfor={panelId} (popovertarget for engines before command/commandfor)
//   - Renders a <div role="dialog" popover="auto"> panel with the panel id from useId(): the native
//     Popover API opens it, closes it on Escape and on a click outside (light dismiss), with no script
//   - The panel's toggle event keeps aria-expanded in step
//   - Where the Popover API is missing (jsdom, old engines) the click toggles and the panel uses `hidden`
//
// Headless rules:
//   - No CSS, no inline styles
//   - All user-facing strings are consumer-supplied (i18n)
//
// References:
//   - Adobe Spectrum ContextualHelp: https://spectrum.adobe.com/page/contextual-help/
//   - HTML command and commandfor: https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command

import type { JSX } from "@solidjs/web";
import { merge, omit, createSignal, createUniqueId } from "solid-js";
import { attr } from "./attr";
import { popoverSupported, usePopoverState } from "./Popover";

export interface ContextualHelpProps {
    class?: string;
    /** aria-label for the help trigger button (required) */
    label: string;
    /** Visible text of the trigger, such as "?" (required; no default) */
    triggerLabel: string;
    /** Whether the popover is open */
    expanded?: boolean;
    /** Called when the popover opens or closes */
    onChange?: (value: boolean) => void;
    /** Trigger click handler */
    onClick?: (event: MouseEvent) => void;
    /** Popover content */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ContextualHelp(props: ContextualHelpProps) {
    const p = merge({ class: "" as const, expanded: false }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "triggerLabel",
        "expanded",
        "onChange",
        "onClick",
        "children",
    );
    const reactId = createUniqueId();
    const panelId = () => `contextual-help-${reactId}-panel`;
    const panel: { current: HTMLDivElement | null } = { current: null };
    const [open, setOpen] = createSignal(() => p.expanded);

    function change(value: boolean) {
        setOpen(value);
        p.onChange?.(value);
    }
    usePopoverState(panel, open, () => change);

    function handleClick(event: MouseEvent) {
        p.onClick?.(event);
        if (event.defaultPrevented) return;
        // With the Popover API the browser toggles the panel and its toggle event calls change().
        if (panel.current && !popoverSupported(panel.current)) change(!open());
    }

    // command() and commandfor are not in React's DOM types yet; React 19 renders them as attributes.
    const command = () => ({ command: "toggle-popover", commandfor: panelId() });
    return (
        <div
            class={`contextual-help ${p.class}`}
            {...restProps}
        >
            <button
                class="contextual-help-trigger"
                type="button"
                aria-label={p.label}
                aria-haspopup="dialog"
                aria-expanded={attr(open())}
                aria-controls={panelId()}
                popovertarget={panelId()}
                {...command()}
                onClick={handleClick}
            >
                {p.triggerLabel}
            </button>
            <div
                ref={(el) => (panel.current = el)}
                class="contextual-help-panel"
                id={panelId()}
                role="dialog"
                aria-label={p.label}
                popover="auto"
            >
                {p.children}
            </div>
        </div>
    );
}
