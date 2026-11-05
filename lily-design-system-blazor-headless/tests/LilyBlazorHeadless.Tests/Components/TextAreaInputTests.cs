using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TextAreaInputTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<TextAreaInput>();
        var root = cut.Find(".text-area-input");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<TextAreaInput>(p => p
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".text-area-input");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<TextAreaInput>(p => p
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".text-area-input");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Names_itself_with_aria_label()
    {
        var cut = RenderComponent<TextAreaInput>(p => p.Add(x => x.Label, "Name"));
        Assert.Equal("Name", cut.Find("textarea.text-area-input").GetAttribute("aria-label"));
    }
}
