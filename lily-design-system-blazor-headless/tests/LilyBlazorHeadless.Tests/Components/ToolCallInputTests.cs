using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ToolCallInputTests : TestContext
{
    private IRenderedComponent<ToolCallInput> Render(Action<Bunit.ComponentParameterCollectionBuilder<ToolCallInput>>? extra = null) =>
        RenderComponent<ToolCallInput>(p => { p.AddChildContent("<span data-testid=\"txt\">Hello</span>"); extra?.Invoke(p); });

    [Fact] public void Renders_div_with_base_class() => Assert.NotNull(Render().Find("div.tool-call-input"));

    [Fact] public void Label_makes_a_named_group_and_is_absent_without_one()
    {
        var a = Render(p => p.Add(x => x.Label, "Input")).Find(".tool-call-input");
        Assert.Equal("group", a.GetAttribute("role"));
        Assert.Equal("Input", a.GetAttribute("aria-label"));
        var b = Render().Find(".tool-call-input");
        Assert.Null(b.GetAttribute("role"));
        Assert.Null(b.GetAttribute("aria-label"));
    }

    [Fact] public void Consumer_class_follows_base_class() =>
        Assert.Equal("tool-call-input mine", Render(p => p.Add(x => x.CssClass, "mine")).Find(".tool-call-input").GetAttribute("class"));
    [Fact] public void Renders_children() => Assert.Equal("Hello", Render().Find("[data-testid=txt]").TextContent);
    [Fact] public void Spreads_rest_props() => Assert.Equal("x1", Render(p => p.AddUnmatched("id", "x1")).Find(".tool-call-input").Id);
}
