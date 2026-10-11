using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class SegmentGroupItemTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<SegmentGroupItem>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".segment-group-item");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<SegmentGroupItem>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".segment-group-item");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<SegmentGroupItem>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".segment-group-item");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Root_is_a_button_with_role_radio_reflecting_Checked()
    {
        var cut = RenderComponent<SegmentGroupItem>(p => p
            .AddChildContent("Week")
            .Add(x => x.Value, "week"));
        var root = cut.Find(".segment-group-item");
        Assert.Equal("BUTTON", root.TagName);
        Assert.Equal("button", root.GetAttribute("type"));
        Assert.Equal("radio", root.GetAttribute("role"));
        Assert.Equal("false", root.GetAttribute("aria-checked"));
        Assert.Equal("-1", root.GetAttribute("tabindex"));
        Assert.Equal("week", root.GetAttribute("data-value"));

        cut.SetParametersAndRender(p => p.Add(x => x.Checked, true));
        root = cut.Find(".segment-group-item");
        Assert.Equal("true", root.GetAttribute("aria-checked"));
        Assert.Equal("0", root.GetAttribute("tabindex"));
    }

    [Fact]
    public void Disabled_disables_the_button()
    {
        var cut = RenderComponent<SegmentGroupItem>(p => p
            .AddChildContent("Week")
            .Add(x => x.Disabled, true));
        Assert.True(cut.Find(".segment-group-item").HasAttribute("disabled"));
    }
}
