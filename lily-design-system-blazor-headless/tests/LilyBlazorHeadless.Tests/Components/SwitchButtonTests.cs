using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class SwitchButtonTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<SwitchButton>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".switch-button");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<SwitchButton>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".switch-button");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<SwitchButton>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".switch-button");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Clicking_toggles_Checked_and_invokes_CheckedChanged()
    {
        bool? changed = null;
        var cut = RenderComponent<SwitchButton>(p => p
            .Add(x => x.Checked, false)
            .Add(x => x.CheckedChanged, v => changed = v));
        var root = cut.Find(".switch-button");
        Assert.Equal("false", root.GetAttribute("aria-checked"));

        root.Click();

        Assert.True(changed);
        root = cut.Find(".switch-button");
        Assert.Equal("true", root.GetAttribute("aria-checked"));
    }
}
