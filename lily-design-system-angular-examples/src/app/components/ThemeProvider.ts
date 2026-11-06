import { ChangeDetectionStrategy, Component, input, computed } from "@angular/core";

function flattenTheme(obj: Record<string, unknown>, prefix = "--theme"): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(obj)) {
        const name = `${prefix}-${key}`;
        if (value !== null && typeof value === "object" && !Array.isArray(value)) {
            Object.assign(out, flattenTheme(value as Record<string, unknown>, name));
        } else if (value !== undefined && value !== null) {
            out[name] = String(value);
        }
    }
    return out;
}

/**
 * ThemeProvider — a container that applies CSS custom properties from a theme object to its children
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `theme-provider` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-theme-provider",
    standalone: true,
    template: `<div class="theme-provider {{ className() }}" [attr.data-theme]="base()" [style]="themeStyle()"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeProvider {
    /** Token object; nested keys flatten into --theme-{path} custom properties. */
    readonly theme = input<Record<string, unknown>>({});
    /** Light or dark base, reflected as data-theme. */
    readonly base = input<"light" | "dark">("light");

    protected readonly themeStyle = computed(() => ({
        display: "contents",
        ...flattenTheme(this.theme()),
    }));
    readonly className = input<string>("");
}
