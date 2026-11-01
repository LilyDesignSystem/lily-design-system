using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class CurrencyInputTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<CurrencyInput>(p => p.Add(x => x.CurrencyCode, "EUR"));
        var root = cut.Find(".currency-input");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<CurrencyInput>(p => p
            .Add(x => x.CurrencyCode, "EUR")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".currency-input");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<CurrencyInput>(p => p
            .Add(x => x.CurrencyCode, "EUR")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".currency-input");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void CurrencyCode_is_rendered_as_data_attribute()
    {
        var cut = RenderComponent<CurrencyInput>(p => p
            .Add(x => x.CurrencyCode, "JPY"));
        Assert.Equal("JPY", cut.Find(".currency-input").GetAttribute("data-currency-code"));
    }

    [Fact]
    public void CurrencyCode_is_never_defaulted()
    {
        var cut = RenderComponent<CurrencyInput>(p => { });
        var root = cut.Find(".currency-input");
        Assert.Null(root.GetAttribute("data-currency-code"));
        Assert.DoesNotContain("USD", cut.Markup);
    }
}
