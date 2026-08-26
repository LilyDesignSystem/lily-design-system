// Header component
//
// A semantic page header landmark that renders a native <header> element for introductory
// or navigational content. Typically positioned at the top of a page or section, it contains
// elements like headings, navigation links, branding, search controls, or call-to-action
// buttons. The <header> element is automatically recognized by assistive technologies as
// the banner landmark role when it is a direct child of <body>.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, default undefined. Optional accessible name via aria-label, useful for distinguishing multiple headers.
//   children — ReactNode, required. Content rendered inside the header element.
//   ...restProps — additional HTML attributes spread onto the header element.
//
// Syntax:
//   <Header label="Site header">{children}</Header>
//
// Examples:
//   
//   <Header label="Site header">
//     <h1>My Site</h1>
//   </Header>
//
//   
//   <Header>
//     <h1>Page Title</h1>
//     <nav>
//       <a href="/">Home</a>
//       <a href="/about">About</a>
//     </nav>
//   </Header>
//
// Keyboard:
//   - None — this is a passive container; keyboard interactions are determined by child elements
//
// Accessibility:
//   - The <header> element implicitly has role="banner" when a direct child of <body>
//   - aria-label optionally provides an accessible name to distinguish multiple headers on a page
//   - Screen reader users can navigate directly to the header via landmark navigation
//
// Internationalization:
//   - The label prop allows localized accessible names; no hardcoded user-facing strings
//   - All content comes through the children prop
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses semantic <header> element instead of div with role
//
// References:
//   - MDN header element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header
//   - WAI-ARIA Banner Landmark: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/

import React from "react";

export interface HeaderProps {
    className?: string;
    label?: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Header({
    className = "",
    label = undefined,
    children,
    ...restProps
}: HeaderProps) {
    return (
        <header
        className={`header ${className}`}
        aria-label={label}
        {...restProps}
        >
        {children}
        </header>
    );
}
