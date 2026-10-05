using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class MultiSelectWithExtrasTests : TestContext
{
    private IRenderedComponent<MultiSelectWithExtras> Render(Action<ComponentParameterCollectionBuilder<MultiSelectWithExtras>>? extra = null)
        => RenderComponent<MultiSelectWithExtras>(p =>
        {
            p.Add(x => x.Label, "Toppings").AddChildContent("<option value=\"a\">A</option><option value=\"b\">B</option>");
            extra?.Invoke(p);
        });

    [Fact]
    public void Wrapper_div_carries_base_class_and_select_is_multiple()
    {
        var cut = Render();
        Assert.Equal("DIV", cut.Find(".multi-select-with-extras").TagName);
        Assert.True(cut.Find("select").HasAttribute("multiple"));
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
        => Assert.Contains("extra", Render(p => p.Add(x => x.CssClass, "extra")).Find(".multi-select-with-extras").GetAttribute("class"));

    [Fact]
    public void Aria_label_is_on_the_select_not_the_wrapper()
    {
        var cut = Render();
        Assert.Equal("Toppings", cut.Find("select").GetAttribute("aria-label"));
        Assert.Null(cut.Find(".multi-select-with-extras").GetAttribute("aria-label"));
    }

    [Fact]
    public void Renders_before_and_after_around_the_select_in_order()
    {
        var cut = Render(p => p
            .Add(x => x.Before, (RenderFragment)(b => b.AddMarkupContent(0, "<span id=\"pre\">pre</span>")))
            .Add(x => x.After, (RenderFragment)(b => b.AddMarkupContent(0, "<span id=\"post\">post</span>"))));
        var html = cut.Find(".multi-select-with-extras").InnerHtml;
        Assert.True(html.IndexOf("id=\"pre\"") < html.IndexOf("<select"));
        Assert.True(html.IndexOf("<select") < html.IndexOf("id=\"post\""));
    }

    [Fact]
    public void Change_event_updates_value_and_raises_ValueChanged()
    {
        string[]? seen = null;
        var cut = Render(p => p.Add(x => x.ValueChanged, EventCallback.Factory.Create<string[]>(this, v => seen = v)));
        cut.Find("select").Change(new ChangeEventArgs { Value = new[] { "a", "b" } });
        Assert.Equal(new[] { "a", "b" }, seen);
        Assert.Equal(new[] { "a", "b" }, cut.Instance.Value);
    }

    [Fact]
    public void Size_required_and_disabled_reach_the_select()
    {
        var select = Render(p => p.Add(x => x.Size, 5).Add(x => x.Required, true).Add(x => x.Disabled, true)).Find("select");
        Assert.Equal("5", select.GetAttribute("size"));
        Assert.True(select.HasAttribute("required"));
        Assert.True(select.HasAttribute("disabled"));
    }

    [Fact]
    public void AdditionalAttributes_land_on_the_wrapper()
    {
        var cut = Render(p => p.AddUnmatched("data-test", "value"));
        Assert.Equal("value", cut.Find(".multi-select-with-extras").GetAttribute("data-test"));
        Assert.Null(cut.Find("select").GetAttribute("data-test"));
    }
}
