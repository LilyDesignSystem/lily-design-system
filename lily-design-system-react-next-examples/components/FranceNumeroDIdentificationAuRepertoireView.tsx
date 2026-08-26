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
//   label — string, required. Accessible label for screen readers via aria-label.
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
//   - aria-label provides the accessible name so screen readers announce the purpose
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
    label: string;
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
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
