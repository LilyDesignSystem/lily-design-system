// MentionsInput component
//
// A text input with at-mention autocomplete suggestions. The component is a
// `<div>` wrapping an `<input role="combobox">` and a suggestions panel that
// the consumer fills (typically with a Listbox of matching mentions).
//
// Props:
//   className    — string, optional. CSS class name.
//   label        — string, REQUIRED. aria-label for the input.
//   value        — string, default "". Input value.
//   triggerChar  — string, default "@". Character that opens the suggestions panel.
//   expanded     — boolean, default false. Whether the suggestions panel is open.
//   placeholder  — string, optional.
//   disabled     — boolean, default false.
//   onInput      — (event: React.FormEvent<HTMLInputElement>) => void, optional.
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
//     aria-expanded, aria-autocomplete="list".
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

import React from "react";

export interface MentionsInputProps {
    className?: string;
    /** aria-label for the input (required) */
    label: string;
    /** Input value */
    value?: string;
    /** Character that opens the suggestions panel */
    triggerChar?: string;
    /** Whether the suggestions panel is open */
    expanded?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Input event handler */
    onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
    /** Suggestions panel content (typically a Listbox) */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function MentionsInput({
    className = "",
    label,
    value = "",
    triggerChar = "@",
    expanded = false,
    placeholder = undefined,
    disabled = false,
    onInput = undefined,
    children,
    ...restProps
}: MentionsInputProps) {
    return (
        <div
            className={`mentions-input ${className}`}
            data-trigger-char={triggerChar}
            {...restProps}
        >
            <input
                className="mentions-input-control"
                type="text"
                role="combobox"
                aria-label={label}
                aria-haspopup="listbox"
                aria-expanded={expanded}
                aria-autocomplete="list"
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onInput={onInput}
                onChange={() => {}}
            />
            <div className="mentions-input-suggestions" hidden={!expanded}>
                {children}
            </div>
        </div>
    );
}
