// MentionsInput component
//
// A text input with at-mention autocomplete suggestions. The component is a
// `<div>` wrapping an `<input role="combobox">` and a suggestions panel that
// the consumer fills (typically with a Listbox of matching mentions).
//
// Props:
//   class    — string, optional. CSS class name.
//   label        — string, REQUIRED. aria-label for the input.
//   value        — string, default "". Input value.
//   triggerChar  — string, default "@". Character that opens the suggestions panel.
//   expanded     — boolean, default false. Whether the suggestions panel is open.
//   placeholder  — string, optional.
//   disabled     — boolean, default false.
//   onInput      — (event: Event & { currentTarget: HTMLInputElement }) => void, optional.
//   children     — ReactNode, required. Suggestions panel content.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <MentionsInput label="Comment" value={text} expanded={open} onInput={handle}>
//     <Listbox>…</Listbox>
//   </MentionsInput>
//
// Accessibility:
//   - The inner input has role="combobox", aria-haspopup="listbox",
//     aria-expanded, aria-autocomplete="list", aria-controls (the panel's id).
//
// Internationalization:
//   - All user-facing strings (label, placeholder) are consumer-supplied.
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label is non-optional
//
// References:
//   - Ant Design Mentions: https://ant.design/components/mentions

import type { JSX } from "@solidjs/web";
import { omit, createUniqueId, onSettled, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { attachMentions } from "./widget-keys";
import { usePopoverState } from "./Popover";

export interface MentionsInputProps {
    class?: string;
    /** aria-label for the input (required) */
    label: string;
    /** Input value */
    value?: string;
    /** Character that opens the suggestions panel */
    triggerChar?: string;
    /** Whether the suggestions panel is open */
    expanded?: boolean;
    /** Called when the list opens or closes. */
    onExpandedChange?: (open: boolean) => void;
    /** Called with the text after the trigger character. */
    onQuery?: (query: string) => void;
    /** Called with the mention written. */
    onSelect?: (value: string) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Input event handler */
    onInput?: (event: Event & { currentTarget: HTMLInputElement }) => void;
    /** Suggestions panel content (typically a Listbox) */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function MentionsInput(props: MentionsInputProps) {
    const p = withDefaults(
        {
            class: "" as const,
            value: "" as const,
            triggerChar: "@" as const,
            expanded: false,
            disabled: false,
        },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "value",
        "triggerChar",
        "expanded",
        "onExpandedChange",
        "onQuery",
        "onSelect",
        "placeholder",
        "disabled",
        "onInput",
        "children",
    );
    const panelRef: { current: HTMLDivElement | null } = { current: null };
    usePopoverState(panelRef, () => p.expanded);
    const suggestionsId = `${createUniqueId()}-suggestions`;
    const rootRef: { current: HTMLDivElement | null } = { current: null };
    // The latest props, read live: a Solid component body runs once.
    const latest = {
        get current() {
            return {
                onExpandedChange: p.onExpandedChange,
                onQuery: p.onQuery,
                onSelect: p.onSelect,
            };
        },
    };
    onSettled(() =>
        untrack(() =>
            attachMentions(rootRef.current!, {
                onOpen: (open) => latest.current.onExpandedChange?.(open),
                onQuery: (query) => latest.current.onQuery?.(query),
                onSelect: (mention) => latest.current.onSelect?.(mention),
            }),
        ),
    );

    return (
        <div
            ref={(el) => (rootRef.current = el)}
            class={`mentions-input ${p.class}`}
            data-trigger-char={attr(p.triggerChar)}
            {...restProps}
        >
            <input
                class="mentions-input-control"
                type="text"
                role="combobox"
                aria-label={p.label}
                aria-haspopup="listbox"
                aria-controls={suggestionsId}
                aria-expanded={attr(p.expanded)}
                aria-autocomplete="list"
                value={p.value}
                placeholder={p.placeholder}
                disabled={p.disabled}
                onInput={p.onInput}
            />
            <div
                class="mentions-input-suggestions"
                id={suggestionsId}
                ref={(el) => (panelRef.current = el)}
                popover="manual"
            >
                {p.children}
            </div>
        </div>
    );
}
