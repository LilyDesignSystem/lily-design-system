// SectionList component
//
// A list of sections. Renders a <ul> with the `section-list` hook; items are SectionListItem.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accepted for API symmetry but not rendered by this component.
//   children — React.ReactNode, required. The SectionListItem children.
//   ...restProps — additional HTML attributes spread onto the root <ul>.
//
// Syntax:
//   <SectionList>…</SectionList>
//
// Examples:
//   <SectionList><SectionListItem><a href="#one">One</a></SectionListItem></SectionList>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given (the Svelte port accepts but does not render it)
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog renders no aria-label; this React component does not (the Svelte one is canonical)
//
// References:
//   - MDN <ul>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul

export interface SectionListProps {
    className?: string;
    label?: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function SectionList({
    className = "",
    label = undefined,
    children,
    ...restProps
}: SectionListProps) {
    return (
        <ul
            className={`section-list ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </ul>
    );
}
