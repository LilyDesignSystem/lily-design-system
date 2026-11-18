// withDefaults — Solid's merge(), with the default applying when a prop is undefined, as in the other catalogs.
//
// Solid 2's merge(defaults, props) lets an explicit `undefined` win: <Button type={maybeType} /> with maybeType
// undefined would render no type at all, and a button with no type in a form submits it. React's destructuring
// defaults, Svelte's and Vue's default props all treat undefined as "not given", and so does this. Each default key
// becomes a getter that reads the prop and falls back to the default; every other prop reads through unchanged, so
// the result stays reactive and works with omit().
import { merge, type Merge } from "solid-js";

export function withDefaults<D extends object, P extends object>(
    defaults: D,
    props: P,
): Merge<[D, P]> {
    const view = {};
    for (const key of Object.keys(defaults)) {
        Object.defineProperty(view, key, {
            enumerable: true,
            get() {
                const value = (props as Record<string, unknown>)[key];
                return value === undefined ? (defaults as Record<string, unknown>)[key] : value;
            },
        });
    }
    return merge(props, view) as unknown as Merge<[D, P]>;
}
