/**
 * `<text-size-select>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 */

/** Change-event detail dispatched on every applied size. */
export type TextSizeSelectChangeDetail = {
    size: string;
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type TextSizeSelectProps = {
    label: string;
    sizes: string[];
    value?: string;
    defaultValue?: string;
    storageKey?: string;
    name?: string;
    target?: HTMLElement | null;
    sizeLabels?: Record<string, string>;
    class?: string;
};

// ----------------------------------------------------------------
// Custom-element class
// ----------------------------------------------------------------

export class TextSizeSelect extends HTMLElement {
    static get observedAttributes(): string[] {
        return [
            "label",
            "sizes",
            "value",
            "default-value",
            "storage-key",
            "name",
            "size-labels",
            "class",
        ];
    }

    #sizes: string[] = [];
    #sizeLabels: Record<string, string> = {};
    #target: HTMLElement | null = null;
    #initialised = false;

    // ---- Property accessors ----

    get label(): string {
        return this.getAttribute("label") ?? "";
    }
    set label(v: string) {
        this.setAttribute("label", v);
    }

    get sizes(): string[] {
        return [...this.#sizes];
    }
    set sizes(v: string[]) {
        this.#sizes = Array.isArray(v) ? v.slice() : [];
        const csv = this.#sizes.join(",");
        if (this.getAttribute("sizes") !== csv) {
            this.setAttribute("sizes", csv);
            return;
        }
        this.#render();
    }

    get value(): string {
        return this.getAttribute("value") ?? "";
    }
    set value(v: string) {
        if (v) this.setAttribute("value", v);
        else this.removeAttribute("value");
    }

    get defaultValue(): string {
        return this.getAttribute("default-value") ?? "";
    }
    set defaultValue(v: string) {
        if (v) this.setAttribute("default-value", v);
        else this.removeAttribute("default-value");
    }

    get storageKey(): string {
        return this.getAttribute("storage-key") ?? "";
    }
    set storageKey(v: string) {
        if (v) this.setAttribute("storage-key", v);
        else this.removeAttribute("storage-key");
    }

    get name(): string {
        return this.getAttribute("name") ?? "text-size";
    }
    set name(v: string) {
        if (v) this.setAttribute("name", v);
        else this.removeAttribute("name");
    }

    get sizeLabels(): Record<string, string> {
        return { ...this.#sizeLabels };
    }
    set sizeLabels(v: Record<string, string>) {
        this.#sizeLabels = v && typeof v === "object" ? { ...v } : {};
        const json = JSON.stringify(this.#sizeLabels);
        if (this.getAttribute("size-labels") !== json) {
            this.setAttribute("size-labels", json);
            return;
        }
        this.#render();
    }

    get target(): HTMLElement | null {
        return this.#target;
    }
    set target(v: HTMLElement | null) {
        this.#target = v ?? null;
    }

    // ---- Lifecycle ----

    connectedCallback(): void {
        const sizesAttr = this.getAttribute("sizes");
        if (sizesAttr !== null && this.#sizes.length === 0) {
            this.#sizes = parseCsv(sizesAttr);
        }
        const labelsAttr = this.getAttribute("size-labels");
        if (labelsAttr !== null && Object.keys(this.#sizeLabels).length === 0) {
            this.#sizeLabels = parseJsonObject(labelsAttr);
        }

        if (!this.#initialised) {
            this.#initialised = true;
            this.#resolveInitialValue();
        }
        this.#render();
        if (this.value) this.#applySize(this.value);
    }

    attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
        switch (name) {
            case "sizes":
                this.#sizes = value === null ? [] : parseCsv(value);
                this.#render();
                break;
            case "size-labels":
                this.#sizeLabels = value === null ? {} : parseJsonObject(value);
                this.#render();
                break;
            case "value":
                this.#render();
                if (this.isConnected && value) this.#applySize(value);
                break;
            case "label":
            case "name":
            case "class":
                this.#render();
                break;
            default:
                break;
        }
    }

    // ---- Behaviour ----

    #resolveInitialValue(): void {
        let initial = this.value;

        if (!initial && this.storageKey) {
            try {
                initial = localStorage.getItem(this.storageKey) ?? "";
            } catch {
                /* ignore */
            }
        }

        if (!initial) {
            initial =
                this.defaultValue ||
                (this.#sizes.includes("medium") ? "medium" : this.#sizes[0]) ||
                "";
        }

        if (initial && initial !== this.value) {
            this.setAttribute("value", initial);
        }
    }

    #applySize(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
        const root = this.#target ?? document.documentElement;
        root.setAttribute("data-text-size", slug);
        if (this.storageKey) {
            try {
                localStorage.setItem(this.storageKey, slug);
            } catch {
                /* ignore */
            }
        }
        this.dispatchEvent(
            new CustomEvent<TextSizeSelectChangeDetail>("textsizechange", {
                detail: { size: slug },
                bubbles: true,
                composed: true,
            }),
        );
    }

    #labelFor(slug: string): string {
        if (slug in this.#sizeLabels) return this.#sizeLabels[slug];
        // Title-case each hyphen-separated word so a slug like
        // "x-large" renders as "X Large".
        return slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    #render(): void {
        const select = document.createElement("select");
        const extraClass = this.getAttribute("class") ?? "";
        select.className = `text-size-select ${extraClass}`.trim();
        select.setAttribute("aria-label", this.label);
        select.name = this.name;

        const current = this.value;
        for (const slug of this.#sizes) {
            const option = document.createElement("option");
            option.className = "text-size-select-option";
            option.value = slug;
            option.textContent = this.#labelFor(slug);
            if (current === slug) option.selected = true;
            select.appendChild(option);
        }

        select.addEventListener("change", () => {
            this.value = select.value;
        });

        this.replaceChildren(select);
    }
}

// ---- Module-local helpers ----

function parseCsv(s: string): string[] {
    return s
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
}

function parseJsonObject(s: string): Record<string, string> {
    try {
        const v = JSON.parse(s);
        if (v && typeof v === "object" && !Array.isArray(v)) {
            return v as Record<string, string>;
        }
    } catch {
        /* ignore */
    }
    return {};
}
