// Card component
//
// A headless card that groups related content in a <div>, which has
// role="group" when labelled. Supports a configurable heading level (h2-h6) for proper
// document outline, with an optional link wrapper on the heading. Commonly used
// for product listings, user profiles, article previews, and dashboard widgets.
//
// Props:
//   class — string, optional. CSS class name.
//   heading — string, optional. Heading text for the card.
//   headingLevel — 2 | 3 | 4 | 5 | 6, default 3. HTML heading level.
//   href — string, optional. Makes the heading a link.
//   label — string, optional. Names the card, which then has role="group".
//   children — ReactNode, required. Card body content.
//   ...restProps — additional HTML attributes spread onto the root <div>.
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
//   - A <div>, not an <article>: an article on every card in a list is noise. Pass role="article" for a stand-alone card
//   - Optional label names the card as role="group"; with no label the <div> is generic and unnamed
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
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface CardProps {
    class?: string;
    heading?: string;
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    href?: string;
    label?: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Card(props: CardProps) {
    const p = merge({ class: "" as const, headingLevel: 3 }, props);
    const restProps = omit(p, "class", "heading", "headingLevel", "href", "label", "children");
    const headingContent = () => (p.href ? <a href={p.href}>{p.heading}</a> : p.heading);

    return (
        <div
            class={`card ${p.class}`}
            role={p.label ? "group" : undefined}
            aria-label={p.label || undefined}
            {...restProps}
        >
            {p.heading && (
                <>
                    {p.headingLevel === 2 ? (
                        <h2>{headingContent()}</h2>
                    ) : p.headingLevel === 3 ? (
                        <h3>{headingContent()}</h3>
                    ) : p.headingLevel === 4 ? (
                        <h4>{headingContent()}</h4>
                    ) : p.headingLevel === 5 ? (
                        <h5>{headingContent()}</h5>
                    ) : p.headingLevel === 6 ? (
                        <h6>{headingContent()}</h6>
                    ) : null}
                </>
            )}
            {p.children}
        </div>
    );
}
