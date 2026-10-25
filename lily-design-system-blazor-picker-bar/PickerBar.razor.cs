// PickerBar — code-behind. See spec/index.md for the contract.

using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Components;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>
/// The seven accessible names PickerBar's five wrapped pickers need (three
/// for search: button, field, ⏎). Grouped into one object rather than
/// seven flat parameters — the same reasoning as
/// <c>DateTimePickerLabels</c> in the sibling date-time-picker package:
/// structural labels this catalog did not invent get no English default.
/// See spec/index.md §4.
/// </summary>
public sealed record PickerBarLabels
{
    /// <summary>Accessible name for the link picker's icon button and list. Needed only when
    /// <c>Links</c> is supplied; the link picker renders only when both are present.</summary>
    public string? Link { get; init; }

    /// <summary>Accessible name for the search picker's icon button and search landmark.</summary>
    public required string Search { get; init; }

    /// <summary>Accessible name for the search picker's text field.</summary>
    public required string SearchInput { get; init; }

    /// <summary>Accessible name for the search picker's ⏎ submit button.</summary>
    public required string SearchSubmit { get; init; }

    /// <summary>Accessible name for the theme picker's button and listbox.</summary>
    public required string Theme { get; init; }

    /// <summary>Accessible name for the locale picker's button and listbox.</summary>
    public required string Locale { get; init; }

    /// <summary>Accessible name for the time-zone picker's button and listbox. Needed only when
    /// <c>TimeZoneLocale</c> is supplied; the time-zone picker renders only when both are present.</summary>
    public string? TimeZone { get; init; }

    /// <summary>Accessible name for the text-size picker's button and listbox.</summary>
    public required string TextSize { get; init; }

    /// <summary>Accessible name for the share picker's button and list.</summary>
    public required string Share { get; init; }
}

public partial class PickerBar : ComponentBase
{
    /// <summary>
    /// All 57 Lily reference theme slugs (see <c>themes/</c> at the repo
    /// root), sorted alphabetically except the United Kingdom and United
    /// States government/public-sector themes, which sort last as one
    /// alphabetical group of their own. Mirrors ThemePicker's own
    /// title-casing of each slug, so no <c>ThemeLabels</c> override is
    /// needed for these to read well.
    /// </summary>
    public static readonly IReadOnlyList<string> DefaultThemes = new[]
    {
        "abyss",
        "acid",
        "adobe-spectrum",
        "ant-design",
        "aqua",
        "atlassian",
        "autumn",
        "black",
        "bumblebee",
        "business",
        "cappuccino",
        "caramellatte",
        "cmyk",
        "coffee",
        "corporate",
        "cupcake",
        "cyberpunk",
        "dark",
        "dim",
        "dracula",
        "emerald",
        "excel",
        "fantasy",
        "fluent",
        "forest",
        "garden",
        "github-primer",
        "halloween",
        "ibm-carbon",
        "lemonade",
        "light",
        "linear",
        "lofi",
        "luxury",
        "mozilla-protocol",
        "night",
        "nord",
        "notion",
        "pastel",
        "retro",
        "salesforce",
        "sap-fiori",
        "silk",
        "sunset",
        "synthwave",
        "valentine",
        "vercel",
        "winter",
        "wireframe",
        "united-kingdom-government-digital-service",
        "united-kingdom-national-health-service-england-for-patients",
        "united-kingdom-national-health-service-england-for-practitioners",
        "united-kingdom-national-health-service-scotland-for-patients",
        "united-kingdom-national-health-service-scotland-for-practitioners",
        "united-kingdom-national-health-service-wales-for-patients",
        "united-kingdom-national-health-service-wales-for-practitioners",
        "united-states-web-design-system",
    };

    /// <summary>
    /// The seven-step text-size scale. Each slug title-cases to exactly the
    /// requested label ("largest" → "Largest", …) via TextSizePicker's own
    /// default label resolver, so no <c>SizeLabels</c> override is needed.
    /// </summary>
    public static readonly IReadOnlyList<string> DefaultSizes = new[]
    {
        "largest",
        "larger",
        "large",
        "normal",
        "small",
        "smaller",
        "smallest",
    };

    // -------------------------------------------------------------------
    // Parameters — see spec/index.md §4.
    // -------------------------------------------------------------------

