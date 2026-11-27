// The base of the clinical display elements: what a mounted element shows follows its attributes (HC-C16, tasks.md P50-T1).
//
// Every change made in one task is applied together, in a microtask, so before anything is painted. Applying each one as it comes
// would make the order a host sets attributes in matter: a new value set before `status` leaves "masked" would be withheld and
// lost. An attribute the element itself removes, to keep a value out of the DOM, is not a change.

export abstract class LiveElement extends HTMLElement {
    #built = false;
    #queued = false;
    #updating = false;

    /** Bring what is shown in step with the attributes: builds it the first time. */
    protected abstract update(): void;

    #run(): void {
        this.#updating = true;
        try {
            this.update();
        } finally {
            this.#updating = false;
        }
    }

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;
        this.#run();
    }

    attributeChangedCallback(_name: string, before: string | null, after: string | null): void {
        if (!this.#built || this.#updating || before === after || this.#queued) return;
        this.#queued = true;
        queueMicrotask(() => {
            this.#queued = false;
            this.#run();
        });
    }

    /** Show the attributes now, not in a microtask: for a property setter whose caller reads the DOM straight after. */
    protected flush(): void {
        if (this.#built) this.#run();
    }

    /** The text of an attribute, or "". */
    protected text(name: string): string {
        return this.getAttribute(name) ?? "";
    }
}

/** A span with a class and text. */
export function part(className: string, text: string): HTMLSpanElement {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = text;
    return span;
}

/** Set an attribute, or remove it when there is nothing to say. */
export function setOrRemove(el: Element, name: string, value: string | null | undefined): void {
    if (value) el.setAttribute(name, value);
    else el.removeAttribute(name);
}
