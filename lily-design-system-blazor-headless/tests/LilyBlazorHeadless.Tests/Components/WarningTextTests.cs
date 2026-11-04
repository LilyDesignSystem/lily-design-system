using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class WarningTextTests : TestContext
{
    private const string Text = "<span class=\"screen-reader-span\">Warning</span> You can be fined if you do not register.";

    private IRenderedComponent<WarningText> Render(Action<Bunit.ComponentParameterCollectionBuilder<WarningText>>? extra = null) =>
        RenderComponent<WarningText>(p => { p.AddChildContent(Text); extra?.Invoke(p); });

    [Fact] public void Renders_div_with_base_class() => Assert.NotNull(Render().Find("div.warning-text"));

    [Fact] public void Consumer_class_follows_base_class() =>
        Assert.Equal("warning-text mine", Render(p => p.Add(x => x.CssClass, "mine")).Find(".warning-text").GetAttribute("class"));

    [Fact] public void Renders_children_with_hidden_prefix_inside_strong()
    {
        var strong = Render().Find(".warning-text > strong.warning-text-text");
        Assert.Equal("Warning", strong.QuerySelector(".screen-reader-span")!.TextContent);
        Assert.Contains("You can be fined", strong.TextContent);
    }

    [Fact] public void Renders_supplied_icon_first_inside_aria_hidden_wrapper()
    {
        var cut = Render(p => p.Add(x => x.Icon, "!"));
        var wrap = cut.Find(".warning-text > .warning-text-icon");
        Assert.Equal("true", wrap.GetAttribute("aria-hidden"));
        Assert.Equal("!", wrap.TextContent);
        Assert.Equal("warning-text-icon", cut.Find(".warning-text").FirstElementChild!.ClassName);
    }

    [Fact] public void Renders_no_icon_wrapper_without_icon() => Assert.Empty(Render().FindAll(".warning-text-icon"));

    [Fact] public void Adds_no_role_and_no_text_of_its_own()
    {
        var root = RenderComponent<WarningText>().Find(".warning-text");
        Assert.Null(root.GetAttribute("role"));
        Assert.Equal("", root.TextContent);
    }

    [Fact] public void Spreads_rest_props() => Assert.Equal("x1", Render(p => p.AddUnmatched("id", "x1")).Find(".warning-text").Id);
}
