// Tour component
//
// A tour guide is an outer container for a guided walkthrough experience,
// such as for sightseeing, or pathways, or demonstrations, or onboarding.
// It wraps a TourList and its TourListItem children, providing
// the dialog overlay and keyboard dismissal behavior. When active, it
// renders as a non-modal dialog (no aria-modal, no focus trap: the page it points
// at must stay usable) that can be closed with Escape.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the tour dialog via aria-label.
//   active — boolean, default false. Whether the tour is visible; controlled via active + onChange.
//   children — ReactNode, required. TourList and its TourListItem elements.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Tour label="Getting started" active={active} onChange={setActive}>
//     <TourList label="Steps">
//       <TourListItem label="Welcome" current={step === 0}>...</TourListItem>
//     </TourList>
//   </Tour>
//
// Examples:
//
//   <Tour label="Onboarding tour" active={active} onChange={setActive}>
//     <TourList label="Tour steps">
//       <TourListItem label="Welcome" current={step === 0} stepNumber={1} totalSteps={3}>
//         <p>Welcome to the app!</p>
//         <button onClick={() => setStep(step + 1)}>Next</button>
//       </TourListItem>
//       <TourListItem label="Features" current={step === 1} stepNumber={2} totalSteps={3}>
//         <p>Here are the features.</p>
//         <button onClick={() => setStep(step - 1)}>Back</button>
//         <button onClick={() => setStep(step + 1)}>Next</button>
//       </TourListItem>
//       <TourListItem label="Finish" current={step === 2} stepNumber={3} totalSteps={3}>
//         <p>You're all set!</p>
//         <button onClick={() => setActive(false)}>Done</button>
//       </TourListItem>
//     </TourList>
//   </Tour>
//
// Keyboard:
//   - Escape: closes the tour by setting active to false
//
// Accessibility:
//   - role="dialog" identifies the overlay as a dialog window
//   - no aria-modal: the tour is non-modal; it points at the live page, which must stay usable
//   - aria-label={label} provides an accessible name for the tour
//   - tabindex="-1" allows the dialog to receive focus for keyboard events
//
// Internationalization:
//   - The label prop accepts any translated string
//   - All step content comes through TourList and TourListItem children
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Compound component: wrap TourList which contains TourListItem
//   - Uses controlled for two-way binding on active
//
// References:
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface TourProps {
    class?: string;
    /** Accessible name for the tour dialog via aria-label. */
    label: string;
    /** Whether the tour is visible. Bindable via active + onChange. */
    active?: boolean;
    /** TourList and TourListItem elements. */
    children: JSX.Element;
    /** Callback when active changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function Tour(props: TourProps) {
    const p = merge({ class: "" as const, active: false }, props);
    const restProps = omit(p, "class", "label", "active", "onChange", "children");
    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            p.onChange?.(false);
        }
    }

    return (
        <>
            {p.active && (
                <>
                    <div
                        class={`tour ${p.class}`}
                        role="dialog"
                        aria-label={p.label}
                        tabindex={-1}
                        onKeyDown={handleKeyDown}
                        {...restProps}
                    >
                        {p.children}
                    </div>
                </>
            )}
        </>
    );
}
