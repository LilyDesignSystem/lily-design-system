using Xunit;

namespace LilyDesignSystem.Blazor.LocaleTranslations.Tests;

public class LocaleTranslationsTests
{
    [Fact]
    public void TextSizeLabels_has_all_seven_sizes_in_every_pack()
    {
        Assert.Equal("el más grande", LocaleTranslations.TextSizeLabels("es-001")["largest"]);
        Assert.All(LocaleTranslations.Locales, l => Assert.Equal(7, LocaleTranslations.TextSizeLabels(l).Count));
    }

    [Fact]
    public void Embeds_all_64_packs() => Assert.Equal(64, LocaleTranslations.Locales.Count);

    [Fact]
    public void Each_pack_names_itself()
    {
        foreach (var locale in LocaleTranslations.Locales)
            Assert.Contains($"\"locale\": \"{locale}\"", LocaleTranslations.Json(locale));
    }

    [Fact]
    public void Only_english_is_reviewed()
    {
        Assert.True(LocaleTranslations.Reviewed("en-001"));
        Assert.All(LocaleTranslations.Locales.Where(l => l != "en-001"), l => Assert.False(LocaleTranslations.Reviewed(l)));
    }

    [Fact]
    public void Names_the_language_in_itself_and_in_others()
    {
        Assert.Equal("Cymraeg", LocaleTranslations.Endonym("cy-001"));
        Assert.Equal("Welsh", LocaleTranslations.Exonym("cy-001", "en-001"));
        Assert.Null(LocaleTranslations.Exonym("cy-001", "bh-001"));
    }

    [Fact]
    public void Embeds_a_zone_name_pack_for_every_label_pack_locale()
        => Assert.Equal(LocaleTranslations.Locales, LocaleTranslations.ZoneNameLocales);

    [Fact]
    public void Zone_names_are_cldrs_in_the_packs_language()
    {
        var fr = LocaleTranslations.ZoneNames("fr-001");
        Assert.Contains("Europe centrale", fr["Europe/Paris"].Standard);
        Assert.NotNull(fr["Europe/Paris"].Daylight);
        Assert.NotEqual(fr["Europe/Paris"].Standard, fr["Europe/Paris"].Daylight);
        Assert.Equal("日本標準時", LocaleTranslations.ZoneNames("ja-001")["Asia/Tokyo"].Standard);
        Assert.Equal("Central European Standard Time", LocaleTranslations.ZoneNames("en-001")["Europe/Paris"].Standard);
    }

    [Fact]
    public void A_zone_with_one_name_all_year_has_no_daylight_name()
        => Assert.Null(LocaleTranslations.ZoneNames("en-001")["Asia/Tokyo"].Daylight);

    [Fact]
    public void Current_iana_ids_are_named_not_only_the_legacy_ones()
    {
        var names = LocaleTranslations.ZoneNames("hi-001");
        Assert.Contains("Asia/Kolkata", names.Keys);
        Assert.Contains("Europe/Kyiv", names.Keys);
    }

    [Fact]
    public void Cornish_scots_and_wu_have_no_cldr_zone_names()
    {
        foreach (var locale in new[] { "kw-001", "sco-001", "wuu-001" }) Assert.Empty(LocaleTranslations.ZoneNames(locale));
    }

    [Fact]
    public void Each_zone_name_pack_says_which_cldr_it_is() => Assert.Matches(@"^\d+(\.\d+)?$", LocaleTranslations.ZoneNamesCldrVersion("fr-001"));

    [Fact]
    public void Unknown_zone_name_locale_throws() => Assert.Throws<ArgumentException>(() => LocaleTranslations.ZoneNames("xx-001"));

    [Fact]
    public void Unknown_locale_throws() => Assert.Throws<ArgumentException>(() => LocaleTranslations.Json("xx-001"));
}
