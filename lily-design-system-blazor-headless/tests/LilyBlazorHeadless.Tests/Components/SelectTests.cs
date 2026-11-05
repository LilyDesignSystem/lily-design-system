using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class SelectTests : TestContext
{
    private IRenderedComponent<Select> Make(Action<ComponentParameterCollectionBuilder<Select>>? more = null) =>
        RenderComponent<Select>(p =>
        {
            p
            .Add(x => x.Label, "Pick");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("select.select"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("select.select").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("select.select").GetAttribute("data-test"));

    [Fact]
    public void Value_selects_and_a_change_reports()
    {
        string? seen = null;
        var cut = Make(p => p
            .AddChildContent("<option value=\"a\">A</option><option value=\"b\">B</option>")
            .Add(x => x.Value, "a")
            .Add(x => x.ValueChanged, (string v) => seen = v));
        Assert.Equal("a", cut.Find("select").GetAttribute("value"));
        cut.Find("select").Change("b");
        Assert.Equal("b", seen);
        Assert.Equal("b", cut.Find("select").GetAttribute("value"));
    }

    [Fact]
    public void An_empty_value_leaves_the_choice_to_the_browser() =>
        Assert.False(Make().Find("select").HasAttribute("value"));

    [Fact]
    public void Label_names_it() => Assert.Equal("Pick", Make().Find("select").GetAttribute("aria-label"));

    [Fact]
    public void Required_and_Disabled_reach_the_select()
    {
        var root = Make(p => p.Add(x => x.Required, true).Add(x => x.Disabled, true)).Find("select");
        Assert.True(root.HasAttribute("required"));
        Assert.True(root.HasAttribute("disabled"));
    }
}