    /// <summary>Accessible names for each picker.</summary>
    [Parameter, EditorRequired] public PickerBarLabels Labels { get; set; } = default!;

    /// <summary>
    /// Page links for the link picker (a home icon), which renders FIRST — leftmost. Defined by
    /// the app; omitted or empty (or no <c>Labels.Link</c>) means no link picker.
    /// </summary>
    [Parameter] public IReadOnlyList<LinkItem> Links { get; set; } = Array.Empty<LinkItem>();

    /// <summary>
    /// Extra LinkPicker parameters (e.g. <c>OnNavigate</c>), splatted onto the nested LinkPicker
    /// after this bar's own parameters.
    /// </summary>
    [Parameter] public Dictionary<string, object>? LinkAttributes { get; set; }

    /// <summary>
    /// Extra SearchPicker parameters (e.g. <c>Action</c>, <c>Navigate</c>,
    /// <c>Placeholder</c>, <c>OnSearch</c>), splatted onto the nested
    /// SearchPicker after this bar's own parameters — so anything here
    /// overrides PickerBar's value.
    /// </summary>
    [Parameter] public Dictionary<string, object>? SearchAttributes { get; set; }

    /// <summary>Base URL of the themes directory, forwarded to ThemePicker.</summary>
    [Parameter, EditorRequired] public string ThemesUrl { get; set; } = "";

    /// <summary>Available theme slugs. Defaults to <see cref="DefaultThemes"/>.</summary>
    [Parameter] public IReadOnlyList<string> Themes { get; set; } = DefaultThemes;

    /// <summary>
    /// Extra ThemePicker parameters (e.g. <c>StorageKey</c>,
    /// <c>DetectFromSystem</c>, <c>DefaultValue</c>), splatted onto the
    /// nested ThemePicker after this bar's own parameters — so anything
    /// here overrides PickerBar's default.
    /// </summary>
    [Parameter] public Dictionary<string, object>? ThemeAttributes { get; set; }

    /// <summary>Available locale codes. No catalog default exists — supply the set you support.</summary>
    [Parameter, EditorRequired] public IReadOnlyList<string> Locales { get; set; } = Array.Empty<string>();

    /// <summary>Extra LocalePicker parameters, splatted after this bar's own.</summary>
    [Parameter] public Dictionary<string, object>? LocaleAttributes { get; set; }

    /// <summary>
    /// The language that names and sorts the zones (BCP 47, e.g. <c>fr</c>). The time-zone picker, which sits
    /// after the locale picker, renders only when this and <c>Labels.TimeZone</c> are both given.
    /// </summary>
    [Parameter] public string? TimeZoneLocale { get; set; }

    /// <summary>Extra TimeZonePicker parameters (<c>Names</c> from <c>LocaleTranslations.ZoneNames</c>, <c>Zones</c>, <c>Date</c>, …), splatted after this bar's own.</summary>
    [Parameter] public Dictionary<string, object>? TimeZoneAttributes { get; set; }

    /// <summary>Available size slugs. Defaults to <see cref="DefaultSizes"/>.</summary>
    [Parameter] public IReadOnlyList<string> Sizes { get; set; } = DefaultSizes;

    /// <summary>
    /// Extra TextSizePicker parameters, splatted after this bar's own —
    /// including after the built-in <c>DefaultValue="normal"</c>, so a
    /// <c>DefaultValue</c> entry here overrides it.
    /// </summary>
    [Parameter] public Dictionary<string, object>? TextSizeAttributes { get; set; }

    /// <summary>Destinations offered by the share picker. Empty is valid if a copy label is supplied via <see cref="ShareAttributes"/>.</summary>
    [Parameter] public IReadOnlyList<ShareTarget> ShareTargets { get; set; } = Array.Empty<ShareTarget>();

    /// <summary>Extra SharePicker parameters, splatted after this bar's own.</summary>
    [Parameter] public Dictionary<string, object>? ShareAttributes { get; set; }

    /// <summary>Extra CSS class merged into the root &lt;div&gt;.</summary>
    [Parameter] public string CssClass { get; set; } = "";

    /// <summary>Captures all unmatched attributes; spread onto the root.</summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    private string RootClass => $"picker-bar {CssClass}".Trim();
}
