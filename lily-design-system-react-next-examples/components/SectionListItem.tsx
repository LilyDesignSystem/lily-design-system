// SectionListItem component
//
// One item in a SectionList. Renders an <li> with the `section-list-item` hook.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accepted but not rendered.
//   children — React.ReactNode, required. The content.
//   ...restProps — additional HTML attributes spread onto the root <li>.
//
// Syntax:
//   <SectionListItem current>…</SectionListItem>
//
// Examples:
//   <SectionListItem current><a href="#one" aria-current="location">One</a></SectionListItem>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - Put aria-current on the link inside the item to mark the current section
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog renders a `current` prop that sets data-current; this React component does not (the Svelte one is canonical)
//
// References:
//   - MDN <li>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li

export interface SectionListItemProps {
    className?: string;
    label?: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function SectionListItem({
    className = "",
    label = undefined,
    children,
    ...restProps
}: SectionListItemProps) {
    return (
        <li
            className={`section-list-item ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </li>
    );
}
