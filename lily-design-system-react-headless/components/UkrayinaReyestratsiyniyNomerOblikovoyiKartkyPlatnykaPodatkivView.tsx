// UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView component
//
// A headless display component for showing Ukraine's
// Реєстраційний номер платника податків (РНОКПП) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView label="Реєстраційний номер платника податків (РНОКПП)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Taxpayer_Identification_Number

import React from "react";

export interface UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView({
    className = "",
    label,
    value = "",
    ...restProps
}: UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivViewProps) {
    return (
        <span
        className={`ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
