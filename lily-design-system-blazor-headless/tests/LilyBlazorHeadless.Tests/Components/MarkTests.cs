using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class MarkTests : TestContext
{
    private IRenderedComponent<Mark> Render(Action<Bunit.ComponentParameterCollectionBuilder<Mark>>? extra = null) =>
        RenderComponent<Mark>(p => { p.AddChildContent("<span data-testid=\"txt\">Hello</span>"); extra?.Invoke(p); });

    [Fact] public void Renders_mark_with_base_class() => Assert.NotNull(Render().Find("mark.mark"));

    [Fact] public void Consumer_class_follows_base_class() =>
        Assert.Equal("mark mine", Render(p => p.Add(x => x.CssClass, "mine")).Find(".mark").GetAttribute("class"));
    [Fact] public void Renders_children() => Assert.Equal("Hello", Render().Find("[data-testid=txt]").TextContent);
    [Fact] public void Spreads_rest_props() => Assert.Equal("x1", Render(p => p.AddUnmatched("id", "x1")).Find(".mark").Id);
}
