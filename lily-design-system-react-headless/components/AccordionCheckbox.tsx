// AccordionCheckbox component
//
// A compound disclosure widget that pairs a checkbox option with a revealable
// panel. The user sees a checkbox option; checking the box reveals an
// accordion panel of additional content beneath it. Multiple AccordionCheckbox
// instances stacked vertically form a list of independent toggleable options.
//
// Unlike Details, which uses a <summary> toggle, this component uses a real
// form control. The `checked` prop is the source of truth.
//
// Props:
//   className — string, optional. CSS class appended to .accordion-checkbox.
//   label — string, required. Checkbox label text.
//   checked — boolean, default false. Whether the checkbox is checked and the
//             panel is revealed; controlled when paired with onChange.
//   id — string, optional. Base id for the checkbox/panel link;
//        auto-generated if not provided.
//   onChange — (checked: boolean) => void, optional. Callback when checked
//              changes.
//   children — ReactNode, required. Content shown when checked.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <AccordionCheckbox label="Show options">…</AccordionCheckbox>
//
// Examples:
//   <AccordionCheckbox label="I have a follow-up question">
//     <textarea aria-label="Your question" />
//   </AccordionCheckbox>
//
//   <AccordionCheckbox label="Subscribe" checked={subscribe} onChange={setSubscribe}>
//     <p>Choose your topics below.</p>
//   </AccordionCheckbox>
//
// Keyboard:
//   - Tab: moves focus onto the checkbox
//   - Space: toggles the checkbox (native), revealing or hiding the panel
//
// Accessibility:
//   - aria-controls on the checkbox references the panel id
//   - aria-expanded on the checkbox reflects the checked state
//   - role="region" + aria-labelledby on the panel
//   - hidden attribute on the panel when unchecked
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Auto-generates a unique id so multiple instances do not collide
//
// References:
//   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
//   - MDN input type=checkbox: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox

import React, { useId, useState } from "react";

export interface AccordionCheckboxProps {
    className?: string;
    /** Checkbox label text. */
    label: string;
    /** Whether the checkbox is checked. */
    checked?: boolean;
    /** Base id for the checkbox/panel link. */
    id?: string;
    /** Callback when checked changes. */
    onChange?: (checked: boolean) => void;
    /** Content shown when checked. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function AccordionCheckbox({
    className = "",
    label,
    checked: checkedProp,
    id,
    onChange,
    children,
    ...restProps
}: AccordionCheckboxProps) {
    const generatedId = useId();
    const baseId = id ?? `accordion-checkbox-${generatedId.replace(/:/g, "")}`;
    const checkboxId = `${baseId}-checkbox`;
    const panelId = `${baseId}-panel`;

    const [internalChecked, setInternalChecked] = useState(checkedProp ?? false);
    const isControlled = checkedProp !== undefined;
    const checked = isControlled ? checkedProp : internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.checked;
        if (!isControlled) setInternalChecked(next);
        onChange?.(next);
    };

    return (
        <div className={`accordion-checkbox ${className}`} {...restProps}>
            <input
                type="checkbox"
                className="accordion-checkbox-input"
                id={checkboxId}
                aria-controls={panelId}
                aria-expanded={checked}
                checked={checked}
                onChange={handleChange}
            />
            <label className="accordion-checkbox-label" htmlFor={checkboxId}>
                {label}
            </label>
            <div
                className="accordion-checkbox-panel"
                id={panelId}
                role="region"
                aria-labelledby={checkboxId}
                hidden={!checked}
            >
                {children}
            </div>
        </div>
    );
}
