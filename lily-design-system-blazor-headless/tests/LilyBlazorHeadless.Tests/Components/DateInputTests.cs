using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class DateInputTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<DateInput>(p => { });
        var root = cut.Find(".date-input");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<DateInput>(p => p
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".date-input");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<DateInput>(p => p
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".date-input");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }
}
