using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class HoverCardTests : TestContext
{
    public HoverCardTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<HoverCard> Make(Action<ComponentParameterCollectionBuilder<HoverCard>>? more = null) =>
        RenderComponent<HoverCard>(p =>
        {
            p.Add(x => x.Label, "Card");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.hover-card"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.hover-card").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.hover-card").GetAttribute("data-test"));

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
        cut.SetParametersAndRender(p => p.Add(x => x.Open, true));
        Assert.Contains(JSInterop.Invocations.Skip(before), i => i.Identifier == "set" && (bool)i.Arguments[0]!);
    }

    [Fact]
    public void Label_names_it_and_content_renders()
    {
        var root = Make(p => p.AddChildContent("body")).Find("div");
        Assert.Equal("Card", root.GetAttribute("aria-label"));
        Assert.Equal("body", root.TextContent);
    }
}
