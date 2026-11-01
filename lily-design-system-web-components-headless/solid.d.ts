// Solid JSX typings for the Lily Web Components catalog.
//
//   import "@lilydesignsystem/web-components-headless/solid";
//
// Every `lily-*` element is accepted, with any attribute: the typings do not
// check one element's attribute names (a misspelt `lable` is not an error).
// `ref`, `class`, `classList`, `id` and `slot` are typed.
// The attribute names of each element are documented in its component file
// and in components/{slug}/index.md, not duplicated here.
import "solid-js";

type LilyAttribute = string | number | boolean | undefined;

interface LilyElementProps {
    ref?: HTMLElement | ((el: HTMLElement) => void);
    class?: string;
    classList?: Record<string, boolean | undefined>;
    children?: unknown;
    id?: string;
    slot?: string;
    // Lily attributes that are not presence-based booleans.
    [attribute: `attr:${string}`]: LilyAttribute;
    [property: `prop:${string}`]: unknown;
    [event: `on:${string}`]: ((event: Event) => void) | undefined;
    [data: `data-${string}`]: LilyAttribute;
    [aria: `aria-${string}`]: LilyAttribute;
    // Plain attributes of the element (label, value, open, …).
    [attribute: string]: unknown;
}

declare module "solid-js" {
    namespace JSX {
        interface IntrinsicElements {
            [element: `lily-${string}`]: LilyElementProps;
        }
    }
}

export {};
