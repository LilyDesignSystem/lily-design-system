// ArticleLayout component
//
// ArticleLayout for the Reuters-graphics-style article layout family. Renders a
// <article> that consumers style; this component is a structural
// wrapper only.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Sets the article-layout class as the styling hook

import React from "react";

export interface ArticleLayoutProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function ArticleLayout({
    className = "", label = undefined, children, ...restProps
}: ArticleLayoutProps) {
    return (
        <article
            className={`article-layout ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </article>
    );
}
