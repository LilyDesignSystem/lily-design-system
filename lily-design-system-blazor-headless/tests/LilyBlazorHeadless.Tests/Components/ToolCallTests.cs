using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ToolCallTests : TestContext
{
    private IRenderedComponent<ToolCall> Render(Action<Bunit.ComponentParameterCollectionBuilder<ToolCall>>? extra = null) =>
        RenderComponent<ToolCall>(p =>
        {
            p.Add(x => x.Summary, (RenderFragment)(b => b.AddMarkupContent(0, "<span data-testid=\"sum\">search_web</span>")));
            p.AddChildContent("<span data-testid=\"body\">Body</span>");
            extra?.Invoke(p);
        });

    [Fact] public void Renders_details_with_base_class_closed_by_default()
    {
        var el = Render().Find("details.tool-call");
        Assert.False(el.HasAttribute("open"));
    }
    [Fact] public void Summary_goes_in_the_summary_element() => Assert.NotNull(Render().Find("summary.tool-call-summary [data-testid=sum]"));
    [Fact] public void Body_goes_in_the_content_div() => Assert.NotNull(Render().Find("div.tool-call-content [data-testid=body]"));
    [Fact] public void Reflects_open() => Assert.True(Render(p => p.Add(x => x.Open, true)).Find("details").HasAttribute("open"));
    [Fact] public void Status_sets_data_status_and_is_absent_without_one()
    {
        Assert.Equal("done", Render(p => p.Add(x => x.Status, "done")).Find("details").GetAttribute("data-status"));
        Assert.Null(Render().Find("details").GetAttribute("data-status"));
    }
    [Fact] public void Busy_only_while_running()
    {
        Assert.Equal("true", Render(p => p.Add(x => x.Status, "running")).Find("details").GetAttribute("aria-busy"));
        foreach (var s in new[] { "pending", "done", "error" })
            Assert.Null(Render(p => p.Add(x => x.Status, s)).Find("details").GetAttribute("aria-busy"));
    }
    [Fact] public void Clicking_the_summary_raises_OpenChanged()
    {
        bool? seen = null;
        var c = Render(p => p.Add(x => x.OpenChanged, EventCallback.Factory.Create<bool>(this, v => seen = v)));
        c.Find("summary").Click();
        Assert.True(seen);
    }
    [Fact] public void Consumer_class_follows_base_class() =>
        Assert.Equal("tool-call mine", Render(p => p.Add(x => x.CssClass, "mine")).Find("details").GetAttribute("class"));
    [Fact] public void Spreads_rest_props() => Assert.Equal("t1", Render(p => p.AddUnmatched("id", "t1")).Find("details").Id);
}
