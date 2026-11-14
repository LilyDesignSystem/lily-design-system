import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    input,
    output,
    signal,
    viewChild,
} from "@angular/core";

export interface DecisionSupportSuggestion {
    id: string;
    label: string;
    isRecommended?: boolean;
}

/**
 * DecisionSupportCard: a clinical decision support card in the CDS Hooks shape (spec/healthcare-ui item 4). Not a live
 * region: whether a critical card interrupts is the consumer's choice. Outputs: suggestion (id), dismissed (reason).
 * Props and rules: DecisionSupportCard.md.
 */
@Component({
    selector: "lily-decision-support-card",
    standalone: true,
    template: `<div class="decision-support-card {{ className() }}" role="group" [attr.aria-label]="label() || summary() || null" [attr.data-indicator]="indicator()"><p class="decision-support-card-header"><span class="decision-support-card-indicator">{{ indicatorLabel() }}</span> <span class="decision-support-card-summary">{{ summary() }}</span></p><div class="decision-support-card-detail"><ng-content /></div><p class="decision-support-card-source">@if (sourceHref()) {<a [attr.href]="sourceHref()">{{ sourceLabel() }}</a>} @else {{{ sourceLabel() }}}</p>@if (suggestions().length) {<div class="decision-support-card-suggestions">@for (s of suggestions(); track s.id) {<button type="button" class="decision-support-card-suggestion" [attr.data-recommended]="s.isRecommended ? 'true' : null" (click)="suggestion.emit(s.id)">{{ s.label }}</button>}</div>}@if (links().length) {<ul class="decision-support-card-links">@for (link of links(); track link.href) {<li><a [attr.href]="link.href">{{ link.label }}</a></li>}</ul>}@if (dismissLabel()) {<form class="decision-support-card-override" novalidate (submit)="dismiss($event)">@if (overrideReasons().length) {<label class="decision-support-card-override-label">{{ overrideReasonLabel() }} <select #reasonSelect class="decision-support-card-override-reason" required [attr.aria-invalid]="invalid() ? 'true' : null" (change)="choose($any($event.target).value)"><option value="">{{ overrideReasonPlaceholder() }}</option>@for (r of overrideReasons(); track r.code) {<option [value]="r.code">{{ r.display }}</option>}</select></label>}<button type="submit" class="decision-support-card-dismiss">{{ dismissLabel() }}</button></form>}</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecisionSupportCard {
    readonly className = input<string>("");
    /** The one-sentence summary; names the card. */
    readonly summary = input<string>("");
    readonly indicator = input<"info" | "warning" | "critical">("info");
    /** The indicator in words, so urgency is never colour alone. */
    readonly indicatorLabel = input<string>("");
    readonly sourceLabel = input<string>("");
    readonly sourceHref = input<string>("");
    readonly suggestions = input<DecisionSupportSuggestion[]>([]);
    readonly links = input<{ label: string; href: string }[]>([]);
    /** The dismiss button's text; no button without it. */
    readonly dismissLabel = input<string>("");
    /** When given, dismissing asks for one. */
    readonly overrideReasons = input<{ code: string; display: string }[]>([]);
    readonly overrideReasonLabel = input<string>("");
    readonly overrideReasonPlaceholder = input<string>("");
    readonly label = input<string>("");
    /** The chosen suggestion's id; the consumer applies it and enforces selectionBehavior. */
    readonly suggestion = output<string>();
    /** Emitted with the chosen reason's code (or undefined when no reasons are offered). */
    readonly dismissed = output<string | undefined>();

    protected readonly invalid = signal(false);
    private readonly reason = signal("");
    private readonly reasonSelect = viewChild<ElementRef<HTMLSelectElement>>("reasonSelect");

    protected choose(value: string): void {
        this.reason.set(value);
        this.invalid.set(false);
    }

    protected dismiss(event: Event): void {
        event.preventDefault();
        if (this.overrideReasons().length > 0 && !this.reason()) {
            this.invalid.set(true);
            this.reasonSelect()?.nativeElement.focus();
            return;
        }
        this.invalid.set(false);
        this.dismissed.emit(this.reason() || undefined);
    }
}
