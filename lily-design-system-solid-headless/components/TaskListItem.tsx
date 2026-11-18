// TaskListItem component
//
// A single task item within a task list, rendering a semantic <li> element
// containing a checkbox input and label. Supports checked and disabled states,
// making it suitable for to-do lists, CheckLists, and task trackers. The
// checked state is bindable so consumers can reactively track completion.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. The task description displayed as the checkbox label.
//   checked — boolean, default false, bindable. Whether the task is completed.
//   disabled — boolean, default false. Whether the checkbox is disabled.
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Syntax:
//   <TaskListItem label="Buy groceries" />
//   <TaskListItem label="Clean house" checked />
//   <TaskListItem label="Archived task" checked disabled />
//
// Examples:
//
//   <ul aria-label="Today's tasks" role="list">
//     <TaskListItem label="Review pull request" />
//     <TaskListItem label="Update documentation" checked />
//     <TaskListItem label="Deploy to staging" />
//   </ul>
//
//
//   <TaskListItem label="Accept terms" checked={termsAccepted} onChange={setTermsAccepted} />
//
// Keyboard:
//   - Tab: moves focus to the checkbox input
//   - Space: toggles the checkbox checked state
//
// Accessibility:
//   - Semantic <li> element provides list item semantics within the parent list
//   - Native <input type="checkbox"> provides full accessibility support
//   - <label> element is associated with the checkbox via wrapping
//   - aria-checked reflects the current state for assistive technology
//   - Disabled state communicated via the native disabled attribute
//
// Internationalization:
//   - The label prop externalizes the task description for translation
//   - No hardcoded strings in the component
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Should be placed inside a <ul> or <ol> for valid HTML
//   - Consumer can target [data-checked] and [data-disabled] for visual styling
//
// References:
//   - MDN checkbox input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
//   - WAI checkbox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/

import { omit, createSignal, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { useFormReset } from "./form-reset";

export interface TaskListItemProps {
    class?: string;
    /** The task description text. */
    label: string;
    /** Whether the task is completed. Bindable. */
    checked?: boolean;
    /** Whether the checkbox is disabled. */
    disabled?: boolean;
    /** Callback when checked changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function TaskListItem(props: TaskListItemProps) {
    const p = withDefaults({ class: "" as const, checked: false, disabled: false }, props);
    const restProps = omit(p, "class", "label", "checked", "disabled", "onChange");
    const [checked, setChecked] = createSignal(untrack(() => p.checked));
    const itemRef: { current: HTMLLIElement | null } = { current: null };
    const initialChecked = { current: p.checked };

    // Form reset: restore the initial state and tell the consumer.
    useFormReset(
        () => itemRef.current,
        () => {
            setChecked(initialChecked.current);
            p.onChange?.(initialChecked.current);
        },
    );

    const handleChange = (e: Event & { currentTarget: HTMLInputElement }) => {
        const newChecked = e.currentTarget.checked;
        setChecked(newChecked);
        p.onChange?.(newChecked);
    };

    return (
        <li
            ref={(el) => (itemRef.current = el)}
            class={`task-list-item ${p.class}`}
            data-checked={attr(checked())}
            data-disabled={attr(p.disabled || undefined)}
            {...restProps}
        >
            <label>
                <input
                    type="checkbox"
                    checked={checked()}
                    defaultChecked={checked()}
                    onChange={handleChange}
                    disabled={p.disabled}
                />
                {p.label}
            </label>
        </li>
    );
}
