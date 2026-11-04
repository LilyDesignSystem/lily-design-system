import { warnMissingName } from "./dev-warning";
// SharePage component
//
// A group of controls for sharing the current page. Renders a <div> with the `share-page` hook; it
// adds no role, so pass role="group" through restProps.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name, rendered as aria-label on the root.
//   children — React.ReactNode, required. The sharing links or buttons.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <SharePage label="…">…</SharePage>
//
// Examples:
//   <SharePage label="Share this page"><a href="…">Email</a></SharePage>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - No role is rendered; pass role="group" through restProps so the label is announced
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog renders role="group"; this React component does not (the Svelte one is canonical)
//
// References:
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

export interface SharePageProps {
    className?: string;
    label: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function SharePage({
    className = "",
    label,
    children,
    ...restProps
}: SharePageProps) {
    warnMissingName("SharePage", label, restProps["aria-label"], restProps["aria-labelledby"]);
    return (
        <div
            className={`share-page ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
