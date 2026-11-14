// <lily-decision-support-card>: a clinical decision support card in the CDS Hooks shape (spec/healthcare-ui item 4).
// Renders a light-DOM <div class="decision-support-card" role="group">; the element's children become the detail.
// Not a live region: whether a critical card interrupts is the consumer's choice.
// Attributes: summary, indicator (info | warning | critical -> data-indicator), indicator-label, source-label,
//   source-href, suggestions (JSON [{id,label,isRecommended}]), links (JSON [{label,href}]), dismiss-label,
//   override-reasons (JSON [{code,display}]), override-reason-label, override-reason-placeholder, label.
// Events: "suggestion" (detail { id }) and "dismiss" (detail { reason }), both bubbling. When reasons are offered, a
//   dismissal without one is refused: the select is marked aria-invalid and focused, and no event fires.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set([
    "summary",
    "indicator",
    "indicator-label",
    "source-label",
    "source-href",
    "suggestions",
    "links",
    "dismiss-label",
    "override-reasons",
    "override-reason-label",
    "override-reason-placeholder",
    "label",
]);

function parseList<T>(raw: string | null): T[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function el<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
    text?: string,
): HTMLElementTagNameMap[K] {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

export class DecisionSupportCard extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > div.decision-support-card")) return;
        const attr = (name: string) => this.getAttribute(name) ?? "";
        const div = el("div");
        div.className = rootClassName(this, "decision-support-card");
        div.setAttribute("role", "group");
        div.setAttribute("aria-label", this.getAttribute("label") ?? attr("summary"));
        div.setAttribute("data-indicator", attr("indicator") || "info");
        passThroughAttributes(this, div, HANDLED);

        const header = el("p", "decision-support-card-header");
        header.append(
            el("span", "decision-support-card-indicator", attr("indicator-label")),
            " ",
            el("span", "decision-support-card-summary", attr("summary")),
        );
        div.append(header);

        if (this.childNodes.length > 0) {
            const detail = el("div", "decision-support-card-detail");
            moveChildrenInto(this, detail);
            div.append(detail);
        }

        const source = el("p", "decision-support-card-source");
        if (attr("source-href")) {
            const a = el("a", undefined, attr("source-label"));
            a.href = attr("source-href");
            source.append(a);
        } else source.textContent = attr("source-label");
        div.append(source);

        const suggestions = parseList<{ id: string; label: string; isRecommended?: boolean }>(
            this.getAttribute("suggestions"),
        );
        if (suggestions.length > 0) {
            const box = el("div", "decision-support-card-suggestions");
            for (const suggestion of suggestions) {
                const button = el("button", "decision-support-card-suggestion", suggestion.label);
                button.type = "button";
                if (suggestion.isRecommended) button.setAttribute("data-recommended", "true");
                button.addEventListener("click", () =>
                    this.dispatchEvent(
                        new CustomEvent("suggestion", {
                            bubbles: true,
                            detail: { id: suggestion.id },
                        }),
                    ),
                );
                box.append(button);
            }
            div.append(box);
        }

        const links = parseList<{ label: string; href: string }>(this.getAttribute("links"));
        if (links.length > 0) {
            const ul = el("ul", "decision-support-card-links");
            for (const link of links) {
                const a = el("a", undefined, link.label);
                a.href = link.href;
                const li = el("li");
                li.append(a);
                ul.append(li);
            }
            div.append(ul);
        }

        if (attr("dismiss-label")) {
            const form = el("form", "decision-support-card-override");
            form.noValidate = true;
            const reasons = parseList<{ code: string; display: string }>(
                this.getAttribute("override-reasons"),
            );
            let select: HTMLSelectElement | null = null;
            if (reasons.length > 0) {
                const label = el(
                    "label",
                    "decision-support-card-override-label",
                    attr("override-reason-label"),
                );
                select = el("select", "decision-support-card-override-reason");
                select.required = true;
                select.append(new Option(attr("override-reason-placeholder"), ""));
                for (const reason of reasons)
                    select.append(new Option(reason.display, reason.code));
                select.addEventListener("change", () => select?.removeAttribute("aria-invalid"));
                label.append(" ", select);
                form.append(label);
            }
            const button = el("button", "decision-support-card-dismiss", attr("dismiss-label"));
            button.type = "submit";
            form.append(button);
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                if (select && !select.value) {
                    select.setAttribute("aria-invalid", "true");
                    select.focus();
                    return;
                }
                select?.removeAttribute("aria-invalid");
                this.dispatchEvent(
                    new CustomEvent("dismiss", {
                        bubbles: true,
                        detail: { reason: select?.value || undefined },
                    }),
                );
            });
            div.append(form);
        }
        this.appendChild(div);
    }
}
