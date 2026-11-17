// TextInputWithSearch component
//
// A headless component that wraps a native <input type="text"> and
// <button type="button"> inside a <div role="search">. The search button
// triggers a callback with the current input value. Pressing Enter in the
// input also triggers the search. Useful for search bars, filter inputs,
// lookup fields, and any interface with an explicit search action.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the search region via aria-label.
//   inputLabel — string, required. No default: the words are yours. Accessible name for the text input.
//   searchLabel — string, required. No default: the words are yours. Accessible label and text for the search button.
//   value — string, default "". Current text input value.
//   placeholder — string, optional. Placeholder text for the input.
//   onChange — (value: string) => void, optional. Callback when input value changes.
//   onSearch — (value: string) => void, optional. Callback when search is triggered.
//   required — boolean, default false. Whether the input is required.
//   disabled — boolean, default false. Whether the input and button are disabled.
//   ...restProps — additional HTML attributes spread onto the wrapper <div>.
//
// Syntax:
//   <TextInputWithSearch label="Site search" onSearch={handleSearch} />
//
// Keyboard:
//   - Tab: Moves focus between input and search button
//   - Enter in input: Triggers search
//   - Enter/Space on button: Triggers search
//
// Accessibility:
//   - role="search" on wrapper for search landmark
//   - aria-label on region, input, and button
//
// Internationalization:
//   - label, inputLabel, searchLabel, placeholder are the only user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - restProps spread onto the wrapper <div>, not the input
//
// References:
//   - WAI-ARIA search role: https://www.w3.org/TR/wai-aria-1.2/#search

import { merge, omit } from "solid-js";
import { warnMissingName } from "./dev-warning";

export interface TextInputWithSearchProps {
    class?: string;
    /** Accessible name for the search region */
    label: string;
    /** Accessible name for the text input */
    inputLabel: string;
    /** Accessible label and text for the search button */
    searchLabel: string;
    /** Current text input value */
    value?: string;
    /** Placeholder text for the input */
    placeholder?: string;
    /** Callback when input value changes */
    onChange?: (value: string) => void;
    /** Callback when search is triggered */
    onSearch?: (value: string) => void;
    /** Whether the input is required */
    required?: boolean;
    /** Whether the input and button are disabled */
    disabled?: boolean;
    [key: string]: unknown;
}

export default function TextInputWithSearch(props: TextInputWithSearchProps) {
    const p = merge(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "inputLabel",
        "searchLabel",
        "value",
        "placeholder",
        "onChange",
        "onSearch",
        "required",
        "disabled",
    );
    warnMissingName("TextInputWithSearch", p.label, p["aria-label"], p["aria-labelledby"]);
    function handleSearch() {
        p.onSearch?.(p.value);
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    }

    return (
        <div
            class={`text-input-with-search ${p.class}`}
            role="search"
            aria-label={p.label}
            {...restProps}
        >
            <input
                type="text"
                aria-label={p.inputLabel}
                value={p.value}
                placeholder={p.placeholder}
                onInput={(e) => p.onChange?.(e.currentTarget.value)}
                onKeyDown={handleKeydown}
                required={p.required}
                disabled={p.disabled}
            />
            <button
                type="button"
                aria-label={p.searchLabel}
                onClick={handleSearch}
                disabled={p.disabled}
            >
                {p.searchLabel}
            </button>
        </div>
    );
}
