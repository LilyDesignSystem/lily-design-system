// SplitButton component
//
// A <div role="group"> containing a primary action button and a menu
// trigger button, followed by a menu container. Self-is-wrapper (see
// lib/dom-utils.applySelfClassName) for the outer group div — its two
// buttons and menu container are real child elements this component
// builds, not a further wrapped "real native element" the way pattern 1
// components do, since the group itself has no single native tag to
// defer to.
//
// DEVIATION FLAG: the canonical framework docs (components/split-button/
// AGENTS.md) describe `menuOpen` as consumer-owned via an `onMenuToggle`
// callback prop — appropriate for a framework with external state and a
// re-render loop. There is no such thing here. This component instead
// manages its own open/closed state internally and reflects it via
// aria-expanded/hidden only, following exactly the plain-HTML sibling's
// own script (lily-design-system-html-headless/components/
// split-button.html), which is the closest idiom to "no framework
// runtime" and already implements: click-to-toggle, Escape-to-close
// with focus returned to the trigger, and click-outside-to-close. It
// also dispatches two bubbling, composed CustomEvents so a consumer can
// still observe interaction without polling attributes:
// "lily-primary-click" (fired when the primary button is clicked) and
// "lily-menu-toggle" (detail: { open: boolean }, fired when the menu's
// open state changes).
//
// Attributes:
//   label — REQUIRED. aria-label for the <div role="group"> wrapper.
//   primary-label — REQUIRED. Visible text for the primary action button.
//   menu-label — REQUIRED. aria-label for the menu trigger button.
//   menu-open — presence-based boolean; initial open state of the menu.
//   disabled — presence-based boolean; propagates to both buttons.
//
// The `children` slot is menu content only (moved into
// `.split-button-menu`) — the primary/trigger buttons get their text
// from the primary-label/menu-label attributes instead, since those are
// plain strings, not markup, per the canonical contract.
//
// References:
//   - components/split-button/index.md (canonical contract)
//   - lily-design-system-html-headless/components/split-button.html (behaviour idiom)
//   - WAI-ARIA Menu Button pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/

import { applySelfClassName, moveChildrenInto } from "../lib/dom-utils.js";

export class SplitButton extends HTMLElement {
    #built = false;
    #trigger: HTMLButtonElement | null = null;
    #menu: HTMLDivElement | null = null;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "split-button");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);

        const primary = document.createElement("button");
        primary.type = "button";
        primary.className = "split-button-primary";
        primary.textContent = this.getAttribute("primary-label") ?? "";

        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "split-button-menu-trigger";
        trigger.setAttribute("aria-haspopup", "menu");
        const menuLabel = this.getAttribute("menu-label");
        if (menuLabel !== null) trigger.setAttribute("aria-label", menuLabel);

        const menu = document.createElement("div");
        menu.className = "split-button-menu";

        // Menu content is the host's original light-DOM children.
        moveChildrenInto(this, menu);

        const disabled = this.hasAttribute("disabled");
        primary.disabled = disabled;
        trigger.disabled = disabled;

        const initiallyOpen = this.hasAttribute("menu-open");
        trigger.setAttribute("aria-expanded", initiallyOpen ? "true" : "false");
        menu.hidden = !initiallyOpen;

        const setOpen = (isOpen: boolean): void => {
            if (trigger.getAttribute("aria-expanded") === (isOpen ? "true" : "false")) return;
            trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
            menu.hidden = !isOpen;
            this.dispatchEvent(
                new CustomEvent("lily-menu-toggle", { detail: { open: isOpen }, bubbles: true, composed: true }),
            );
        };

        primary.addEventListener("click", () => {
            if (primary.disabled) return;
            this.dispatchEvent(new CustomEvent("lily-primary-click", { bubbles: true, composed: true }));
        });

        trigger.addEventListener("click", () => {
            if (trigger.disabled) return;
            setOpen(trigger.getAttribute("aria-expanded") !== "true");
        });

        this.addEventListener("keydown", (event: Event) => {
            const keyboardEvent = event as KeyboardEvent;
            if (keyboardEvent.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") {
                setOpen(false);
                trigger.focus();
            }
        });

        document.addEventListener("click", (event: Event) => {
            if (!this.contains(event.target as Node) && trigger.getAttribute("aria-expanded") === "true") {
                setOpen(false);
            }
        });

        this.appendChild(primary);
        this.appendChild(trigger);
        this.appendChild(menu);

        this.#trigger = trigger;
        this.#menu = menu;
    }

    get menuOpen(): boolean {
        return this.#trigger?.getAttribute("aria-expanded") === "true";
    }

    set menuOpen(isOpen: boolean) {
        if (!this.#trigger || !this.#menu) {
            this.toggleAttribute("menu-open", isOpen);
            return;
        }
        this.#trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
        this.#menu.hidden = !isOpen;
    }
}
