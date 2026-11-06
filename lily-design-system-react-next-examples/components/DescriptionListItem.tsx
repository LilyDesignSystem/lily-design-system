// DescriptionListItem component
//
// One term-and-description group inside a DescriptionList. A <div> is the only element HTML allows to
// wrap dt/dd pairs in a <dl>.
//
// Props:
//   className — string, optional. CSS class name.
//   children — React.ReactNode, required. The <dt> and <dd> elements.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <DescriptionListItem>…</DescriptionListItem>
//
// Examples:
//   <DescriptionListItem><dt>Name</dt><dd>Sam</dd></DescriptionListItem>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - MDN <dl>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl

export interface DescriptionListItemProps {
    className?: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function DescriptionListItem({
    className = "",
    children,
    ...restProps
}: DescriptionListItemProps) {
    return (
        <div
            className={`description-list-item ${className}`}
            {...restProps}
        >
            {children}
        </div>
    );
}
