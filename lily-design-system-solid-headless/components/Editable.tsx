// Editable component
//
// An inline-editable text component that toggles between a read-only display
// and an input field for editing. The root is a <div class="editable">; in
// display mode it holds a native <button type="button"> showing the value, in edit
// mode an <input type="text">. Enter confirms the edit and Escape cancels it;
// focus moves to the input on edit and back to the button on confirm or cancel.
//
// Props:
//   class — string, optional. CSS class name.
//   value — string, default "". Current text value; bindable.
//   label — string, required. Accessible name for the editable control.
//   editing — boolean, default false. Whether the component is in edit mode; bindable.
//   disabled — boolean, default false. Whether editing is disabled.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <Editable label="Name" value={value} onValueChange={setValue} />
//
// Examples:
//
//   <Editable label="Name" value={value} onValueChange={setValue} />
//
//
//   <Editable label="Title" value={value} onValueChange={setValue} editing={editing} onEditingChange={setEditing} />
//
// Keyboard:
//   - Enter or Space (display mode): activate edit mode (the native button's own keys)
//   - Enter (edit mode): confirm the edit and return to display mode
//   - Escape (edit mode): cancel the edit and return to display mode
//
// Accessibility:
//   - a native <button> in display mode: focusable, with Enter and Space, no role to add
//   - aria-label provides the accessible name in both modes; in view mode it is "value, label" so the visible
//     text is part of the name (WCAG 2.5.3 label in name)
//   - the button is disabled when `disabled` is true
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses internal draft state to allow cancel without losing original value
//   - Both value and editing support controlled two-way binding
//
// References:
//   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

import { merge, omit, createEffect, createSignal, untrack } from "solid-js";
import { warnMissingName } from "./dev-warning";

export interface EditableProps {
    class?: string;
    /** Current text value. Bindable. */
    value?: string;
    /** Accessible label for the editable control. */
    label: string;
    /** Whether the component is in edit mode. Bindable. */
    editing?: boolean;
    /** Whether editing is disabled. */
    disabled?: boolean;
    /** Callback when value changes. */
    onValueChange?: (value: string) => void;
    /** Callback when editing changes. */
    onEditingChange?: (editing: boolean) => void;
    [key: string]: unknown;
}

export default function Editable(props: EditableProps) {
    const p = merge(
        { class: "" as const, value: "" as const, editing: false, disabled: false },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "value",
        "label",
        "editing",
        "disabled",
        "onValueChange",
        "onEditingChange",
    );
    warnMissingName("Editable", p.label, p["aria-label"], p["aria-labelledby"]);
    const [internalEditing, setInternalEditing] = createSignal(untrack(() => p.editing));
    const [internalValue, setInternalValue] = createSignal(untrack(() => p.value));
    const [draft, setDraft] = createSignal(untrack(() => p.value));

    const editing = () => (p.onEditingChange ? p.editing : internalEditing());
    const currentValue = () => (p.onValueChange ? p.value : internalValue());

    function setEditing(val: boolean) {
        setInternalEditing(val);
        p.onEditingChange?.(val);
    }

    function setValue(val: string) {
        setInternalValue(val);
        p.onValueChange?.(val);
    }

    // The element that had focus is removed by the switch, so focus follows the user to the element that replaces it.
    const inputRef: { current: HTMLInputElement | null } = { current: null };
    const buttonRef: { current: HTMLButtonElement | null } = { current: null };
    const focusNext: { current: "input" | "button" | null | null } = { current: null };
    createEffect(
        () => [editing()],
        () =>
            untrack(() => {
                if (focusNext.current === "input") inputRef.current?.focus();
                else if (focusNext.current === "button") buttonRef.current?.focus();
                focusNext.current = null;
            }),
    );

    function startEditing() {
        if (p.disabled) return;
        setDraft(currentValue());
        focusNext.current = "input";
        setEditing(true);
    }

    function confirm() {
        setValue(draft());
        focusNext.current = "button";
        setEditing(false);
    }

    function cancel() {
        setDraft(currentValue());
        focusNext.current = "button";
        setEditing(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault();
            confirm();
        } else if (event.key === "Escape") {
            event.preventDefault();
            cancel();
        }
    }

    return (
        <div
            class={`editable ${p.class}`}
            {...restProps}
        >
            {editing() ? (
                <input
                    ref={(el) => (inputRef.current = el)}
                    class="editable-input"
                    type="text"
                    aria-label={p.label}
                    value={draft()}
                    onInput={(e) => setDraft(e.currentTarget.value)}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <button
                    ref={(el) => (buttonRef.current = el)}
                    class="editable-button"
                    type="button"
                    aria-label={currentValue() ? `${currentValue()}, ${p.label}` : p.label}
                    disabled={p.disabled}
                    onClick={startEditing}
                >
                    {currentValue()}
                </button>
            )}
        </div>
    );
}
