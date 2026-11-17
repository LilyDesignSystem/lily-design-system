// ArticleLayout component
//
// ArticleLayout for the Reuters-graphics-style article layout family. Renders a
// <article> that consumers style; this component is a structural
// wrapper only.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Sets the article-layout class as the styling hook

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface ArticleLayoutProps {
    class?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function ArticleLayout(props: ArticleLayoutProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <article
            class={`article-layout ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </article>
    );
}
