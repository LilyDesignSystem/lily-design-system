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

    [Fact]
    public void Typing_reports_the_text()
    {
        string? reported = null;
        var cut = RenderComponent<MentionsInput>(p => p
            .Add(x => x.Label, "Message")
            .Add(x => x.ValueChanged, v => reported = v));
        cut.Find("input").Input("hi @an");
        Assert.Equal("hi @an", reported);
        Assert.Equal("hi @an", cut.Instance.Value);
    }

    [Fact]
    public async Task The_keys_opening_and_choosing_report_through_their_callbacks()
    {
        bool? expanded = null;
        string? chosen = null;
        var cut = RenderComponent<MentionsInput>(p => p
            .Add(x => x.Label, "Message")
            .Add(x => x.ExpandedChanged, v => expanded = v)
            .Add(x => x.OnSelect, v => chosen = v));
        // The module calls these through the [JSInvokable] entry points on KeyedComponentBase.
        await cut.InvokeAsync(() => cut.Instance.OnKeyedOpen(true));
        Assert.True(expanded);
        Assert.Equal("true", cut.Find("input").GetAttribute("aria-expanded"));
        await cut.InvokeAsync(() => cut.Instance.OnKeyedSelect("ann", ["ann"], ["ann"]));
        Assert.Equal("ann", chosen);
        await cut.InvokeAsync(() => cut.Instance.OnKeyedOpen(false));
        Assert.False(expanded);
        Assert.Equal("false", cut.Find("input").GetAttribute("aria-expanded"));
    }
}
