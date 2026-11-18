# ItyopyaFaydaIdentificationNumberInput

A headless input for Ethiopia's Fayda Identification Number (FIN). Format: Twelve digits issued by the National ID Program (NIDP). The number encodes no personal attributes and no check-digit algorithm is published, so only the length and digits can be checked. Do not confuse it with the six-digit Fayda alternative number used to link bank accounts.

## What it is

A React 19 component that renders a native `<input type="text">` for entering Ethiopia's Fayda Identification Number (FIN).

## When to use it

- Forms collecting a Fayda Identification Number (FIN) from Ethiopia. Sent by SMS when registration is complete, printed on the Fayda card, and asked for by banks and telecoms.

## When not to use it

- Use `ItyopyaFaydaIdentificationNumberView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Fayda_ID
