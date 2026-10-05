using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ShowMoreTests : TestContext
{
    private IRenderedComponent<ShowMore> Render(Action<ComponentParameterCollectionBuilder<ShowMore>>? extra = null)
        => RenderComponent<ShowMore>(p =>
        {
            p.Add(x => x.MoreLabel, "Show more").Add(x => x.LessLabel, "Show less").AddChildContent("<p>Long text</p>");
            extra?.Invoke(p);
        });

    [Fact]
    public void Root_is_a_div_with_the_show_more_class()
    {
        var root = Render().Find(".show-more");
        Assert.Equal("DIV", root.TagName);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
        => Assert.Equal("show-more extra", Render(p => p.Add(x => x.CssClass, "extra")).Find("div").GetAttribute("class"));

    [Fact]
    public void Collapsed_by_default()
    {
        var cut = Render();
        var button = cut.Find("button");
        Assert.Equal("Show more", button.TextContent.Trim());
        Assert.Equal("false", button.GetAttribute("aria-expanded"));
        Assert.Equal("false", cut.Find(".show-more-content").GetAttribute("data-expanded"));
    }

    [Fact]
    public void Content_stays_in_the_DOM_while_collapsed()
        => Assert.Contains("Long text", Render().Find(".show-more-content").InnerHtml);

    [Fact]
    public void Clicking_expands()
    {
        var cut = Render();
        cut.Find("button").Click();
        var button = cut.Find("button");
        Assert.Equal("Show less", button.TextContent.Trim());
        Assert.Equal("true", button.GetAttribute("aria-expanded"));
        Assert.Equal("true", cut.Find(".show-more-content").GetAttribute("data-expanded"));
    }

    [Fact]
    public void Clicking_again_collapses()
    {
        var cut = Render();
        cut.Find("button").Click();
        cut.Find("button").Click();
        Assert.Equal("Show more", cut.Find("button").TextContent.Trim());
        Assert.Equal("false", cut.Find("button").GetAttribute("aria-expanded"));
    }

    [Fact]
    public void Expanded_parameter_starts_expanded()
        => Assert.Equal("true", Render(p => p.Add(x => x.Expanded, true)).Find("button").GetAttribute("aria-expanded"));

    [Fact]
    public void ExpandedChanged_is_raised_on_toggle()
    {
        bool? seen = null;
        var cut = Render(p => p.Add(x => x.ExpandedChanged, EventCallback.Factory.Create<bool>(this, v => seen = v)));
        cut.Find("button").Click();
        Assert.True(seen);
    }

    [Fact]
    public void Aria_controls_points_at_the_content_element_id()
    {
        var cut = Render();
        var id = cut.Find(".show-more-content").GetAttribute("id");
        Assert.False(string.IsNullOrEmpty(id));
        Assert.Equal(id, cut.Find("button").GetAttribute("aria-controls"));
    }

    [Fact]
    public void Two_instances_have_distinct_content_ids()
    {
        var a = Render().Find(".show-more-content").GetAttribute("id");
        var b = Render().Find(".show-more-content").GetAttribute("id");
        Assert.NotEqual(a, b);
    }

    [Fact]
    public void Content_has_no_inline_style()
        => Assert.Null(Render().Find(".show-more-content").GetAttribute("style"));

    [Fact]
    public void Button_is_type_button_with_the_show_more_button_class()
    {
        var button = Render().Find("button");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Contains("show-more-button", button.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
        => Assert.Equal("value", Render(p => p.AddUnmatched("data-test", "value")).Find(".show-more").GetAttribute("data-test"));
}
