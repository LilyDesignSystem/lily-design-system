using Xunit;

namespace LilyDesignSystem.Blazor.LocaleTranslations.Tests;

public class LocaleTranslationsTests
{
    [Fact]
    public void Embeds_all_46_packs() => Assert.Equal(46, LocaleTranslations.Locales.Count);

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
    public void Unknown_locale_throws() => Assert.Throws<ArgumentException>(() => LocaleTranslations.Json("xx-001"));
}
