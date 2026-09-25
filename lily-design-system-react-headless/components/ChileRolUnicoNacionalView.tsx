// ChileRolUnicoNacionalView component
//
// A headless display component for showing Chile's
// Rol Único Nacional (RUN) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <ChileRolUnicoNacionalView label="Rol Único Nacional (RUN)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/RUT

import React from "react";

export interface ChileRolUnicoNacionalViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function ChileRolUnicoNacionalView({
    className = "",
    label,
    value = "",
    ...restProps
}: ChileRolUnicoNacionalViewProps) {
    return (
        <span
        className={`chile-rol-unico-nacional-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
