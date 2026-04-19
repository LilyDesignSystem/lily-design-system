// SearchInput component
//
// A headless search field using the native HTML <input type="search"> element.
// Provides semantic search meaning and may trigger browser-specific behaviors
// such as a clear button, search icon, or search-optimized mobile keyboard.
// Commonly used for site-wide search bars, filtering lists, and query entry.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Current search text; bindable with value + onChange.
//   required — boolean, default false. Whether the field must be filled before form submission.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <SearchInput label="Search" value={value} onChange={setValue} />
//
// Examples:
//
//   <SearchInput label="Filter products" value={query} onChange={setQuery} required />
//
//
//   <SearchInput label="Search articles" value={value} onChange={setValue} placeholder="Type to search..." name="q" />
//
// Keyboard:
//   - Escape: clears the search field (browser-native behavior for search inputs)
//   - Enter: submits the containing form (standard input behavior)
//
// Accessibility:
//   - aria-label provides the accessible name since there is no visible <label> element
//   - Native <input type="search"> has implicit search semantics
//
// Internationalization:
//   - The label prop externalizes the accessible name for localization
//   - Placeholder text should be provided via restProps for localization
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Value uses controlled for two-way binding with value + onChange
//   - No visible <label> element — relies on aria-label
//
// References:
//   - MDN input type="search": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search
//   - WAI-ARIA Search Role: https://www.w3.org/WAI/ARIA/apg/patterns/search/

import React from "react";

export interface SearchInputProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Current value. Bindable. */
    value?: string;
    /** Whether required. */
    required?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function SearchInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: SearchInputProps) {
    return (
        <input
        className={`search ${className}`}
        type="search"
        aria-label={label}
        value={value} onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
