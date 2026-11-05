// TagInputDiv component
//
// A group holding the consumer's tags and a text field that adds to them. When
// the user types a value and presses Enter, the component calls the onAdd
// callback with the trimmed text and clears the field. The tags are the
// consumer's: it keeps the collection and renders it as children, with its own
// remove buttons.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the group and the field, via aria-label.
//   value — string, default "". Current input text; bindable with value + onChange.
//   onAdd — (value: string) => void, optional. Callback fired when Enter is pressed with non-empty trimmed value.
//   disabled — boolean, default false. Whether the field is disabled.
//   placeholder, name, required — set on the field.
//   children — ReactNode, optional. The tags so far.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <TagInputDiv label="Add tag" value={value} onChange={setValue} onAdd={(tag) => setTags([...tags, tag])} />
//
// Examples:
//
//   <TagInputDiv label="Add skill" value={value} onChange={setValue} onAdd={(skill) => setSkills([...skills, skill])} />
//
// Keyboard:
//   - Enter: when the field has a non-empty trimmed value, calls onAdd and clears the field.
//     With no text it stays a normal Enter, which submits a surrounding form. Enter during
//     an IME composition confirms the composition, so it adds nothing.
//
// Accessibility:
//   - role="group" with aria-label={label} names the tags and the field together
//   - aria-label={label} names the text field
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Uses controlled for two-way binding on value
//   - Enter handler calls preventDefault to avoid form submission
//
// References:
//   - WAI-ARIA textbox role: https://www.w3.org/TR/wai-aria-1.2/#textbox

import React from "react";
import { warnMissingName } from "./dev-warning";

export interface TagInputDivProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Current input value. Bindable. */
    value?: string;
    /** Callback when a tag is submitted. */
    onAdd?: (value: string) => void;
    /** Whether disabled. */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    /** The field's placeholder. */
    placeholder?: string;
    /** The field's name. */
    name?: string;
    /** Whether the field is required. */
    required?: boolean;
    /** The tags so far. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function TagInputDiv({
    className = "",
    label,
    value = "",
    onAdd,
    disabled = false,
    onChange,
    placeholder,
    name,
    required = false,
    children,
    ...restProps
}: TagInputDivProps) {
    warnMissingName("TagInputDiv", label, restProps["aria-label"], restProps["aria-labelledby"]);
    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Enter" && !event.nativeEvent.isComposing && value.trim()) {
            event.preventDefault();
            onAdd?.(value.trim());
            onChange?.("");
        }
    }

    return (
        <div
            className={`tag-input-div ${className}`}
            role="group"
            aria-label={label}
            {...restProps}
        >
            {children}
            <input
                className="tag-input-div-field"
                type="text"
                aria-label={label}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                placeholder={placeholder}
                name={name}
                required={required}
            />
        </div>
    );
}
