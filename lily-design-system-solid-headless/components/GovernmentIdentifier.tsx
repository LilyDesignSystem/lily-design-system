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
//   class   — string, optional. CSS class name appended to the root.
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

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface GovernmentIdentifierProps {
    class?: string;
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
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function GovernmentIdentifier(props: GovernmentIdentifierProps) {
    const p = merge({ class: "" as const, logoAlt: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "agencyName",
        "agencyHref",
        "logoUrl",
        "logoAlt",
        "description",
        "children",
    );
    return (
        <section
            class={`government-identifier ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            <div class="government-identifier-masthead">
                {p.logoUrl && (
                    <img
                        class="government-identifier-logo"
                        src={p.logoUrl}
                        alt={p.logoAlt}
                    />
                )}
                <p class="government-identifier-agency">
                    {p.agencyHref ? (
                        <a href={p.agencyHref}>{p.agencyName}</a>
                    ) : (
                        <span>{p.agencyName}</span>
                    )}
                </p>
                {p.description && <p class="government-identifier-description">{p.description}</p>}
            </div>
            {p.children && (
                <nav
                    class="government-identifier-links"
                    aria-label={p.label}
                >
                    {p.children}
                </nav>
            )}
        </section>
    );
}
