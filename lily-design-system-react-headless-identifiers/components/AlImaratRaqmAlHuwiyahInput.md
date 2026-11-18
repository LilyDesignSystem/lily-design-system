# AlImaratRaqmAlHuwiyahInput

A headless input for the United Arab Emirates' Emirates ID number. Format: Fifteen digits, written 784-YYYY-NNNNNNN-C: 784 (the country's ISO numeric code), four digits that are usually but not always the year of birth, a seven-digit serial and a check digit. Vendors document a Luhn check over the fifteen digits; the issuer does not publish it, so treat a failure as a warning.

## What it is

A React 19 component that renders a native `<input type="text">` for entering the United Arab Emirates' Emirates ID number.

## When to use it

- Forms collecting a Emirates ID number from the United Arab Emirates. Printed on the Emirates ID card issued by the Federal Authority for Identity, Citizenship, Customs and Port Security (ICP), and used as the patient identifier in UAE health records.

## When not to use it

- Use `AlImaratRaqmAlHuwiyahView` for the read-only display counterpart.

## References

- https://en.wikipedia.org/wiki/Emirates_ID
