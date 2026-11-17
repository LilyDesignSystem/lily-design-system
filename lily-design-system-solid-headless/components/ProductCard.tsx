// ProductCard component
//
// A headless specialized card for displaying a product. Renders a semantic
// <article> with optional image, a header containing the product name and
// pre-formatted price, then any additional consumer content (description,
// actions) as children. Pre-formatted price is required so the consumer
// retains control over locale-specific currency formatting.
//
// Props:
//   class — string, optional. CSS class name.
//   name      — string, required. Product name.
//   price     — string, required. Pre-formatted price text.
//   imageUrl  — string, optional. Product image src.
//   imageAlt  — string, optional. Product image alt text.
//   label     — string, optional. aria-label override (defaults to name).
//   children  — ReactNode, optional. Additional content (description, actions).
//   ...restProps — additional HTML attributes spread onto the <article>.
//
// Syntax:
//   <ProductCard name="Lamp" price="$49.00" imageUrl="/lamp.jpg" imageAlt="Lamp" />
//
// Examples:
//
//   <ProductCard
//     name="Reading Lamp"
//     price="$49.00"
//     imageUrl="/lamp.jpg"
//     imageAlt="Brass reading lamp on a desk"
//   >
//     <p>Adjustable brass reading lamp.</p>
//     <button>Add to cart</button>
//   </ProductCard>
//
// Keyboard: None at the card level; child controls handle their own.
//
// Accessibility:
//   - Semantic <article> landmark
//   - aria-label set from `label` or fallback to `name`
//   - Hook classes: product-card-image, product-card-header, product-card-name, product-card-price
//
// Internationalization:
//   - All text consumer-supplied; price already formatted for locale
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - Hook classes are exposed for consumer styling
//
// References:
//   - HTML <article>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface ProductCardProps {
    class?: string;
    /** Product name (required) */
    name: string;
    /** Pre-formatted price text (required, consumer formats currency) */
    price: string;
    /** Image src */
    imageUrl?: string;
    /** Image alt text */
    imageAlt?: string;
    /** aria-label override; defaults to name */
    label?: string;
    /** Additional content (description, actions) */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ProductCard(props: ProductCardProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "name",
        "price",
        "imageUrl",
        "imageAlt",
        "label",
        "children",
    );
    return (
        <article
            class={`product-card ${p.class}`}
            aria-label={p.label ?? p.name}
            {...restProps}
        >
            {p.imageUrl !== undefined ? (
                <img
                    class="product-card-image"
                    src={p.imageUrl}
                    alt={p.imageAlt ?? ""}
                />
            ) : null}
            <header class="product-card-header">
                <h3 class="product-card-name">{p.name}</h3>
                <p class="product-card-price">{p.price}</p>
            </header>
            {p.children}
        </article>
    );
}
