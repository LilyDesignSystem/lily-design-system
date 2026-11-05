using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class HintTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Hint>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".hint");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Hint>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".hint");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Hint>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".hint");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Takes_the_id_that_aria_describedby_points_at()
    {
        var cut = Render(builder =>
        {
            builder.OpenElement(0, "input");
            builder.AddAttribute(1, "aria-describedby", "name-hint");
            builder.CloseElement();
            builder.OpenComponent<Hint>(2);
            builder.AddAttribute(3, "id", "name-hint");
            builder.CloseComponent();
        });
        Assert.Equal(cut.Find(".hint").GetAttribute("id"), cut.Find("input").GetAttribute("aria-describedby"));
    }
}
