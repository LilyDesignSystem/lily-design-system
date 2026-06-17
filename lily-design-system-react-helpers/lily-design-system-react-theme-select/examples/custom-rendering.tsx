"use client";

/*
    Example 5 — Custom rendering via the `children` render prop.

    When the default `<option>` markup isn't enough, take over completely.
    The render prop receives:
      - themes:   the slug list
      - value:    the active slug
      - setTheme: imperatively apply a slug (also writes value)
      - name:     the `name` (shared identity for the select)
      - labelFor: the resolved display label for a slug

    Below, we render a row of swatch buttons. Each button:
      - exposes its pressed state via aria-pressed,
      - sets data-theme on itself so consumer CSS can preview the swatch
        colours via the same :root[data-theme] cascade.

    Note: the render output goes inside the `<select>`. Native `<select>`
    only accepts `<option>` / `<optgroup>` children, so a button variant
    like this one is best built outside the select — render it standalone
    and drive it by calling `setTheme` from a wrapper.
*/

import { ThemeSelect } from "../ThemeSelect";

export function CustomRenderingExample() {
    return (
        <ThemeSelect
            label="Theme"
            themesUrl="/assets/themes/"
            themes={["light", "dark", "abyss", "cupcake", "dracula"]}
        >
            {({ themes, value, setTheme, labelFor }) =>
                themes.map((t) => (
                    <button
                        key={t}
                        type="button"
                        className="theme-select-swatch"
                        data-theme={t}
                        aria-pressed={value === t}
                        onClick={() => setTheme(t)}
                    >
                        {labelFor(t)}
                    </button>
                ))
            }
        </ThemeSelect>
    );
}

export default CustomRenderingExample;
