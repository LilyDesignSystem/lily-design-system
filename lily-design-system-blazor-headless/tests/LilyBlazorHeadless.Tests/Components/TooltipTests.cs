using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TooltipTests : TestContext
{
    public TooltipTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<Tooltip> Make(Action<ComponentParameterCollectionBuilder<Tooltip>>? more = null) =>
        RenderComponent<Tooltip>(p =>
        {
            p.Add(x => x.Label, "Help");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.tooltip"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.tooltip").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.tooltip").GetAttribute("data-test"));

    [Fact]
    public void Is_a_manual_popover()
    {
        var root = Make().Find("div");
        Assert.Equal("tooltip", root.GetAttribute("role"));
        Assert.Equal("manual", root.GetAttribute("popover"));
    }

    [Fact]
    public void The_state_is_sent_to_the_module_when_it_changes()
    {
        var cut = Make();
        var before = JSInterop.Invocations.Count;
        cut.SetParametersAndRender(p => p.Add(x => x.Visible, true));
        Assert.Contains(JSInterop.Invocations.Skip(before), i => i.Identifier == "set" && (bool)i.Arguments[0]!);
    }

    [Fact]
    public void Label_is_the_text_and_Id_links_it()
    {
        var root = Make(p => p.Add(x => x.Id, "tip")).Find("div");
        Assert.Equal("Help", root.TextContent);
        Assert.Equal("tip", root.Id);
        Assert.False(root.HasAttribute("aria-label"));
    }
}
