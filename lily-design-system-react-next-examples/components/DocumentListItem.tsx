// DocumentListItem component
//
// One document in a DocumentList. Renders an <li> with the `document-list-item` hook around the
// consumer's link, type and size.
//
// Props:
//   className — string, optional. CSS class name.
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
//   - Native <li> semantics; the link inside the item carries its own name
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - MDN <li>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li

export interface DocumentListItemProps {
    className?: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function DocumentListItem({
    className = "",
    children,
    ...restProps
}: DocumentListItemProps) {
    return (
        <li
            className={`document-list-item ${className}`}
            {...restProps}
        >
            {children}
        </li>
    );
}
