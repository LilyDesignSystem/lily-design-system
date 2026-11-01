import { createSignal } from "solid-js";
import type {} from "../../../solid";
import "../../../dist/index.js";

// A form with a tooltip and a dialog, built from the Web Components catalog.
//  - attr:  sets an HTML attribute (what the elements observe); undefined removes it.
//  - prop:  sets a JavaScript property (e.g. the live `value` of a text input).
//  - on:    adds a native listener, needed for the custom "lily-close" event.
export function ContactForm(props: { onSend: (name: string) => void }) {
    const [name, setName] = createSignal("");
    const [help, setHelp] = createSignal(false);
    const [confirm, setConfirm] = createSignal(false);
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                setConfirm(true);
            }}
        >
            <lily-text-input
                label="Name"
                attr:required=""
                on:input={(e) => setName((e.target as HTMLInputElement).value)}
            />
            <button
                type="button"
                onFocus={() => setHelp(true)}
                onBlur={() => setHelp(false)}
            >
                Help
            </button>
            <lily-tooltip
                label="Your full name"
                attr:visible={help() ? "" : undefined}
            />
            <button type="submit">Send</button>
            <lily-dialog
                label="Confirm"
                attr:open={confirm() ? "" : undefined}
                on:lily-close={() => setConfirm(false)}
            >
                <p>Send {name()}?</p>
                <button
                    type="button"
                    onClick={() => {
                        props.onSend(name());
                        setConfirm(false);
                    }}
                >
                    Yes
                </button>
            </lily-dialog>
        </form>
    );
}
