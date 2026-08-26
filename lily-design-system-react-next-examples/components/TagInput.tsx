// TagInput component
//
// A headless text input for adding tags to a collection. When the user types
// a value and presses Enter, the component calls the onAdd callback with the
// trimmed text and automatically clears the input, providing a streamlined
// tag entry experience. Commonly used alongside TagGroup for tag management
// interfaces such as adding skills, keywords, or labels.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the input via aria-label.
//   value — string, default "". Current input text; bindable with value + onChange.
//   onAdd — (value: string) => void, optional. Callback fired when Enter is pressed with non-empty trimmed value.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <TagInput label="Add tag" value={value} onChange={setValue} onAdd={(tag) => setTags([...tags, tag])} />
//
// Examples:
//
//   <TagInput label="Add skill" value={value} onChange={setValue} onAdd={(skill) => setSkills([...skills, skill])} />
//
// Keyboard:
//   - Enter: when the input has a non-empty trimmed value, calls onAdd and clears input
//
// Accessibility:
//   - aria-label={label} provides an accessible name for the text input
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

export interface TagInputProps {
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
    [key: string]: unknown;
}

export default function TagInput({
    className = "",
    label,
    value = "",
    onAdd,
    disabled = false,
    onChange,
    ...restProps
}: TagInputProps) {
    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Enter" && value.trim()) {
            event.preventDefault();
            onAdd?.(value.trim());
            onChange?.("");
        }
    }

    return (
        <input
        className={`tag-input ${className}`}
        type="text"
        aria-label={label}
        value={value} onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        {...restProps}
        />
    );
}
