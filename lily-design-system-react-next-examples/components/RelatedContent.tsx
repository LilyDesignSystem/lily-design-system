// RelatedContent component
//
// Links and notes related to the main content. Renders an <aside> with the `related-content` hook.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   children — React.ReactNode, required. The related links or notes.
//   ...restProps — additional HTML attributes spread onto the root <aside>.
//
// Syntax:
//   <RelatedContent label="…">…</RelatedContent>
//
// Examples:
//   <RelatedContent label="Related content"><ul><li><a href="/more">More</a></li></ul></RelatedContent>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - The native <aside> element supplies the complementary landmark
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - MDN <aside>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside

export interface RelatedContentProps {
    className?: string;
    label?: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function RelatedContent({
    className = "",
    label = undefined,
    children,
    ...restProps
}: RelatedContentProps) {
    return (
        <aside
            className={`related-content ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </aside>
    );
}
