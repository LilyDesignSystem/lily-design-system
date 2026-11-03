// DescriptionListItem component
//
// One term-and-description group inside a DescriptionList. A <div> is the only element HTML allows to
// wrap dt/dd pairs in a <dl>.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accepted for API symmetry but not rendered by this component.
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
//   - MDN <dl>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl

export interface DescriptionListItemProps {
    className?: string;
    label?: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function DescriptionListItem({
    className = "",
    label = undefined,
    children,
    ...restProps
}: DescriptionListItemProps) {
    return (
        <div
            className={`description-list-item ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
