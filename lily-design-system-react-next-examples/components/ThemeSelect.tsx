// ThemeSelect component
//
// A headless theme selection control that renders a native <select> dropdown
// for choosing between visual themes or color schemes. Commonly used for
// light, dark, high-contrast, or system-default theme options. The consumer
// provides <option> elements as children and is responsible for applying the
// selected theme value to the page.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Bindable selected theme; supports value + onChange.
//   children — ReactNode, required. ThemeSelectOption elements representing available themes.
//   ...restProps — additional HTML attributes spread onto the <select>.
//
// Syntax:
//   <ThemeSelect label="Theme" value={value} onChange={setValue}>...</ThemeSelect>
//
// Examples:
//
//   <ThemeSelect label="Color scheme" value={theme} onChange={setTheme}>
//     <ThemeSelectOption value="light">Light</ThemeSelectOption>
//     <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
//     <ThemeSelectOption value="high-contrast">High Contrast</ThemeSelectOption>
//     <ThemeSelectOption value="system">System Default</ThemeSelectOption>
//   </ThemeSelect>
//
// Keyboard:
//   - Tab: moves focus to the select element (native behavior)
//   - Space/Enter: opens the dropdown (native behavior)
//   - ArrowUp/ArrowDown: navigates through options (native behavior)
//   - Escape: closes the dropdown (native behavior)
//
// Accessibility:
//   - aria-label={label} provides an accessible name since no visible <label> is included
//
// Internationalization:
//   - The label prop accepts any translated string
//   - Option text is consumer-provided and can be localized
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Consumer applies the selected theme value to the page
//   - Uses controlled for two-way data binding on value
//
// References:
//   - MDN select element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
//   - WCAG 1.4.12 Text Spacing: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html

import React from "react";

export interface ThemeSelectProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Selected theme. Bindable. */
    value?: string;
    /** ThemeSelectOption elements. */
    children: React.ReactNode;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function ThemeSelect({
    className = "",
    label,
    value = "",
    onChange,
    children,
    ...restProps
}: ThemeSelectProps) {
    return (
        <select
        className={`theme-select ${className}`}
        aria-label={label}
        value={value} onChange={(e) => onChange?.(e.target.value)}
        {...restProps}
        >
        {children}
        </select>
    );
}
