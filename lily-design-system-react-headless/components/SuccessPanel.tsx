// SuccessPanel component
//
// A confirmation panel shown after an action succeeds. Renders a <div> with the `success-panel` hook;
// it adds no role, so pass role="status" through restProps.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   children — React.ReactNode, required. The confirmation heading and text.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <SuccessPanel label="…">…</SuccessPanel>
//
// Examples:
//   <SuccessPanel label="Saved"><h2>Saved</h2><p>Your changes were saved.</p></SuccessPanel>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - No role is rendered; pass role="status" through restProps so the label is announced and the text is a polite live region
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog renders role="status"; this React component does not (the Svelte one is canonical)
//
// References:
//   - WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status

export interface SuccessPanelProps {
    className?: string;
    label?: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function SuccessPanel({
    className = "",
    label = undefined,
    children,
    ...restProps
}: SuccessPanelProps) {
    return (
        <div
            className={`success-panel ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
