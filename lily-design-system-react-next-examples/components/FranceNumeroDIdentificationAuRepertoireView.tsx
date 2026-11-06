// FranceNumeroDIdentificationAuRepertoireView component
//
// A headless display component for showing a France numéro d'identification
// au répertoire (NIR) in a read-only format. Renders the number as an inline
// <span> element with an accessible label. Suitable for patient records,
// summaries, confirmation screens, or any context where a NIR needs
// to be displayed but not edited. This is the View counterpart to the Input
// component in the Input/View pattern.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The NIR string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <FranceNumeroDIdentificationAuRepertoireView label="NIR" value="1 85 05 75 012 345 67" />
//
// Examples:
//
//   <FranceNumeroDIdentificationAuRepertoireView label="Numéro de sécurité sociale" value={nir} />
//
// Keyboard:
//   - None -- passive display-only component
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//   - Screen readers announce the label followed by the text content (the number)
//
// Internationalization:
//   - The label prop externalizes user-facing text for translation
//   - No hardcoded strings in the component
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - No formatting or validation; consumer provides the value pre-formatted
//   - Read-only display; pairs with Input component for editing
//
// References:
//   - Ameli.fr: https://www.ameli.fr/assure/droits-demarches/principes/numero-securite-sociale

import React from "react";

export interface FranceNumeroDIdentificationAuRepertoireViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The NIR to display */
    value?: string;
    /** Additional HTML attributes */
    [key: string]: unknown;
}

export default function FranceNumeroDIdentificationAuRepertoireView({
    className = "",
    label,
    value = "",
    ...restProps
}: FranceNumeroDIdentificationAuRepertoireViewProps) {
    return (
        <span
            className={`france-numero-d-identification-au-repertoire-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
