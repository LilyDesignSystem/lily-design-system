/*
    Example 5 — Custom rendering: replacing the button glyph.

    ThemeSelect exposes exactly one rendering escape hatch: a projected
    <ng-template> that replaces the glyph inside the trigger button.
    The listbox — its role, options, aria-selected flags,
    aria-activedescendant wiring, and keyboard contract — stays
    component-owned. That narrowness is the point: the accessibility
    contract is the component's job, not the consumer's.

    Two overrides below.

    1. An inline SVG. This is the most common reason to override: the
       default glyph is U+25D1 CIRCLE WITH RIGHT HALF BLACK, and
       whether it renders (and at what weight) depends on the fonts
       installed on the user's device. An SVG is under your control.
       Keep aria-hidden="true" and focusable="false" on it — the
       button is named by its aria-label, and a named or focusable
       graphic inside only adds noise.

    2. A text label plus an open/closed caret, using the ChildArgs
       context: { value, open, labelFor }, passed as both $implicit
       and named properties.

       Note the tradeoff this second form carries. The button now has
       visible text AND an aria-label, and aria-label wins in the
       accessibility tree — so a voice-control user saying the visible
       words may fail to activate it (WCAG 2.5.3 Label in Name). Here
       the label is "Theme" and the visible text is the theme name, so
       they do not match. Prefer the status-region pattern in
       basic.component.ts, which surfaces the active theme without
       touching the button's name.

    The ThemeSelectIcon marker directive is optional. It gives typed
    let- variables under strictTemplates via its ngTemplateContextGuard;
    the component queries any projected <ng-template>, so it changes
    nothing at runtime.

    Note also that .theme-select-icon is not rendered when a template
    is projected, so CSS written against that hook no longer applies.
*/
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ThemeSelect, ThemeSelectIcon } from "../theme-select.component";

@Component({
    selector: "example-custom-rendering",
    standalone: true,
    imports: [ThemeSelect, ThemeSelectIcon],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <!-- 1. Inline SVG replacing the default glyph. -->
        <lily-theme-select
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="themes"
            [(value)]="theme"
        >
            <ng-template>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    focusable="false"
                >
                    <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" />
                    <path d="M8 1a7 7 0 0 1 0 14z" fill="currentColor" />
                </svg>
            </ng-template>
        </lily-theme-select>

        <!-- 2. Text label + caret, driven by the ChildArgs context. -->
        <lily-theme-select
            label="Theme"
            name="labelled"
            themesUrl="/assets/themes/"
            [themes]="themes"
            [(value)]="theme"
        >
            <ng-template lilyThemeSelectIcon let-args>
                {{ args.labelFor(args.value) }}
                <span aria-hidden="true">{{ args.open ? "▴" : "▾" }}</span>
            </ng-template>
        </lily-theme-select>
    `,
})
export class CustomRenderingExample {
    readonly themes = ["light", "dark", "abyss", "cupcake", "dracula"];
    theme = signal("");
}
