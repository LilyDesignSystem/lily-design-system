// The page-header picker names, from the label packs (spec/label-packs, "Picker names"): one `pickers` section per language,
// loaded through Vite's glob so only that section of each pack reaches the bundle. A language's names are its own pack's;
// where the pack lacks a key the site's own hand-written name for that language fills it, never another language's.
import {
    pickerBarLabels,
    shareLabels,
    type LabelPack,
    type PickerLabels,
    type ShareLabels,
} from "@lilydesignsystem/svelte-locale-translations";

const SECTIONS = import.meta.glob<Record<string, string>>(
    "../../node_modules/@lilydesignsystem/svelte-locale-translations/label-packs/*.json",
    { eager: true, import: "pickers" },
);

/** The pack's `pickers` section for a site locale such as `cy-gb`: its language's pack, `cy-001`. */
function section(locale: string): Record<string, string> | undefined {
    const language = locale.split("-")[0];
    const key = Object.keys(SECTIONS).find((path) => path.endsWith(`/${language}-001.json`));
    return key ? SECTIONS[key] : undefined;
}

/** The picker bar's names for a locale; `fallback` (the site's own) fills any key the pack leaves out. */
export function sitePickerLabels(locale: string, fallback: PickerLabels): PickerLabels {
    const pickers = section(locale);
    if (!pickers) return fallback;
    return {
        ...fallback,
        ...pickerBarLabels({ locale, reviewed: false, pickers } as unknown as LabelPack),
    };
}

/** The share picker's copy-link words for a locale, or none where the pack has no such words. */
export function siteShareLabels(locale: string): ShareLabels {
    const pickers = section(locale);
    return pickers ? shareLabels({ locale, reviewed: false, pickers } as unknown as LabelPack) : {};
}
