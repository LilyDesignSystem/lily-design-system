// FiveFaceRatingPicker component
//
// A five-face rating input that lets users select a satisfaction level from 1 to 5
// using labeled radio buttons representing faces from "Very bad" to "Very good".
// Commonly used in satisfaction surveys, feedback forms, and experience ratings
// where face-based labels are more intuitive than numeric scales.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the rating group via aria-label.
//   value — number, default 0. Current rating (1-5, 0 = none); bindable via value + onChange.
//   name — string, default "face-rating". Radio group name for form submission.
//   labels — string[], default ["Very bad", "Bad", "Okay", "Good", "Very good"]. Accessible labels for each face.
//   disabled — boolean, default false. Whether the entire group is disabled.
//   ...restProps — additional HTML attributes spread onto the fieldset.
//
// Syntax:
//   <FiveFaceRatingPicker label="How was your experience?" value={value} onChange={setValue} />
//
// Examples:
//
//   <FiveFaceRatingPicker label="How was your experience?" value={rating} onChange={setRating} />
//
//
//   <FiveFaceRatingPicker label="Rate service" value={value} onChange={setValue} labels={["Terrible", "Poor", "Fair", "Great", "Excellent"]} />
//
// Keyboard:
//   - Tab: Focus the selected radio (or first if none selected)
//   - ArrowDown / ArrowRight: Move to next radio button
//   - ArrowUp / ArrowLeft: Move to previous radio button
//   - Space: Select the focused radio button
//
// Accessibility:
//   - role="radiogroup" on the fieldset identifies the group as a set of radio buttons
//   - aria-label provides an accessible name for the entire rating group
//   - Each radio button has a visible text label for screen reader announcement
//
// Internationalization:
//   - All text content comes through the labels prop; no hardcoded user-facing strings
//   - The label prop allows localized accessible names
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses native radio buttons for built-in keyboard and accessibility behavior
//   - Value 0 means no selection; valid ratings are 1-5
//
// References:
//   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/

import React, { useState } from "react";

export interface FiveFaceRatingPickerProps {
    className?: string;
    /** Accessible name for the rating group via aria-label. */
    label: string;
    /** Current rating (1-5, 0 = none). Bindable via value + onChange. */
    value?: number;
    /** Radio group name for form submission. */
    name?: string;
    /** Labels for each face (array of 5 strings). */
    labels?: string[];
    /** Whether the entire group is disabled. */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: number) => void;
    [key: string]: unknown;
}

export default function FiveFaceRatingPicker({
    className = "",
    label,
    value: valueProp = 0,
    name = "face-rating",
    labels = ["Very bad", "Bad", "Okay", "Good", "Very good"],
    disabled = false,
    onChange,
    ...restProps
}: FiveFaceRatingPickerProps) {
    const [value, setValue] = useState(valueProp);
    const faces = [1, 2, 3, 4, 5];

    const handleChange = (face: number) => {
        setValue(face);
        onChange?.(face);
    };

    return (
        <fieldset
        className={`five-face-rating-picker ${className}`}
        role="radiogroup"
        aria-label={label}
        disabled={disabled}
        {...restProps}
        >
        {faces.map((face, i) => (
        <React.Fragment key={face}>
        <label>
        <input
        type="radio"
        name={name}
        value={face}
        checked={value === face}
        onChange={() => handleChange(face)}
        />
        {labels[i]}
        </label>
        </React.Fragment>
        ))}
        </fieldset>
    );
}
