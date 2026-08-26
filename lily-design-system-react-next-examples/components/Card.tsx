// Card component
//
// A headless card that groups related content into a self-contained semantic
// <article> element. Supports a configurable heading level (h2-h6) for proper
// document outline, with an optional link wrapper on the heading. Commonly used
// for product listings, user profiles, article previews, and dashboard widgets.
//
// Props:
//   className — string, optional. CSS class name.
//   heading — string, optional. Heading text for the card.
//   headingLevel — 2 | 3 | 4 | 5 | 6, default 3. HTML heading level.
//   href — string, optional. Makes the heading a link.
//   label — string, optional. aria-label for the article landmark.
//   children — ReactNode, required. Card body content.
//   ...restProps — additional HTML attributes spread onto the <article>.
//
// Syntax:
//   <Card><h3>Title</h3><p>Content</p></Card>
//
// Examples:
//
//   <Card heading="Product" href="/products/1"><p>Description</p></Card>
//
//
//   <Card heading="Dashboard" headingLevel={2} label="Sales dashboard">
//     <p>Revenue metrics</p>
//   </Card>
//
// Keyboard:
//   - Tab: Focus the heading link when href is provided
//   - Enter: Activate the heading link (browser default)
//
// Accessibility:
//   - Implicit article role from <article> element
//   - Optional aria-label identifies the card as a named landmark
//   - Heading provides document outline structure at the specified level
//
// Internationalization:
//   - All text comes through heading and children props; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Heading level should match the card's position in the document outline
//
// References:
//   - MDN article element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article

import React from "react";

export interface CardProps {
    className?: string;
    heading?: string;
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    href?: string;
    label?: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Card({
    className = "",
    heading = undefined,
    headingLevel = 3,
    href = undefined,
    label = undefined,
    children,
    ...restProps
}: CardProps) {
    const headingContent = href ? <a href={href}>{heading}</a> : heading;

    return (
        <article
            className={`card ${className}`}
            aria-label={label}
            {...restProps}
        >
            {heading && (
                <>
                    {headingLevel === 2 ? (
                        <h2>{headingContent}</h2>
                    ) : headingLevel === 3 ? (
                        <h3>{headingContent}</h3>
                    ) : headingLevel === 4 ? (
                        <h4>{headingContent}</h4>
                    ) : headingLevel === 5 ? (
                        <h5>{headingContent}</h5>
                    ) : headingLevel === 6 ? (
                        <h6>{headingContent}</h6>
                    ) : null}
                </>
            )}
            {children}
        </article>
    );
}
