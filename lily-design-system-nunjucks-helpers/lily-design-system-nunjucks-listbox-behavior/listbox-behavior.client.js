// Shared WAI-ARIA APG listbox "active-descendant" keyboard behaviour.
//
// Every Nunjucks helper macro (theme-picker.njk, locale-picker.njk,
// text-size-picker.njk, motion-picker.njk) renders the same icon-button
// + `<ul role="listbox">` shape, and until now each one's companion
// `*.client.js` hand-rolled its own ~150-line copy of this exact
// keyboard contract: arrow move (clamp), Home/End, typeahead,
// PageUp/PageDown, Enter/Space, Escape, Tab. This module is that logic,
// written once.
//
// Unlike this catalog's headless macros (markup-only, zero JS — see
// lily-design-system-nunjucks-headless's own package description),
// this package ships behaviour, not markup: it owns nothing about
// WHAT a picker's listbox looks like, only how the cursor inside it
// moves. It never sets `aria-selected` (that reflects the picker's
// applied VALUE, not the keyboard cursor, and stays each picker's own
// responsibility) — only `data-active` and `aria-activedescendant`.
// "Select" / "cancel" / "leave" are relayed via `onActivate`/`onEscape`/
// `onTabOut` callbacks so each picker decides what those mean, the same
// division of responsibility every other framework catalog's headless
// Listbox uses.
//
// Options are queried live from the DOM on every call (`[role="option"]`
// children of `list`), not captured once at attach time, so a picker
// whose option set can change stays correct without re-attaching.

/** How long the typeahead buffer survives between keystrokes, in ms. */
const TYPEAHEAD_RESET_MS = 500;

function optionsOf(list) {
  return Array.from(list.querySelectorAll('[role="option"]'));
}

/** jsdom and older browsers do not always implement scrollIntoView. */
function scrollIntoViewIfPossible(el) {
  if (el && typeof el.scrollIntoView === "function") {
    el.scrollIntoView({ block: "nearest" });
  }
}

/**
 * Attach the active-descendant keyboard contract to a rendered
 * `<ul role="listbox">` (or any container) and its `[role="option"]`
 * children.
 *
 * @param {HTMLElement} list
 * @param {{
 *   clamp?: boolean,
 *   typeahead?: boolean,
 *   pageSize?: number,
 *   onActivate?: (index: number) => void,
 *   onEscape?: () => void,
 *   onTabOut?: () => void,
 * }} [config]
 * @returns {{
 *   setActive: (index: number) => void,
 *   getActive: () => number,
 *   destroy: () => void,
 * }}
 */
export function createListboxKeyboard(list, config = {}) {
  const {
    clamp = false,
    typeahead: typeaheadEnabled = false,
    pageSize = 10,
    onActivate,
    onEscape,
    onTabOut,
  } = config;

  let activeIndex = -1;
  let typeahead = "";
  let typeaheadTimer;

  function setActive(index) {
    const options = optionsOf(list);
    activeIndex = index;
    options.forEach((o, i) => {
      if (i === index) o.setAttribute("data-active", "");
      else o.removeAttribute("data-active");
    });
    if (index >= 0 && options[index]) {
      list.setAttribute("aria-activedescendant", options[index].id);
      scrollIntoViewIfPossible(options[index]);
    } else {
      list.removeAttribute("aria-activedescendant");
    }
  }

  function moveActive(delta) {
    const options = optionsOf(list);
    if (options.length === 0) return;
    const next = activeIndex + delta;
    const result = clamp
      ? Math.min(Math.max(next, 0), options.length - 1)
      : ((next % options.length) + options.length) % options.length;
    setActive(result);
  }

  function runTypeahead(char) {
    const options = optionsOf(list);
    if (options.length === 0) return;
    const labels = options.map((o) => (o.textContent || "").trim());
    const lower = char.toLowerCase();
    // APG listbox typeahead: a single character moves to the NEXT
    // option starting with it, and repeating that character keeps
    // cycling. Only a buffer of differing characters refines the
    // match, and that buffer stays anchored on the active option.
    const sameCharRun =
      typeahead === "" || Array.from(typeahead).every((c) => c === lower);
    typeahead += lower;
    clearTimeout(typeaheadTimer);
    typeaheadTimer = setTimeout(() => {
      typeahead = "";
    }, TYPEAHEAD_RESET_MS);
    const query = sameCharRun ? lower : typeahead;
    const anchor = activeIndex < 0 ? 0 : activeIndex;
    const start = sameCharRun ? anchor + 1 : anchor;
    // Search forward, wrapping once — typeahead wraps even though the
    // arrows clamp, or options above the cursor would be untypable.
    for (let n = 0; n < options.length; n++) {
      const i = (start + n) % options.length;
      if (labels[i].toLowerCase().startsWith(query)) {
        setActive(i);
        return;
      }
    }
  }

  function onKeydown(event) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        event.preventDefault();
        setActive(optionsOf(list).length ? 0 : -1);
        break;
      case "End":
        event.preventDefault();
        setActive(optionsOf(list).length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (activeIndex >= 0 && typeof onActivate === "function") {
          onActivate(activeIndex);
        }
        break;
      case "Escape":
        event.preventDefault();
        if (typeof onEscape === "function") onEscape();
        break;
      case "PageUp":
        event.preventDefault();
        moveActive(-pageSize);
        break;
      case "PageDown":
        event.preventDefault();
        moveActive(pageSize);
        break;
      case "Tab":
        // Not prevented: the consumer's onTabOut (e.g. moving focus to a
        // trigger button before hiding the list) runs first, so the
        // browser's default Tab proceeds from wherever focus ends up.
        if (typeof onTabOut === "function") onTabOut();
        break;
      default:
        if (
          typeaheadEnabled &&
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey
        ) {
          runTypeahead(event.key);
        }
    }
  }

  list.addEventListener("keydown", onKeydown);

  return {
    setActive,
    getActive: () => activeIndex,
    destroy: () => {
      clearTimeout(typeaheadTimer);
      list.removeEventListener("keydown", onKeydown);
    },
  };
}
