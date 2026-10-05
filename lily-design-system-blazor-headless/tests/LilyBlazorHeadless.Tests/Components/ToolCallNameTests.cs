using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ToolCallNameTests : TestContext
{
    private IRenderedComponent<ToolCallName> Render(Action<Bunit.ComponentParameterCollectionBuilder<ToolCallName>>? extra = null) =>
        RenderComponent<ToolCallName>(p => { p.AddChildContent("<span data-testid=\"txt\">Hello</span>"); extra?.Invoke(p); });

    [Fact] public void Renders_span_with_base_class() => Assert.NotNull(Render().Find("span.tool-call-name"));

    [Fact] public void Consumer_class_follows_base_class() =>
        Assert.Equal("tool-call-name mine", Render(p => p.Add(x => x.CssClass, "mine")).Find(".tool-call-name").GetAttribute("class"));
    [Fact] public void Renders_children() => Assert.Equal("Hello", Render().Find("[data-testid=txt]").TextContent);
    [Fact] public void Spreads_rest_props() => Assert.Equal("x1", Render(p => p.AddUnmatched("id", "x1")).Find(".tool-call-name").Id);
}
