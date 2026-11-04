// The command palette behaviour every catalog shares: a search input over an always-visible listbox of
// consumer-supplied role="option" elements. Focus stays in the input, and the highlighted option is
// aria-activedescendant. Filtering the options, and what an option does, are the consumer's.
//
// ArrowDown and ArrowUp move and wrap. With an option highlighted, Home and End jump, Enter clicks it, and Escape drops
// the highlight; with none they stay the input's, so an enclosing dialog still gets Escape. Typing drops the highlight.
// A key during IME composition is the IME's. An option that is hidden or aria-disabled="true" is skipped.
//
// bin/sync-shared-modules strips the types for Nunjucks and Blazor and inlines the result in the HTML snippet. Edit it
// here. The `command` contract holds every port to it.

const allOptions = (list: HTMLElement): HTMLElement[] => [
    ...list.querySelectorAll<HTMLElement>('[role="option"]'),
];

const usable = (list: HTMLElement): HTMLElement[] =>
    allOptions(list).filter((o) => !o.hidden && o.getAttribute("aria-disabled") !== "true");

function highlight(input: HTMLElement, list: HTMLElement, option: HTMLElement | null): void {
    allOptions(list).forEach((el, index) => {
        if (el === option && !el.id) el.id = `${list.id}-option-${index}`;
        el.setAttribute("aria-selected", String(el === option));
        el.toggleAttribute("data-active", el === option);
    });
    if (option) {
        input.setAttribute("aria-activedescendant", option.id);
        option.scrollIntoView?.({ block: "nearest" });
    } else input.removeAttribute("aria-activedescendant");
}

/** Wire the keys and typing. Returns the cleanup. */
export function attachCommand(input: HTMLInputElement, list: HTMLElement): () => void {
    function onKeydown(event: KeyboardEvent): void {
        if (event.isComposing) return;
        const options = usable(list);
        const id = input.getAttribute("aria-activedescendant");
        const index = id ? options.findIndex((o) => o.id === id) : -1;
        const move = (option: HTMLElement): void => {
            event.preventDefault();
            highlight(input, list, option);
        };
        if (options.length === 0) return;
        if (event.key === "ArrowDown") move(options[(index + 1) % options.length]);
        else if (event.key === "ArrowUp") move(options[index > 0 ? index - 1 : options.length - 1]);
        else if (index < 0) return;
        else if (event.key === "Home") move(options[0]);
        else if (event.key === "End") move(options[options.length - 1]);
        else if (event.key === "Enter") {
            event.preventDefault();
            options[index].click();
        } else if (event.key === "Escape") {
            event.preventDefault();
            highlight(input, list, null);
        }
    }
    function onInput(): void {
        highlight(input, list, null);
    }
    // Pressing an option must not take focus from the input.
    function onMousedown(event: Event): void {
        event.preventDefault();
    }

    input.addEventListener("keydown", onKeydown);
    input.addEventListener("input", onInput);
    list.addEventListener("mousedown", onMousedown);
    return () => {
        input.removeEventListener("keydown", onKeydown);
        input.removeEventListener("input", onInput);
        list.removeEventListener("mousedown", onMousedown);
    };
}

/** Blazor attaches through this name, and disposes the handle. */
export function attach(input: HTMLInputElement, list: HTMLElement): { dispose: () => void } {
    return { dispose: attachCommand(input, list) };
}
