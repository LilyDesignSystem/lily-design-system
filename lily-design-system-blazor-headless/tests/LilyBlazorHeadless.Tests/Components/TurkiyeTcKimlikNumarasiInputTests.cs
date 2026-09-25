using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TurkiyeTcKimlikNumarasiInputTests : TestContext
{
    [Fact]
    public void Renders_as_text_input_with_kebab_base_class()
    {
        var cut = RenderComponent<TurkiyeTcKimlikNumarasiInput>(p => p.Add(x => x.Label, "Label"));
        var root = cut.Find(".turkiye-tc-kimlik-numarasi-input");
        Assert.Equal("input", root.TagName.ToLowerInvariant());
        Assert.Equal("text", root.GetAttribute("type"));
    }

    [Fact]
    public void Autocomplete_is_off()
    {
        var cut = RenderComponent<TurkiyeTcKimlikNumarasiInput>(p => p.Add(x => x.Label, "Label"));
        var root = cut.Find(".turkiye-tc-kimlik-numarasi-input");
        Assert.Equal("off", root.GetAttribute("autocomplete"));
    }

    [Fact]
    public void Aria_label_is_set_from_Label()
    {
        var cut = RenderComponent<TurkiyeTcKimlikNumarasiInput>(p => p.Add(x => x.Label, "Label"));
        var root = cut.Find(".turkiye-tc-kimlik-numarasi-input");
        Assert.Equal("Label", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<TurkiyeTcKimlikNumarasiInput>(p => p
            .Add(x => x.Label, "Label")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".turkiye-tc-kimlik-numarasi-input");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void Required_and_Disabled_pass_through_via_AdditionalAttributes()
    {
        var cut = RenderComponent<TurkiyeTcKimlikNumarasiInput>(p => p
            .Add(x => x.Label, "Label")
            .AddUnmatched("required", "required")
            .AddUnmatched("disabled", "disabled"));
        var root = cut.Find(".turkiye-tc-kimlik-numarasi-input");
        Assert.True(root.HasAttribute("required"));
        Assert.True(root.HasAttribute("disabled"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<TurkiyeTcKimlikNumarasiInput>(p => p
            .Add(x => x.Label, "Label")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".turkiye-tc-kimlik-numarasi-input");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }
}
