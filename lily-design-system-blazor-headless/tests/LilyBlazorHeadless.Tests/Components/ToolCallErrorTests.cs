using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ToolCallErrorTests : TestContext
{
    private IRenderedComponent<ToolCallError> Render(Action<Bunit.ComponentParameterCollectionBuilder<ToolCallError>>? extra = null) =>
        RenderComponent<ToolCallError>(p => { p.AddChildContent("<span data-testid=\"txt\">Hello</span>"); extra?.Invoke(p); });

    [Fact] public void Renders_div_with_base_class() => Assert.NotNull(Render().Find("div.tool-call-error"));

    [Fact] public void Is_an_alert_region() => Assert.Equal("alert", Render().Find(".tool-call-error").GetAttribute("role"));

    [Fact] public void Consumer_class_follows_base_class() =>
        Assert.Equal("tool-call-error mine", Render(p => p.Add(x => x.CssClass, "mine")).Find(".tool-call-error").GetAttribute("class"));
    [Fact] public void Renders_children() => Assert.Equal("Hello", Render().Find("[data-testid=txt]").TextContent);
    [Fact] public void Spreads_rest_props() => Assert.Equal("x1", Render(p => p.AddUnmatched("id", "x1")).Find(".tool-call-error").Id);
}
