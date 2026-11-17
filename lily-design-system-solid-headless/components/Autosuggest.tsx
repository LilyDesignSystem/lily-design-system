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
//   class — string, optional. Appended to the root's class list.
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
//   - Alt+ArrowDown: open without moving the highlight; Alt+ArrowUp: close
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

import { merge, omit, createSignal, createUniqueId, untrack } from "solid-js";
import { attr } from "./attr";
import { useFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

export interface AutosuggestSuggestion {
    value: string;
    label: string;
}

export interface AutosuggestProps {
    class?: string;
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

export default function Autosuggest(props: AutosuggestProps) {
    const p = merge(
        {
            class: "" as const,
            defaultValue: "" as const,
            suggestions: [] as NonNullable<AutosuggestProps["suggestions"]>,
        },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "value",
        "defaultValue",
        "suggestions",
        "onInput",
        "onSelect",
        "placeholder",
        "name",
    );
    warnMissingName("Autosuggest", p.label, p["aria-label"], p["aria-labelledby"]);
    const uid = createUniqueId();
    const listId = () => `autosuggest-list-${uid}`;
    const optionId = (index: number) => `autosuggest-option-${uid}-${index}`;
    const [internalValue, setInternalValue] = createSignal(untrack(() => p.defaultValue));
    const isControlled = () => p.value !== undefined;
    const value = () => (isControlled() ? p.value : internalValue());
    const [wanted, setWanted] = createSignal(false);
    const [active, setActive] = createSignal(-1);
    const open = () => wanted() && p.suggestions.length > 0;
    const inputRef: { current: HTMLInputElement | null } = { current: null };
    // React keeps a controlled field's default in step with its value(), so the
    // browser's reset is a no-op: restore the starting text ourselves.
    useFormReset(
        () => inputRef.current,
        () => {
            if (!isControlled()) setInternalValue(p.defaultValue);
            setWanted(false);
            setActive(-1);
        },
    );

    function choose(index: number) {
        const suggestion = p.suggestions[index];
        if (!suggestion) return;
        if (!isControlled()) setInternalValue(suggestion.value);
        setWanted(false);
        setActive(-1);
        p.onSelect?.(suggestion.value);
    }

    function handleChange(event: Event & { currentTarget: HTMLInputElement }) {
        const next = event.currentTarget.value;
        if (!isControlled()) setInternalValue(next);
        setWanted(true);
        setActive(-1);
        p.onInput?.(next);
    }

    function handleKeyDown(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
        if (event.isComposing) return; // The key belongs to the IME.
        const count = p.suggestions.length;
        switch (event.key) {
            case "ArrowDown":
                if (count === 0) return;
                if (event.altKey) {
                    if (open()) return;
                    setWanted(true);
                    break;
                }
                setActive(open() ? (active() + 1) % count : 0);
                setWanted(true);
                break;
            case "ArrowUp":
                if (event.altKey) {
                    if (!open()) return;
                    setWanted(false);
                    setActive(-1);
                    break;
                }
                if (count === 0) return;
                setActive(open() && active() > 0 ? active() - 1 : count - 1);
                setWanted(true);
                break;
            case "Home":
                if (!open()) return;
                setActive(0);
                break;
            case "End":
                if (!open()) return;
                setActive(count - 1);
                break;
            case "Enter":
                if (!open() || active() < 0) return;
                choose(active());
                break;
            case "Escape":
                if (!open()) return;
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
            class={`autosuggest ${p.class}`}
            {...restProps}
        >
            <input
                ref={(el) => (inputRef.current = el)}
                class="autosuggest-input"
                type="text"
                role="combobox"
                autocomplete="off"
                aria-label={p.label}
                aria-autocomplete="list"
                aria-expanded={attr(open())}
                aria-controls={listId()}
                aria-activedescendant={open() && active() >= 0 ? optionId(active()) : undefined}
                placeholder={p.placeholder}
                name={p.name}
                value={value()}
                onInput={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
            <ul
                class="autosuggest-list"
                role="listbox"
                id={listId()}
                aria-label={p.label}
                hidden={!open()}
                onMouseDown={(event) => event.preventDefault()}
            >
                {p.suggestions.map((suggestion, index) => (
                    <li
                        class="autosuggest-option"
                        role="option"
                        id={optionId(index)}
                        aria-selected={attr(index === active())}
                        data-value={attr(suggestion.value)}
                        onClick={() => choose(index)}
                    >
                        {suggestion.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}
