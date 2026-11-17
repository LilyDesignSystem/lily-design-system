// TourList component
//
// A headless guided walkthrough overlay that presents step-by-step
// instructions to users. Useful for onboarding flows, feature tutorials, or
// contextual help systems. The consumer provides TourListItem children to
// define each step of the tour.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the tour dialog via aria-label.
//   active — boolean, default false. Whether the tour is visible; controlled via active + onChange.
//   children — ReactNode, required. TourListItem elements.
//   ...restProps — additional HTML attributes spread onto the <ol>.
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
//   - native <ol> list semantics: no role="dialog" (it would hide the list) and no aria-modal (not modal);
//     dialog semantics belong to the enclosing Tour, which is non-modal
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

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface TourListProps {
    class?: string;
    /** Accessible label for the tour. */
    label: string;
    /** TourListItem elements. */
    children: JSX.Element;
    /** Callback when active changes. */
    onChange?: (value: unknown) => void;
    [key: string]: unknown;
}

export default function TourList(props: TourListProps) {
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
                    <ol
                        class={`tour-list ${p.class}`}
                        aria-label={p.label}
                        tabindex={-1}
                        onKeyDown={handleKeyDown}
                        {...restProps}
                    >
                        {p.children}
                    </ol>
                </>
            )}
        </>
    );
}
