// attr — an aria-* or data-* attribute value as React renders it.
//
// Solid treats a boolean attribute value as presence: `false` removes the attribute and `true` renders it empty. React,
// and the other Lily catalogs, render the string "true" or "false", which is what ARIA needs (aria-pressed="false" is a
// toggle button that is off; no aria-pressed is not a toggle button at all). Every non-literal aria-* and data-* value
// that can be a boolean goes through this. null and undefined still remove the attribute.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function attr(value: unknown): any {
    return typeof value === "boolean" ? String(value) : value;
}
