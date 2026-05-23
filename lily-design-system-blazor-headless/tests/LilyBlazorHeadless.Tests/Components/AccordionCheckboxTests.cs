using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class AccordionCheckboxTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<AccordionCheckbox>(p => p
            .Add(x => x.Checked, false)
            .Add(x => x.Id, "x")
            .AddChildContent("body"));
        var root = cut.Find(".accordion-checkbox");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<AccordionCheckbox>(p => p
            .Add(x => x.Checked, false)
            .Add(x => x.Id, "x")
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".accordion-checkbox");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<AccordionCheckbox>(p => p
            .Add(x => x.Checked, false)
            .Add(x => x.Id, "x")
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".accordion-checkbox");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }
}
