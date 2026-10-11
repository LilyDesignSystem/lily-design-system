// ChatComposer component
//
// A headless chat input form: a <textarea> that grows with its content (rows from the number of lines, clamped between minRows and maxRows) and ONE button that is "send" normally and turns into "stop" while `busy`. Enter sends; Shift+Enter inserts a line break; Enter while an IME composition is in progress does nothing. The send button is disabled, never hidden, when the text is empty or the form is disabled. The component never clears the text (the consumer does, in its send handler), never animates, and carries no strings: the textarea name, the send word and the stop word are required props. Models, attachments and menus are consumer composition (put them in the default slot, rendered before the textarea).
//
// Props: className, label, sendLabel, stopLabel (all required strings except className), value, onChange,
// placeholder, name, minRows (1), maxRows (8), busy, disabled, onSend(value), onStop(),
// children (before the textarea), ...restProps spread onto the root <form>.
// Keyboard: Enter sends; Shift+Enter inserts a line break; Enter during IME composition is ignored.

import React from "react";

export interface ChatComposerProps {
    className?: string;
    /** Accessible name of the textarea. */
    label: string;
    /** Word for the send button. */
    sendLabel: string;
    /** Word for the stop button. */
    stopLabel: string;
    /** The text (controlled). */
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    name?: string;
    minRows?: number;
    maxRows?: number;
    /** A reply is in progress. */
    busy?: boolean;
    disabled?: boolean;
    onSend?: (value: string) => void;
    onStop?: () => void;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ChatComposer({
    className = "",
    label,
    sendLabel,
    stopLabel,
    value = "",
    onChange,
    placeholder = undefined,
    name = undefined,
    minRows = 1,
    maxRows = 8,
    busy = false,
    disabled = false,
    onSend,
    onStop,
    children,
    ...restProps
}: ChatComposerProps) {
    const empty = value.trim() === "";
    const rows = Math.min(maxRows, Math.max(minRows, value.split("\n").length));

    const trySend = () => {
        if (disabled || busy || empty) return;
        onSend?.(value);
    };

    return (
        <form
            className={`chat-composer ${className}`}
            onSubmit={(e) => {
                e.preventDefault();
                trySend();
            }}
            {...restProps}
        >
            {children}
            <textarea
                className="chat-composer-input"
                aria-label={label}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                rows={rows}
                placeholder={placeholder}
                name={name}
                disabled={disabled}
                onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
                    // IME: Enter that confirms a composition must not send.
                    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
                    e.preventDefault();
                    trySend();
                }}
            ></textarea>
            <button
                className="chat-composer-button"
                type={busy ? "button" : "submit"}
                data-state={busy ? "stop" : "send"}
                disabled={disabled || (!busy && empty)}
                onClick={busy ? () => onStop?.() : undefined}
            >
                <span className="chat-composer-button-label">{busy ? stopLabel : sendLabel}</span>
            </button>
        </form>
    );
}
