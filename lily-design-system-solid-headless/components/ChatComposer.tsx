// ChatComposer component
//
// A headless chat input form: a <textarea> that grows with its content (rows from the number of lines, clamped between minRows and maxRows) and ONE button that is "send" normally and turns into "stop" while `busy`. Enter sends; Shift+Enter inserts a line break; Enter while an IME composition is in progress does nothing. The send button is disabled, never hidden, when the text is empty or the form is disabled. The component never clears the text (the consumer does, in its send handler), never animates, and carries no strings: the textarea name, the send word and the stop word are required props. Models, attachments and menus are consumer composition (put them in the default slot, rendered before the textarea).
//
// Props: className, label, sendLabel, stopLabel (all required strings except class), value, onChange,
// placeholder, name, minRows (1), maxRows (8), busy, disabled, onSend(value), onStop(),
// children (before the textarea), ...restProps spread onto the root <form>.
// Keyboard: Enter sends; Shift+Enter inserts a line break; Enter during IME composition is ignored.

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface ChatComposerProps {
    class?: string;
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
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ChatComposer(props: ChatComposerProps) {
    const p = withDefaults(
        {
            class: "" as const,
            value: "" as const,
            minRows: 1,
            maxRows: 8,
            busy: false,
            disabled: false,
        },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "sendLabel",
        "stopLabel",
        "value",
        "onChange",
        "placeholder",
        "name",
        "minRows",
        "maxRows",
        "busy",
        "disabled",
        "onSend",
        "onStop",
        "children",
    );
    const empty = () => p.value.trim() === "";
    const rows = () => Math.min(p.maxRows, Math.max(p.minRows, p.value.split("\n").length));

    const trySend = () => {
        if (p.disabled || p.busy || empty()) return;
        p.onSend?.(p.value);
    };

    return (
        <form
            class={`chat-composer ${p.class}`}
            onSubmit={(e) => {
                e.preventDefault();
                trySend();
            }}
            {...restProps}
        >
            {p.children}
            <textarea
                class="chat-composer-input"
                aria-label={p.label}
                value={p.value}
                onInput={(e) => p.onChange?.(e.currentTarget.value)}
                rows={rows()}
                placeholder={p.placeholder}
                name={p.name}
                disabled={p.disabled}
                onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
                    // IME: Enter that confirms a composition must not send.
                    if (e.isComposing || e.keyCode === 229) return;
                    e.preventDefault();
                    trySend();
                }}
            ></textarea>
            <button
                class="chat-composer-button"
                type={p.busy ? "button" : "submit"}
                data-state={attr(p.busy ? "stop" : "send")}
                disabled={p.disabled || (!p.busy && empty())}
                onClick={p.busy ? () => p.onStop?.() : undefined}
            >
                <span class="chat-composer-button-label">{p.busy ? p.stopLabel : p.sendLabel}</span>
            </button>
        </form>
    );
}
