// TourList component
//
// A headless guided walkthrough overlay that presents step-by-step
// instructions to users. Useful for onboarding flows, feature tutorials, or
// contextual help systems. The consumer provides TourListItem children to
// define each step of the tour.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the tour dialog via aria-label.
//   active — boolean, default false. Whether the tour is visible; controlled via active + onChange.
//   children — ReactNode, required. TourListItem elements.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <TourList label="Getting started" active={active} onChange={setActive}>...</TourList>
//
// Examples:
//
//   <TourList label="Getting started" active={active} onChange={setActive}>
//     <TourListItem label="Welcome" current={step === 0} stepNumber={1} totalSteps={3}>
//       <p>Welcome to the app!</p>
//       <button onClick={() => setStep(step + 1)}>Next</button>
//     </TourListItem>
//     <TourListItem label="Features" current={step === 1} stepNumber={2} totalSteps={3}>
//       <p>Here are the features.</p>
//       <button onClick={() => setStep(step - 1)}>Back</button>
//       <button onClick={() => setStep(step + 1)}>Next</button>
//     </TourListItem>
//   </TourList>
//
// Keyboard:
//   - Escape: closes the tour by setting active to false
//
// Accessibility:
//   - role="dialog" identifies the overlay as a dialog window
//   - aria-modal="true" indicates the dialog is modal
//   - aria-label={label} provides an accessible name for the tour
//   - tabindex="-1" allows the dialog to receive focus for keyboard events
//
// Internationalization:
//   - The label prop accepts any translated string
//   - All step content comes through TourListItem children
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Compound component: pair with TourListItem for each step
//   - Uses controlled for two-way binding on active
//
// References:
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

import React from "react";

export interface TourListProps {
    className?: string;
    /** Accessible label for the tour. */
    label: string;
    /** TourListItem elements. */
    children: React.ReactNode;
    /** Callback when active changes. */
    onChange?: (value: unknown) => void;
    [key: string]: unknown;
}

export default function TourList({
    className = "",
    label,
    active = false,
    onChange,
    children,
    ...restProps
}: TourListProps) {
    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Escape") {
            onChange?.(false);
        }
    }

    return (
        <>
        {active && (<><ol
        className={`tour-list ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        {...restProps}
        >
        {children}
        </ol></>)}
        </>
    );
}
