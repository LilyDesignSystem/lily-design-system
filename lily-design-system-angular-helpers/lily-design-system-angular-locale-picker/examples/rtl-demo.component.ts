/*
    RTL demo — Arabic, Hebrew, Persian, Urdu, Pashto.

    Visualises the select's auto-detection in action. Switching to
    any of the RTL locales writes `dir="rtl"` to <html> and the
    entire page mirrors. Switching back to English restores LTR.

    Outcome: live preview pane reflects current lang and dir via the
    helper-exposed `bcp47LocaleTag` and `isRtlLocale` helpers, used in
    `computed` derivations.
*/
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    signal,
} from "@angular/core";
import {
    LocaleChooser,
    bcp47LocaleTag,
    isRtlLocale,
} from "../locale-chooser.component";

@Component({
    selector: "example-rtl-demo",
    standalone: true,
    imports: [LocaleChooser],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-locale-chooser
            label="Direction demo"
            [locales]="['en', 'ar', 'he', 'fa', 'ur', 'ps']"
            [localeLabels]="NATIVE"
            [(value)]="locale"
        />

        <section [attr.lang]="tag()" [attr.dir]="direction()">
            <h2>{{ NATIVE[locale()] }}</h2>
            <p>{{ sample[locale()] }}</p>
            <p>
                <strong>Detected direction:</strong>
                <code>{{ direction() }}</code>
            </p>
            <p>
                <strong>BCP 47 tag:</strong>
                <code>{{ tag() }}</code>
            </p>
        </section>
    `,
})
export class RtlDemoExample {
    // Endonyms — names of each language *in that language*.
    readonly NATIVE: Record<string, string> = {
        en: "English",
        ar: "العربية",
        he: "עברית",
        fa: "فارسی",
        ur: "اردو",
        ps: "پښتو",
    };

    readonly sample: Record<string, string> = {
        en: "The quick brown fox jumps over the lazy dog.",
        ar: "نص تجريبي يقرأ من اليمين إلى اليسار.",
        he: "טקסט לדוגמה הנקרא מימין לשמאל.",
        fa: "متن نمونه‌ای که از راست به چپ خوانده می‌شود.",
        ur: "نمونہ متن جو دائیں سے بائیں پڑھا جاتا ہے۔",
        ps: "د ښي خوا څخه کیڼ خوا ته د نمونې متن.",
    };

    locale = signal("en");

    readonly direction = computed(() =>
        isRtlLocale(this.locale()) ? "rtl" : "ltr",
    );
    readonly tag = computed(() => bcp47LocaleTag(this.locale()));
}
