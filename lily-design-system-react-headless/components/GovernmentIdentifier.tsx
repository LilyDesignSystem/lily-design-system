// GovernmentIdentifier component
//
// An identifier section anchoring a government site, including the parent
// agency logo, agency name, optional description, and a region of required
// links. Inspired by the USWDS Identifier component. Renders a <section>
// with two regions: a masthead and a nested <nav> for required links. The
// agency logo (<img>) is rendered only when `logoUrl` is provided. The
// agency name is wrapped in <a> only when `agencyHref` is provided.
//
// Props:
//   className   — string, optional. CSS class name appended to the root.
//   label       — string, REQUIRED. aria-label for the section and nav.
//   agencyName  — string, REQUIRED. Parent agency name.
//   agencyHref  — string, optional. Link to the agency's site.
//   logoUrl     — string, optional. Agency logo image src.
//   logoAlt     — string, optional. Logo alt text.
//   description — string, optional. Agency description text.
//   children    — ReactNode, optional. Required-links list/nav content.
//   ...restProps — additional HTML attributes spread onto the <section>.
//
// Syntax:
//   <GovernmentIdentifier
//     label="Agency identifier"
//     agencyName="An official website of the General Services Administration"
//     agencyHref="https://gsa.gov"
//     logoUrl="/gsa-logo.svg"
//     logoAlt="GSA logo"
//   >
//     <ul>
//       <li><a href="/about">About</a></li>
//     </ul>
//   </GovernmentIdentifier>
//
// Accessibility:
//   - <section> with aria-label provides a region landmark
//   - Nested <nav> with aria-label identifies the required links
//   - Logo image renders alt text from logoAlt
//
// Internationalization:
//   - All user-facing text is consumer-supplied via props
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label and agencyName are non-optional in the interface
//   - <img> renders only when logoUrl is provided
//   - <a> wraps agencyName only when agencyHref is provided
//
// References:
//   - USWDS Identifier: https://designsystem.digital.gov/components/identifier/

import React from "react";

export interface GovernmentIdentifierProps {
    className?: string;
    /** aria-label for the section (required) */
    label: string;
    /** Parent agency name (required) */
    agencyName: string;
    /** Link to the agency's site */
    agencyHref?: string;
    /** Agency logo image src */
    logoUrl?: string;
    /** Logo alt text */
    logoAlt?: string;
    /** Agency description text */
    description?: string;
    /** Required-links list/nav content */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function GovernmentIdentifier({
    className = "",
    label,
    agencyName,
    agencyHref,
    logoUrl,
    logoAlt = "",
    description,
    children,
    ...restProps
}: GovernmentIdentifierProps) {
    return (
        <section
        className={`government-identifier ${className}`}
        aria-label={label}
        {...restProps}
        >
        <div className="government-identifier-masthead">
            {logoUrl && (
                <img
                className="government-identifier-logo"
                src={logoUrl}
                alt={logoAlt}
                />
            )}
            <p className="government-identifier-agency">
                {agencyHref ? (
                    <a href={agencyHref}>{agencyName}</a>
                ) : (
                    <span>{agencyName}</span>
                )}
            </p>
            {description && (
                <p className="government-identifier-description">{description}</p>
            )}
        </div>
        {children && (
            <nav
            className="government-identifier-links"
            aria-label={label}
            >
            {children}
            </nav>
        )}
        </section>
    );
}
