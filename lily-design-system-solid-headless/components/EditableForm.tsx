// EditableForm component
//
// An editable form that wraps inline editing functionality in a <form> element,
// providing submit and cancel semantics with keyboard support. The form is only
// rendered when the editing prop is true. Useful for editing records in place,
// such as updating profiles, renaming items, or modifying settings.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the form.
//   editing — boolean, default false. Whether the form is in edit mode; bindable.
//   onSubmit — (event: Event) => void, default undefined. Callback when the form is submitted.
//   onCancel — () => void, default undefined. Callback when editing is cancelled.
//   children — ReactNode, required. Form content (inputs, buttons, etc.).
//   ...restProps — additional HTML attributes spread onto the <form> element.
//
// Syntax:
//   <EditableForm label="Edit profile" editing={editing} onChange={setEditing} onSubmit={save}>
//     <input name="name" />
//     <button type="submit">Save</button>
//   </EditableForm>
//
// Examples:
//
//   <EditableForm label="Edit profile" editing={editing} onChange={setEditing} onSubmit={save}>
//     <input name="name" value={name} />
//     <button type="submit">Save</button>
//   </EditableForm>
//
//
//   <EditableForm label="Rename item" editing={editing} onChange={setEditing} onSubmit={rename} onCancel={revert}>
//     <input name="title" value={title} />
//     <button type="submit">OK</button>
//     <button type="button" onClick={() => setEditing(false)}>Cancel</button>
//   </EditableForm>
//
// Keyboard:
//   - Enter: submits the form (native behavior), exits edit mode, calls onSubmit
//   - Escape: cancels editing, exits edit mode, calls onCancel
//
// Accessibility:
//   - aria-label provides the accessible name for the form
//   - tabindex="-1" allows programmatic focus management
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//   - All button and input labels come from consumer-provided children
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Form is removed from DOM when editing is false
//   - Uses controlled on editing for two-way state binding
//   - Calls event.preventDefault() on submit for consumer-controlled save logic
//
// References:
//   - WAI-ARIA Form Role: https://www.w3.org/WAI/ARIA/apd/roles/form/

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { warnMissingName } from "./dev-warning";

export interface EditableFormProps {
    class?: string;
    /** Accessible name for the form. */
    label: string;
    /** Whether the form is in edit mode. Bindable. */
    editing?: boolean;
    /** Called when form is submitted. */
    onSubmit?: (event: Event) => void;
    /** Called when editing is cancelled. */
    onCancel?: () => void;
    /** Form content. */
    children?: JSX.Element;
    /** Callback when editing changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function EditableForm(props: EditableFormProps) {
    const p = merge({ class: "" as const, editing: false }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "editing",
        "onSubmit",
        "onCancel",
        "onChange",
        "children",
    );
    warnMissingName("EditableForm", p.label, p["aria-label"], p["aria-labelledby"]);
    function handleSubmit(event: Event) {
        event.preventDefault();
        p.onChange?.(false);
        p.onSubmit?.(event);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            event.preventDefault();
            p.onChange?.(false);
            p.onCancel?.();
        }
    }

    return (
        <>
            {p.editing && (
                <form
                    class={`editable-form ${p.class}`}
                    aria-label={p.label}
                    tabindex={-1}
                    onSubmit={handleSubmit}
                    onKeyDown={handleKeydown}
                    {...restProps}
                >
                    {p.children}
                </form>
            )}
        </>
    );
}
