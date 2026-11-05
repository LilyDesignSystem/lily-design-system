using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class MentionsInputTests : TestContext
{
    public MentionsInputTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<MentionsInput>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".mentions-input");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<MentionsInput>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".mentions-input");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<MentionsInput>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".mentions-input");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void The_panel_is_a_manual_popover_shown_from_Expanded()
    {
        var cut = RenderComponent<MentionsInput>(p => p.Add(x => x.Label, "Message"));
        var panel = cut.Find(".mentions-input-suggestions");
        Assert.Equal("manual", panel.GetAttribute("popover"));
        Assert.False(panel.HasAttribute("hidden"));
        JSInterop.VerifyInvoke("attach", 2);
        cut.SetParametersAndRender(p => p.Add(x => x.Expanded, true));
        JSInterop.VerifyInvoke("set", 1);
        Assert.Equal(true, JSInterop.Invocations["set"][0].Arguments[0]);
        cut.SetParametersAndRender(p => p.Add(x => x.Expanded, true));
        JSInterop.VerifyInvoke("set", 1);
    }
}
