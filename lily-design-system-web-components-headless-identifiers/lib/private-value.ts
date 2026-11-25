// Keeps an identifier input's value out of every attribute (HC-I3, spec/healthcare-ui/requirements.md). A session-replay or
// analytics tool may record attributes it would mask as text, so the host's `value` attribute is read and removed, and the
// inner input is given its value as a property: `defaultValue` would write it back to an attribute. A form reset, which
// restores `defaultValue`, therefore restores the starting value here instead.

export class PrivateValue {
    readonly #host: HTMLElement;
    #input: HTMLInputElement | null = null;
    #pending: string | null = null;
    #initial = "";
    #root: Node | null = null;

    constructor(host: HTMLElement) {
        this.#host = host;
    }

    /** Give the input its starting value the first time, and listen for its form's reset. Call on every connect. */
    connect(input: HTMLInputElement): void {
        if (!this.#input) {
            this.#input = input;
            this.#initial = this.#pending ?? this.#host.getAttribute("value") ?? "";
            this.#pending = null;
            input.value = this.#initial;
            this.#host.removeAttribute("value");
        }
        this.disconnect();
        this.#root = this.#host.getRootNode();
        this.#root.addEventListener("reset", this.#onReset);
    }

    /** Stop listening. Call when the host is disconnected. */
    disconnect(): void {
        this.#root?.removeEventListener("reset", this.#onReset);
        this.#root = null;
    }

    /** The host's `value` attribute was set after it was connected: take it, as the input's value and its starting value. */
    attribute(next: string | null): void {
        if (next === null || !this.#input) return;
        this.#initial = next;
        this.#input.value = next;
        this.#host.removeAttribute("value");
    }

    get value(): string {
        return this.#input?.value ?? this.#pending ?? this.#host.getAttribute("value") ?? "";
    }

    set value(next: string) {
        if (this.#input) this.#input.value = next;
        else this.#pending = next;
    }

    // After the browser has reset the form, and not when another listener cancelled it.
    readonly #onReset = (event: Event): void => {
        const input = this.#input;
        if (!input || event.target !== input.form) return;
        setTimeout(() => {
            if (!event.defaultPrevented) input.value = this.#initial;
        }, 0);
    };
}
