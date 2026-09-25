# IndonesiaNomorIndukKependudukanView

A headless read-only display for Indonesia's Nomor Induk Kependudukan (NIK). Format: Sixteen digits in the form PPKKCC-DDMMYY-NNNN: the first six digits encode province, regency/city, and sub-district of first registration; the next six encode date of birth (with 40 added to the day-of-month digits for a female holder, e.g. day 10 becomes 50); the final four digits are a sequence number disambiguating same-day-same-subdistrict registrations. No published check digit.

## What it is

A React 19 component that renders an inline `<span>` for displaying Indonesia's Nomor Induk Kependudukan (NIK) read-only.

## When to use it

- Displaying a Indonesia Nomor Induk Kependudukan (NIK). Printed on the Kartu Tanda Penduduk (KTP) national ID card, and required to enrol in BPJS Kesehatan, Indonesia's national government health-insurance body.

## When not to use it

- Use `IndonesiaNomorIndukKependudukanInput` for the editable input counterpart.

## References

- https://en.wikipedia.org/wiki/National_identification_number
