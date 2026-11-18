# ItyopyaFaydaIdentificationNumberView

A headless read-only display for Ethiopia's Fayda Identification Number (FIN). Format: Twelve digits issued by the National ID Program (NIDP). The number encodes no personal attributes and no check-digit algorithm is published, so only the length and digits can be checked. Do not confuse it with the six-digit Fayda alternative number used to link bank accounts.

## What it is

A React 19 component that renders an inline `<span>` for displaying Ethiopia's Fayda Identification Number (FIN) read-only.

## When to use it

- Displaying a Fayda Identification Number (FIN) from Ethiopia. Sent by SMS when registration is complete, printed on the Fayda card, and asked for by banks and telecoms.

## When not to use it

- Use `ItyopyaFaydaIdentificationNumberInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/Fayda_ID
