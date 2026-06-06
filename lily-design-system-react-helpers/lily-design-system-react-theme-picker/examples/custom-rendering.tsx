"use client";

/*
    Example 5 — Custom rendering via the `children` render prop.

    When the default radio-list markup isn't enough, take over completely.
    The render prop receives:
      - themes:   the slug list
      - value:    the active slug
      - setTheme: imperatively apply a slug (also writes value)
      - name:     the radio `name` (shared identity for the picker)
      - labelFor: the resolved display label for a slug

    Below, we render a row of swatch buttons. Each button:
      - exposes its pressed state via aria-pressed,
      - sets data-theme on itself so consumer CSS can preview the swatch
        colours via the same :root[data-theme] cascade.
*/

import { ThemePicker } from "../ThemePicker";

export function CustomRenderingExample() {
    return (
        <ThemePicker
            label="Theme"
            themesUrl="/assets/themes/"
            themes={["light", "dark", "abyss", "cupcake", "dracula"]}
        >
            {({ themes, value, setTheme, labelFor }) =>
                themes.map((t) => (
                    <button
                        key={t}
                        type="button"
                        className="theme-picker-swatch"
                        data-theme={t}
                        aria-pressed={value === t}
                        onClick={() => setTheme(t)}
                    >
                        {labelFor(t)}
                    </button>
                ))
            }
        </ThemePicker>
    );
}

export default CustomRenderingExample;
