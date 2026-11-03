// SectionNav component
//
// Navigation between the sections of a page or document. Renders a <nav> with the `section-nav` hook;
// the links are SectionList and SectionListItem children.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   children — React.ReactNode, required. The section list.
//   ...restProps — additional HTML attributes spread onto the root <nav>.
//
// Syntax:
//   <SectionNav label="…">…</SectionNav>
//
// Examples:
//   <SectionNav label="Sections"><SectionList>…</SectionList></SectionNav>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - The native <nav> element supplies the navigation landmark; give it a `label`
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - MDN <nav>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav

export interface SectionNavProps {
    className?: string;
    label?: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function SectionNav({
    className = "",
    label = undefined,
    children,
    ...restProps
}: SectionNavProps) {
    return (
        <nav
            className={`section-nav ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </nav>
    );
}
