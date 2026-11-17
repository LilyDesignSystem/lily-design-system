// MedicalBanner component
//
// A headless medical banner for displaying prominent medical information
// messages at the top of a page. Renders as a <div role="region"> with
// aria-live="polite", data-type for variants, and data-context="medical".
// Supports optional dismiss functionality.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   type — "info" | "success" | "warning" | "error", default "info".
//   dismissible — boolean, default false.
//   onClose — () => void, optional. Callback when dismissed.
//   closeLabel — string, optional. Accessible label for dismiss button.
//   children — ReactNode, required. The banner content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <MedicalBanner label="Patient alerts">content</MedicalBanner>
//
// Keyboard:
//   - Tab: Focus dismiss button (when dismissible)
//   - Enter/Space: Dismiss the banner
//
// Accessibility:
//   - role="region" for landmark identification
//   - aria-live="polite" for announcing content changes
//   - data-context="medical" for medical context
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import type { JSX } from "@solidjs/web";
import { merge, omit, createSignal } from "solid-js";
import { attr } from "./attr";
import { warnMissingName } from "./dev-warning";

export interface MedicalBannerProps {
    class?: string;
    /** Accessible name for the banner */
    label: string;
    /** Banner variant for semantic meaning */
    type?: "info" | "success" | "warning" | "error";
    /** Whether the banner can be dismissed */
    dismissible?: boolean;
    /** Callback when the banner is dismissed */
    onClose?: () => void;
    /** Accessible label for the dismiss button */
    closeLabel?: string;
    /** The banner content */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function MedicalBanner(props: MedicalBannerProps) {
    const p = merge({ class: "" as const, type: "info" as const, dismissible: false }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "type",
        "dismissible",
        "onClose",
        "closeLabel",
        "children",
    );
    warnMissingName("MedicalBanner", p.label, p["aria-label"], p["aria-labelledby"]);
    const [visible, setVisible] = createSignal(true);

    function dismiss() {
        setVisible(false);
        p.onClose?.();
    }

    return (
        <>
            {visible() && (
                <>
                    <div
                        class={`medical-banner ${p.class}`}
                        role="region"
                        aria-live="polite"
                        aria-label={p.label}
                        data-type={attr(p.type)}
                        data-context="medical"
                        {...restProps}
                    >
                        {p.children}
                        {p.dismissible && (
                            <>
                                <button
                                    type="button"
                                    aria-label={p.closeLabel}
                                    onClick={dismiss}
                                ></button>
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
}
