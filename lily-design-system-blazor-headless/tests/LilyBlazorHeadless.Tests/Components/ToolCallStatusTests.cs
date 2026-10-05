using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ToolCallStatusTests : TestContext
{
    private IRenderedComponent<ToolCallStatus> Render(Action<Bunit.ComponentParameterCollectionBuilder<ToolCallStatus>>? extra = null) =>
        RenderComponent<ToolCallStatus>(p => { p.AddChildContent("<span data-testid=\"txt\">Hello</span>"); extra?.Invoke(p); });

    [Fact] public void Renders_span_with_base_class() => Assert.NotNull(Render().Find("span.tool-call-status"));

    [Fact] public void Status_sets_data_status_and_is_absent_without_one()
    {
        Assert.Equal("running", Render(p => p.Add(x => x.Status, "running")).Find(".tool-call-status").GetAttribute("data-status"));
        Assert.Null(Render().Find(".tool-call-status").GetAttribute("data-status"));
    }

    [Fact] public void Consumer_class_follows_base_class() =>
        Assert.Equal("tool-call-status mine", Render(p => p.Add(x => x.CssClass, "mine")).Find(".tool-call-status").GetAttribute("class"));
    [Fact] public void Renders_children() => Assert.Equal("Hello", Render().Find("[data-testid=txt]").TextContent);
    [Fact] public void Spreads_rest_props() => Assert.Equal("x1", Render(p => p.AddUnmatched("id", "x1")).Find(".tool-call-status").Id);
}
