using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class StreamingTextTests : TestContext
{
    private IRenderedComponent<StreamingText> Render(Action<Bunit.ComponentParameterCollectionBuilder<StreamingText>>? extra = null) =>
        RenderComponent<StreamingText>(p => { p.AddChildContent("<span data-testid=\"txt\">Hello</span>"); extra?.Invoke(p); });

    [Fact] public void Renders_div_with_base_class() => Assert.NotNull(Render().Find("div.streaming-text"));
    [Fact] public void Is_a_polite_atomic_status_region()
    {
        var el = Render().Find("[role=status]");
        Assert.Equal("polite", el.GetAttribute("aria-live"));
        Assert.Equal("true", el.GetAttribute("aria-atomic"));
    }
    [Fact] public void Not_busy_by_default()
    {
        var el = Render().Find("[role=status]");
        Assert.Null(el.GetAttribute("aria-busy"));
        Assert.Null(el.GetAttribute("data-streaming"));
    }
    [Fact] public void Busy_while_streaming()
    {
        var el = Render(p => p.Add(x => x.Streaming, true)).Find("[role=status]");
        Assert.Equal("true", el.GetAttribute("aria-busy"));
        Assert.Equal("true", el.GetAttribute("data-streaming"));
    }
    [Fact] public void Clears_busy_when_streaming_becomes_false()
    {
        var c = Render(p => p.Add(x => x.Streaming, true));
        c.SetParametersAndRender(p => p.Add(x => x.Streaming, false));
        var el = c.Find("[role=status]");
        Assert.Null(el.GetAttribute("aria-busy"));
        Assert.Null(el.GetAttribute("data-streaming"));
    }
    [Fact] public void Label_sets_aria_label_and_is_omitted_without_one()
    {
        Assert.Equal("Answer", Render(p => p.Add(x => x.Label, "Answer")).Find("[role=status]").GetAttribute("aria-label"));
        Assert.Null(Render().Find("[role=status]").GetAttribute("aria-label"));
    }
    [Fact] public void Consumer_class_follows_base_class() =>
        Assert.Equal("streaming-text mine", Render(p => p.Add(x => x.CssClass, "mine")).Find("[role=status]").GetAttribute("class"));
    [Fact] public void Renders_children() => Assert.Equal("Hello", Render().Find("[data-testid=txt]").TextContent);
    [Fact] public void Spreads_rest_props()
    {
        var el = Render(p => p.AddUnmatched("id", "s1").AddUnmatched("data-test", "x")).Find("[role=status]");
        Assert.Equal("s1", el.Id);
        Assert.Equal("x", el.GetAttribute("data-test"));
    }
}
