// Editable component
//
// An inline-editable text component that toggles between a read-only display
// and an input field for editing. In display mode it renders a <span> with
// role="button"; in edit mode it renders an <input type="text">. Pressing
// Enter confirms the edit and Escape cancels it, reverting to the original value.
//
// Props:
//   className — string, optional. CSS class name.
//   value — string, default "". Current text value; bindable.
//   label — string, required. Accessible name for the editable control.
//   editing — boolean, default false. Whether the component is in edit mode; bindable.
//   disabled — boolean, default false. Whether editing is disabled.
//   ...restProps — additional HTML attributes spread onto the <span> or <input>.
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
//   - Enter (display mode): activate edit mode
//   - Space (display mode): activate edit mode
//   - Enter (edit mode): confirm the edit and return to display mode
//   - Escape (edit mode): cancel the edit and return to display mode
//
// Accessibility:
//   - role="button" on the display span indicates it is activatable
//   - aria-label provides the accessible name in both modes
//   - aria-disabled on the span when disabled
//   - tabindex="0" when enabled, tabindex="-1" when disabled
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

import React, { useState } from "react";

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

    function startEditing() {
        if (disabled) return;
        setDraft(currentValue);
        setEditing(true);
    }

    function confirm() {
        setValue(draft);
        setEditing(false);
    }

    function cancel() {
        setDraft(currentValue);
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
        <>
            {editing ? (
                <input
                    className={`editable ${className}`}
                    type="text"
                    aria-label={label}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    {...restProps}
                />
            ) : (
                <span
                    className={`editable ${className}`}
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    aria-label={label}
                    aria-disabled={disabled || undefined}
                    onClick={startEditing}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            startEditing();
                        }
                    }}
                    {...restProps}
                >
                    {currentValue}
                </span>
            )}
        </>
    );
}
