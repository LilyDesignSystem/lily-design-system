// ArticleLayout component
//
// A top-level <article> wrapper. The canonical AGENTS.md documents CSS
// custom properties for content column widths as a "Key Behavior", but no
// real cross-catalog implementation (svelte, html) actually sets them —
// this catalog's own headless.md forbids inline styles beyond the two
// documented structural exceptions (FloatButton, ThemeProvider), so this
// component follows the real, unanimous cross-catalog contract: a plain
// labelled <article> with no inline style.
//
// Attributes:
//   label — optional. Accessible name, via aria-label.
//   ...rest — spread onto the <article>.
//
// References:
//   - components/article-layout/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class ArticleLayout extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > article.article-layout")) return;

        const article = document.createElement("article");
        article.className = rootClassName(this, "article-layout");
        const label = this.getAttribute("label");
        if (label !== null) article.setAttribute("aria-label", label);
        passThroughAttributes(this, article, HANDLED);

        moveChildrenInto(this, article);
        this.appendChild(article);
    }
}
