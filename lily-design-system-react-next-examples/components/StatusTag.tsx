// StatusTag component
//
// A short status label. Renders a <span> with the `status-tag` hook; the status vocabulary and colours
// are the consumer's.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text read before the content: a <span> cannot take a name.
//   children — React.ReactNode, required. The content.
//   ...restProps — additional HTML attributes spread onto the root <span>.
//
// Syntax:
//   <StatusTag type="success">…</StatusTag>
//
// Examples:
//   <StatusTag type="warning">Pending</StatusTag>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - No role is rendered; pass role="status" through restProps only when the tag's text changes after load
//   - Meaning must come from the text, not the colour (WCAG 1.4.1)
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status

export interface StatusTagProps {
    className?: string;
    label?: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function StatusTag({
    className = "",
    label = undefined,
    children,
    ...restProps
}: StatusTagProps) {
    return (
        <span
            className={`status-tag ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {children}
        </span>
    );
}
