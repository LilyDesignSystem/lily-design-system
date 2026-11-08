using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class WatermarkTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Watermark>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".watermark");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Watermark>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".watermark");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Watermark>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".watermark");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Never_names_its_root()
    {
        var cut = RenderComponent<Watermark>();
        Assert.False(cut.Find(".watermark").HasAttribute("aria-label"));
    }

    [Fact]
    public void Renders_the_overlay_and_the_watermark_settings_as_data_attributes()
    {
        var cut = RenderComponent<Watermark>(p => p.Add(x => x.Text, "Draft").Add(x => x.ImageUrl, "/mark.svg").Add(x => x.Gap, "80px").Add(x => x.Rotate, -30));
        var root = cut.Find(".watermark");
        Assert.Equal("-30", root.GetAttribute("data-rotate"));
        Assert.Equal("80px", root.GetAttribute("data-gap"));
        var overlay = cut.Find(".watermark > .watermark-overlay");
        Assert.Equal("true", overlay.GetAttribute("aria-hidden"));
        Assert.Equal("Draft", overlay.GetAttribute("data-text"));
        Assert.Equal("/mark.svg", overlay.GetAttribute("data-image-url"));
    }

    [Fact]
    public void Defaults_match_Svelte()
    {
        var root = RenderComponent<Watermark>().Find(".watermark");
        Assert.Equal("-22", root.GetAttribute("data-rotate"));
        Assert.Equal("100px", root.GetAttribute("data-gap"));
    }
}
