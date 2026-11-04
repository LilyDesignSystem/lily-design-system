// The combobox behaviour every catalog shares: the WAI-ARIA APG combobox with list autocomplete, on an input and a
// listbox of consumer-supplied role="option" elements. The options arrive as markup, not data, so this works on the
// DOM: focus stays in the input, the highlighted option is aria-activedescendant, and filtering stays the consumer's.
//
// Keys: ArrowDown and ArrowUp open on the first and last option, then move and wrap; Home and End jump while open;
// Enter chooses the highlighted option; Escape closes, and is left alone while closed so an enclosing dialog gets it;
// Alt+ArrowDown opens without moving the highlight; Alt+ArrowUp closes. A key during IME composition belongs to the IME.
// Typing opens the list and drops the highlight. Blur closes it. Clicking an option chooses it, and pressing one keeps
// focus in the input. An option that is hidden or aria-disabled="true" is skipped.
//
// shared/combobox-client.js is the same behaviour without types, for Nunjucks and Blazor, and the HTML catalog's
// snippet inlines it. The `combobox` contract in pattern-contracts.json holds all of them to it. Spec: spec/testing.

export interface ComboboxHost {
    /** Whether the list is open: the framework's state. */
    open: () => boolean;
    /** Ask for the list to open or close. */
    setOpen: (open: boolean) => void;
    /** An option was chosen, with its `data-value`, else its text. The host writes it into the input. */
    choose: (value: string) => void;
}

const allOptions = (list: HTMLElement): HTMLElement[] => [
    ...list.querySelectorAll<HTMLElement>('[role="option"]'),
];

const usable = (list: HTMLElement): HTMLElement[] =>
    allOptions(list).filter((o) => !o.hidden && o.getAttribute("aria-disabled") !== "true");

const optionValue = (option: HTMLElement): string =>
    option.dataset.value ?? (option.textContent ?? "").trim();

/** Highlight one option, or none. An option with no id gets one, so aria-activedescendant can name it. */
export function setActiveOption(
    input: HTMLElement,
    list: HTMLElement,
    option: HTMLElement | null,
): void {
    allOptions(list).forEach((el, index) => {
        if (el === option && !el.id) el.id = `${list.id}-option-${index}`;
        el.setAttribute("aria-selected", String(el === option));
        el.toggleAttribute("data-active", el === option);
    });
    if (option) {
        input.setAttribute("aria-activedescendant", option.id);
        // The list scrolls itself only for focus, and focus stays in the input. Not in jsdom.
        option.scrollIntoView?.({ block: "nearest" });
    } else input.removeAttribute("aria-activedescendant");
}

/** Wire the keys, typing, blur and pointer. Returns the cleanup. */
export function attachCombobox(
    input: HTMLInputElement,
    list: HTMLElement,
    host: ComboboxHost,
): () => void {
    const close = (): void => {
        setActiveOption(input, list, null);
        host.setOpen(false);
    };
    const choose = (option: HTMLElement): void => {
        const value = optionValue(option);
        host.choose(value);
        close();
    };

    function onKeydown(event: KeyboardEvent): void {
        if (event.isComposing) return;
        const open = host.open();
        const options = usable(list);
        const index = options.findIndex(
            (o) => o.id !== "" && o.id === input.getAttribute("aria-activedescendant"),
        );
        const move = (option: HTMLElement): void => {
            event.preventDefault();
            if (!open) host.setOpen(true);
            setActiveOption(input, list, option);
        };

        switch (event.key) {
            case "ArrowDown":
                if (event.altKey) {
                    if (open || options.length === 0) return;
                    event.preventDefault();
                    host.setOpen(true);
                } else if (options.length > 0) {
                    move(options[open ? (index + 1) % options.length : 0]);
                }
                break;
            case "ArrowUp":
                if (event.altKey) {
                    if (!open) return;
                    event.preventDefault();
                    close();
                } else if (options.length > 0) {
                    move(options[open && index > 0 ? index - 1 : options.length - 1]);
                }
                break;
            case "Home":
                if (open && options.length > 0) move(options[0]);
                break;
            case "End":
                if (open && options.length > 0) move(options[options.length - 1]);
                break;
            case "Enter":
                if (open && index >= 0) {
                    event.preventDefault();
                    choose(options[index]);
                }
                break;
            case "Escape":
                if (open) {
                    event.preventDefault();
                    close();
                }
                break;
        }
    }

    function onInput(): void {
        setActiveOption(input, list, null);
        if (!host.open()) host.setOpen(true);
    }
    function onBlur(): void {
        if (host.open()) close();
    }
    // Pressing an option must not blur the input, or the list closes before the click lands.
    function onMousedown(event: Event): void {
        event.preventDefault();
    }
    function onClick(event: Event): void {
        const option = (event.target as Element).closest<HTMLElement>('[role="option"]');
        if (option && option.getAttribute("aria-disabled") !== "true") choose(option);
    }

    input.addEventListener("keydown", onKeydown);
    input.addEventListener("input", onInput);
    input.addEventListener("blur", onBlur);
    list.addEventListener("mousedown", onMousedown);
    list.addEventListener("click", onClick);
    return () => {
        input.removeEventListener("keydown", onKeydown);
        input.removeEventListener("input", onInput);
        input.removeEventListener("blur", onBlur);
        list.removeEventListener("mousedown", onMousedown);
        list.removeEventListener("click", onClick);
    };
}
