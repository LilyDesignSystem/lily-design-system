/**
 * ListboxController — shared WAI-ARIA APG listbox keyboard behaviour.
 *
 * `listbox.html`'s own behaviour script has always been an empty stub
 * (`// Interactive behavior initialization`, no code) — there was never a
 * working keyboard implementation to extend here, unlike the other seven
 * framework catalogs' `Listbox` components. Six `*-picker` custom elements
 * in `lily-design-system-html-helpers` each hand-rolled an near-identical
 * ~150-line copy of this same logic instead. This module is that logic,
 * extracted once, real and reusable, so the six no longer duplicate it.
 *
 * A framework-free, dependency-free plain ES module (this catalog has no
 * TypeScript/bundler pipeline for its runtime components — only Storybook
 * stories are `.ts`), matching `theme-picker.ts`'s own class-based style.
 *
 * Unlike Blazor's port, this catalog CAN query the live DOM synchronously,
 * so — like Svelte/Vue/React — options are read straight off the rendered
 * `[role="option"]` children of `root` rather than through index-mapping
 * callbacks. `ListboxController` owns only the cursor mechanics (arrow
 * movement, Home/End, typeahead, PageUp/PageDown) and calls back into the
 * consumer for what "activate" / "escape" / "tab out" actually do — the
 * same division of responsibility the other catalogs' Listbox components
 * use.
 *
 * @example
 *   const controller = new ListboxController({
 *     root: listEl,
 *     clamp: true,
 *     typeahead: true,
 *     getOptionLabel: (option) => option.textContent ?? "",
 *     onActiveIndexChange: (index) => { ...update aria-activedescendant/data-active... },
 *     onActivate: (index) => { ...choose(index)... },
 *     onEscape: () => closeList(),
 *     onTabOut: () => { buttonEl.focus(); closeList(false); },
 *   });
 *   controller.setActiveIndex(0); // on open
 *   controller.destroy(); // on disconnect
 */
export class ListboxController {
  #root;
  #clamp;
  #typeahead;
  #pageSize;
  #getOptionLabel;
  #onActiveIndexChange;
  #onActivate;
  #onEscape;
  #onTabOut;

  #activeIndex = -1;
  #typeaheadBuffer = "";
  #typeaheadTimer;

  /**
   * @param {object} options
   * @param {HTMLElement} options.root - The `role="listbox"` element; the keydown listener attaches here.
   * @param {boolean} [options.clamp] - Arrow keys clamp instead of wrap. Default false (wrap).
   * @param {boolean} [options.typeahead] - Printable-character typeahead. Default false.
   * @param {number} [options.pageSize] - PageUp/PageDown step size. Default 10.
   * @param {(option: HTMLElement) => string} [options.getOptionLabel] - Resolves an option's typeahead label. Required when `typeahead` is true.
   * @param {(index: number) => void} options.onActiveIndexChange - Fires whenever the cursor moves, including via `setActiveIndex`.
   * @param {(index: number) => void} options.onActivate - Enter/Space on the active option.
   * @param {() => void} options.onEscape - Escape pressed.
   * @param {() => void} options.onTabOut - Tab pressed. Not prevented — the consumer moves focus (e.g. to a trigger button) before the browser's default Tab computes its target from wherever focus lands.
   */
  constructor(options) {
    this.#root = options.root;
    this.#clamp = options.clamp ?? false;
    this.#typeahead = options.typeahead ?? false;
    this.#pageSize = options.pageSize ?? 10;
    this.#getOptionLabel = options.getOptionLabel;
    this.#onActiveIndexChange = options.onActiveIndexChange;
    this.#onActivate = options.onActivate;
    this.#onEscape = options.onEscape;
    this.#onTabOut = options.onTabOut;
    this.#root.addEventListener("keydown", this.#onKeydown);
  }

  /** The current virtual cursor position. -1 = none. */
  get activeIndex() {
    return this.#activeIndex;
  }

  /** Every `[role="option"]` inside root, in DOM order. */
  #options() {
    return Array.from(this.#root.querySelectorAll('[role="option"]'));
  }

  /** Programmatically move the cursor (e.g. on open, to the selected option). */
  setActiveIndex(index) {
    if (index === this.#activeIndex) return;
    this.#activeIndex = index;
    this.#onActiveIndexChange(index);
  }

  /** Remove the keydown listener and cancel any pending typeahead timer. */
  destroy() {
    this.#root.removeEventListener("keydown", this.#onKeydown);
    clearTimeout(this.#typeaheadTimer);
  }

  #moveActive(delta) {
    const count = this.#options().length;
    if (count === 0) return;
    const next = this.#activeIndex + delta;
    this.setActiveIndex(
      this.#clamp
        ? Math.min(Math.max(next, 0), count - 1)
        : ((next % count) + count) % count,
    );
  }

  #runTypeahead(char) {
    const options = this.#options();
    if (!this.#getOptionLabel || options.length === 0) return;
    const lower = char.toLowerCase();
    // A single character moves to the NEXT option starting with it, and
    // repeating that character keeps cycling. Only a buffer of differing
    // characters refines the match, and that buffer stays anchored on
    // the active option.
    const sameCharRun =
      this.#typeaheadBuffer === "" ||
      [...this.#typeaheadBuffer].every((c) => c === lower);
    this.#typeaheadBuffer += lower;
    clearTimeout(this.#typeaheadTimer);
    this.#typeaheadTimer = setTimeout(() => {
      this.#typeaheadBuffer = "";
    }, 500);
    const query = sameCharRun ? lower : this.#typeaheadBuffer;
    const anchor = this.#activeIndex < 0 ? 0 : this.#activeIndex;
    const start = sameCharRun ? anchor + 1 : anchor;
    // Search forward, wrapping once — typeahead wraps even when arrows
    // clamp, or options above the cursor would be untypable.
    for (let n = 0; n < options.length; n++) {
      const i = (start + n) % options.length;
      if (this.#getOptionLabel(options[i]).toLowerCase().startsWith(query)) {
        this.setActiveIndex(i);
        return;
      }
    }
  }

  #onKeydown = (event) => {
    const count = this.#options().length;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.#moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.#moveActive(-1);
        break;
      case "Home":
        event.preventDefault();
        this.setActiveIndex(count ? 0 : -1);
        break;
      case "End":
        event.preventDefault();
        this.setActiveIndex(count - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (this.#activeIndex >= 0) this.#onActivate(this.#activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        this.#onEscape();
        break;
      case "PageUp":
        event.preventDefault();
        this.#moveActive(-this.#pageSize);
        break;
      case "PageDown":
        event.preventDefault();
        this.#moveActive(this.#pageSize);
        break;
      case "Tab":
        this.#onTabOut();
        break;
      default:
        if (
          this.#typeahead &&
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey
        ) {
          this.#runTypeahead(event.key);
        }
    }
  };
}
