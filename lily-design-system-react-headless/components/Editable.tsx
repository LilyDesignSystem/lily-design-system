// Editable component
//
// An inline-editable text component that toggles between a read-only display
// and an input field for editing. The root is a <div class="editable">; in
// display mode it holds a native <button type="button"> showing the value, in edit
// mode an <input type="text">. Enter confirms the edit and Escape cancels it;
// focus moves to the input on edit and back to the button on confirm or cancel.
//
// Props:
//   className — string, optional. CSS class name.
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

import React, { useEffect, useRef, useState } from "react";
import { warnMissingName } from "./dev-warning";

export interface EditableProps {
    className?: string;
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

export default function Editable({
    className = "",
    value = "",
    label,
    editing: editingProp = false,
    disabled = false,
    onValueChange,
    onEditingChange,
    ...restProps
}: EditableProps) {
    warnMissingName("Editable", label, restProps["aria-label"], restProps["aria-labelledby"]);
    const [internalEditing, setInternalEditing] = useState(editingProp);
    const [internalValue, setInternalValue] = useState(value);
    const [draft, setDraft] = useState(value);

    const editing = onEditingChange ? editingProp : internalEditing;
    const currentValue = onValueChange ? value : internalValue;

    function setEditing(val: boolean) {
        setInternalEditing(val);
        onEditingChange?.(val);
    }

    function setValue(val: string) {
        setInternalValue(val);
        onValueChange?.(val);
    }

    // The element that had focus is removed by the switch, so focus follows the user to the element that replaces it.
    const inputRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const focusNext = useRef<"input" | "button" | null>(null);
    useEffect(() => {
        if (focusNext.current === "input") inputRef.current?.focus();
        else if (focusNext.current === "button") buttonRef.current?.focus();
        focusNext.current = null;
    }, [editing]);

    function startEditing() {
        if (disabled) return;
        setDraft(currentValue);
        focusNext.current = "input";
        setEditing(true);
    }

    function confirm() {
        setValue(draft);
        focusNext.current = "button";
        setEditing(false);
    }

    function cancel() {
        setDraft(currentValue);
        focusNext.current = "button";
        setEditing(false);
    }

    function handleKeyDown(event: React.KeyboardEvent) {
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
            className={`editable ${className}`}
            {...restProps}
        >
            {editing ? (
                <input
                    ref={inputRef}
                    className="editable-input"
                    type="text"
                    aria-label={label}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <button
                    ref={buttonRef}
                    className="editable-button"
                    type="button"
                    aria-label={currentValue ? `${currentValue}, ${label}` : label}
                    disabled={disabled}
                    onClick={startEditing}
                >
                    {currentValue}
                </button>
            )}
        </div>
    );
}
