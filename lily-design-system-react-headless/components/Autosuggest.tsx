// Autosuggest component
//
// A text input that proposes matching options as users type: the WAI-ARIA
// combobox pattern with list autocomplete. The input is the combobox; the
// suggestions are a listbox of options. The consumer computes the
// suggestions in onInput (filtering, fetching) and passes them back in
// `suggestions`; the component owns the open state, the highlight, the keys
// and the selection.
//
// Props:
//   className — string, optional. Appended to the root's class list.
//   label — string, required. Accessible name of the input and the listbox.
//   value — string, optional. The input's text, controlled when given: update it from onInput and onSelect.
//   defaultValue — string, default "". The starting text when uncontrolled.
//   suggestions — { value: string; label: string }[], default []. The options to show.
//   onInput — (query: string) => void, optional. Called as the user types.
//   onSelect — (value: string) => void, optional. Called when a suggestion is chosen.
//   placeholder — string, optional. Placeholder text.
//   name — string, optional. Form field name of the input.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <Autosuggest label="Country" suggestions={suggestions} onInput={search} onSelect={setCountry} />
//
// Keyboard:
//   - ArrowDown: open the list / highlight the next option (wraps)
//   - ArrowUp: open the list / highlight the previous option (wraps)
//   - Home / End: highlight the first / last option while the list is open
//   - Enter: choose the highlighted option
//   - Escape: close the list without choosing
//
// Accessibility:
//   - role="combobox" on the input, aria-autocomplete="list", aria-expanded,
//     aria-controls naming the listbox, aria-activedescendant naming the
//     highlighted option (which carries aria-selected="true")
//   - The list stays in the DOM, hidden while closed, so aria-controls always resolves
//
// Claude rules:
//   - Choosing an option writes its `value` into the input and closes the list
//   - The list opens only while there are suggestions; blur closes it
//   - Pressing on an option does not blur the input, so a click can choose it
//   - Uncontrolled, a form reset restores defaultValue
//
// References:
//   - WAI-ARIA APG combobox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

import React, { useId, useRef, useState } from "react";

import { useFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

export interface AutosuggestSuggestion {
    value: string;
    label: string;
}

export interface AutosuggestProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** The input's text; controlled when given. */
    value?: string;
    /** The starting text when uncontrolled. */
    defaultValue?: string;
    /** The options to show. */
    suggestions?: AutosuggestSuggestion[];
    /** Called with the typed text. */
    onInput?: (query: string) => void;
    /** Called with the chosen suggestion's value. */
    onSelect?: (value: string) => void;
    /** Placeholder text. */
    placeholder?: string;
    /** Form field name. */
    name?: string;
    [key: string]: unknown;
}

export default function Autosuggest({
    className = "",
    label,
    value: valueProp,
    defaultValue = "",
    suggestions = [],
    onInput,
    onSelect,
    placeholder,
    name,
    ...restProps
}: AutosuggestProps) {
    warnMissingName("Autosuggest", label, restProps["aria-label"], restProps["aria-labelledby"]);
    const uid = useId();
    const listId = `autosuggest-list-${uid}`;
    const optionId = (index: number) => `autosuggest-option-${uid}-${index}`;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : internalValue;
    const [wanted, setWanted] = useState(false);
    const [active, setActive] = useState(-1);
    const open = wanted && suggestions.length > 0;
    const inputRef = useRef<HTMLInputElement>(null);
    // React keeps a controlled field's default in step with its value, so the
    // browser's reset is a no-op: restore the starting text ourselves.
    useFormReset(inputRef, () => {
        if (!isControlled) setInternalValue(defaultValue);
        setWanted(false);
        setActive(-1);
    });

    function choose(index: number) {
        const suggestion = suggestions[index];
        if (!suggestion) return;
        if (!isControlled) setInternalValue(suggestion.value);
        setWanted(false);
        setActive(-1);
        onSelect?.(suggestion.value);
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const next = event.currentTarget.value;
        if (!isControlled) setInternalValue(next);
        setWanted(true);
        setActive(-1);
        onInput?.(next);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        const count = suggestions.length;
        switch (event.key) {
            case "ArrowDown":
                if (count === 0) return;
                setActive(open ? (active + 1) % count : 0);
                setWanted(true);
                break;
            case "ArrowUp":
                if (count === 0) return;
                setActive(open && active > 0 ? active - 1 : count - 1);
                setWanted(true);
                break;
            case "Home":
                if (!open) return;
                setActive(0);
                break;
            case "End":
                if (!open) return;
                setActive(count - 1);
                break;
            case "Enter":
                if (!open || active < 0) return;
                choose(active);
                break;
            case "Escape":
                if (!open) return;
                setWanted(false);
                setActive(-1);
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    function handleBlur() {
        setWanted(false);
        setActive(-1);
    }

    return (
        <div
            className={`autosuggest ${className}`}
            {...restProps}
        >
            <input
                ref={inputRef}
                className="autosuggest-input"
                type="text"
                role="combobox"
                autoComplete="off"
                aria-label={label}
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls={listId}
                aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
            <ul
                className="autosuggest-list"
                role="listbox"
                id={listId}
                aria-label={label}
                hidden={!open}
                onMouseDown={(event) => event.preventDefault()}
            >
                {suggestions.map((suggestion, index) => (
                    <li
                        key={suggestion.value}
                        className="autosuggest-option"
                        role="option"
                        id={optionId(index)}
                        aria-selected={index === active}
                        data-value={suggestion.value}
                        onClick={() => choose(index)}
                    >
                        {suggestion.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}
