using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class MultiSelectTests : TestContext
{
    private IRenderedComponent<MultiSelect> Render(Action<ComponentParameterCollectionBuilder<MultiSelect>>? extra = null)
        => RenderComponent<MultiSelect>(p =>
        {
            p.Add(x => x.Label, "Toppings").AddChildContent("<option value=\"a\">A</option><option value=\"b\">B</option><option value=\"c\">C</option>");
            extra?.Invoke(p);
        });

    [Fact]
    public void Renders_native_select_multiple_with_base_class()
    {
        var root = Render().Find("select");
        Assert.True(root.HasAttribute("multiple"));
        Assert.StartsWith("multi-select", root.GetAttribute("class"));
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
        => Assert.Equal("multi-select extra", Render(p => p.Add(x => x.CssClass, "extra")).Find("select").GetAttribute("class"));

    [Fact]
    public void Has_aria_label_from_label()
        => Assert.Equal("Toppings", Render().Find("select").GetAttribute("aria-label"));

    [Fact]
    public void Renders_option_children()
        => Assert.Equal(3, Render().FindAll("option").Count);

    [Fact]
    public void Change_event_updates_value_and_raises_ValueChanged()
    {
        string[]? seen = null;
        var cut = Render(p => p.Add(x => x.ValueChanged, EventCallback.Factory.Create<string[]>(this, v => seen = v)));
        cut.Find("select").Change(new ChangeEventArgs { Value = new[] { "a", "c" } });
        Assert.Equal(new[] { "a", "c" }, seen);
        Assert.Equal(new[] { "a", "c" }, cut.Instance.Value);
    }

    [Fact]
    public void Size_sets_the_visible_rows()
        => Assert.Equal("4", Render(p => p.Add(x => x.Size, 4)).Find("select").GetAttribute("size"));

    [Fact]
    public void Size_is_omitted_by_default()
        => Assert.False(Render().Find("select").HasAttribute("size"));

    [Fact]
    public void Supports_required_and_disabled()
    {
        var root = Render(p => p.Add(x => x.Required, true).Add(x => x.Disabled, true)).Find("select");
        Assert.True(root.HasAttribute("required"));
        Assert.True(root.HasAttribute("disabled"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
        => Assert.Equal("value", Render(p => p.AddUnmatched("data-test", "value")).Find("select").GetAttribute("data-test"));
}
