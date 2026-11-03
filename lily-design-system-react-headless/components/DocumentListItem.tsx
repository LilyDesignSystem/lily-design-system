// DocumentListItem component
//
// One document in a DocumentList. Renders an <li> with the `document-list-item` hook around the
// consumer's link, type and size.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accepted for API symmetry but not rendered by this component.
//   children — React.ReactNode, required. The document link and its details.
//   ...restProps — additional HTML attributes spread onto the root <li>.
//
// Syntax:
//   <DocumentListItem>…</DocumentListItem>
//
// Examples:
//   <DocumentList><DocumentListItem><a href="/report.pdf">Report</a></DocumentListItem></DocumentList>
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
//   - MDN <li>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li

export interface DocumentListItemProps {
    className?: string;
    label?: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function DocumentListItem({
    className = "",
    label = undefined,
    children,
    ...restProps
}: DocumentListItemProps) {
    return (
        <li
            className={`document-list-item ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </li>
    );
}
