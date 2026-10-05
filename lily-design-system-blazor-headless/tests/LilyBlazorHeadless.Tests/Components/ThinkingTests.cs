using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ThinkingTests : TestContext
{
    private IRenderedComponent<Thinking> Render(Action<ComponentParameterCollectionBuilder<Thinking>>? extra = null)
        => RenderComponent<Thinking>(p =>
        {
            p.Add(x => x.Label, "Thinking").AddChildContent("<p>reasoning</p>");
            extra?.Invoke(p);
        });

    [Fact]
    public void Root_is_native_details_with_the_thinking_class()
    {
        var root = Render().Find(".thinking");
        Assert.Equal("DETAILS", root.TagName);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
        => Assert.Equal("thinking extra", Render(p => p.Add(x => x.CssClass, "extra")).Find("details").GetAttribute("class"));

    [Fact]
    public void Summary_carries_label_and_class()
    {
        var summary = Render().Find("summary");
        Assert.Equal("Thinking", summary.TextContent.Trim());
        Assert.Contains("thinking-summary", summary.GetAttribute("class"));
    }

    [Fact]
    public void Closed_by_default()
        => Assert.False(Render().Find("details").HasAttribute("open"));

    [Fact]
    public void Open_parameter_opens_it()
        => Assert.True(Render(p => p.Add(x => x.Open, true)).Find("details").HasAttribute("open"));

    [Fact]
    public void Children_render_inside_thinking_content()
        => Assert.Contains("reasoning", Render().Find(".thinking-content").InnerHtml);

    [Fact]
    public void Clicking_the_summary_toggles_open_and_raises_OpenChanged()
    {
        bool? seen = null;
        var cut = Render(p => p.Add(x => x.OpenChanged, EventCallback.Factory.Create<bool>(this, v => seen = v)));
        cut.Find("summary").Click();
        Assert.True(cut.Find("details").HasAttribute("open"));
        Assert.True(seen);
        cut.Find("summary").Click();
        Assert.False(cut.Find("details").HasAttribute("open"));
        Assert.False(seen);
    }

    [Fact]
    public void Streaming_sets_data_streaming_and_aria_busy()
    {
        var root = Render(p => p.Add(x => x.Streaming, true)).Find("details");
        Assert.Equal("true", root.GetAttribute("data-streaming"));
        Assert.Equal("true", root.GetAttribute("aria-busy"));
    }

    [Fact]
    public void Not_streaming_omits_data_streaming_and_aria_busy()
    {
        var root = Render().Find("details");
        Assert.Null(root.GetAttribute("data-streaming"));
        Assert.Null(root.GetAttribute("aria-busy"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
        => Assert.Equal("value", Render(p => p.AddUnmatched("data-test", "value")).Find("details").GetAttribute("data-test"));
}
