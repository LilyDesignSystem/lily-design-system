// TaskList component
//
// A headless task list that renders a semantic ordered list (<ol>) with
// role="list" and an accessible label. Used to display a series of tasks,
// to-dos, or action items in project management tools, to-do apps, or
// onboarding processes. The explicit role="list" ensures screen readers
// announce list semantics even when CSS removes default list styling.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for the task list via aria-label.
//   children — ReactNode, required. Task items (should be <li> elements).
//   ...restProps — additional HTML attributes spread onto the <ul>.
//
// Syntax:
//   <TaskList label="Today's tasks">...</TaskList>
//
// Examples:
//   
//   <TaskList label="Today's tasks">
//     <li>Review pull requests</li>
//     <li>Update documentation</li>
//     <li>Deploy to staging</li>
//   </TaskList>
//
//   
//   <TaskList label="Onboarding CheckList">
//     <li><label><input type="checkbox" /> Create account</label></li>
//     <li><label><input type="checkbox" /> Complete tutorial</label></li>
//   </TaskList>
//
// Keyboard:
//   - None directly -- standard list navigation by screen readers
//   - Tab moves focus between interactive elements within task items
//
// Accessibility:
//   - role="list" explicitly marks this as a list for screen readers
//   - aria-label provides the accessible name for the list
//   - Screen readers announce the list with its label and item count
//
// Internationalization:
//   - The label prop externalizes user-facing text for translation
//   - All task content is provided through the children prop
//   - No hardcoded strings in the component
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Consumers can use checkboxes within <li> for completable tasks
//
// References:
//   - WAI-ARIA list role: https://www.w3.org/TR/wai-aria-1.2/#list

import React from "react";

export interface TaskListProps {
    className?: string;
    /** Accessible label for the task list */
    label: string;
    /** Task items (should be <li> elements) */
    children: React.ReactNode;
    /** Additional HTML attributes */
    [key: string]: unknown;
}

export default function TaskList({
    className = "",
    label,
    children,
    ...restProps
}: TaskListProps) {
    return (
        
        <ol
        className={`task-list ${className}`}
        role="list"
        aria-label={label}
        {...restProps}
        >
        {children}
        </ol>
    );
}
