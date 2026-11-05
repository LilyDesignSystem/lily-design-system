using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class SelectWithExtrasTests : TestContext
{
    public SelectWithExtrasTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<SelectWithExtras> Make(Action<ComponentParameterCollectionBuilder<SelectWithExtras>>? more = null) =>
        RenderComponent<SelectWithExtras>(p =>
        {
            p.Add(x => x.Label, "Pick");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.select-with-extras"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.select-with-extras").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.select-with-extras").GetAttribute("data-test"));

    [Fact]
    public void The_extras_sit_around_the_select()
    {
        var cut = Make(p => p
            .Add(x => x.Before, "<i>Before</i>")
            .Add(x => x.After, "<b>After</b>")
            .AddChildContent("<option value=\"a\">A</option>"));
        Assert.Equal(new[] { "I", "SELECT", "B" }, cut.Find("div").Children.Select(c => c.TagName));
        Assert.Single(cut.FindAll("select option"));
        Assert.Equal("Pick", cut.Find("select").GetAttribute("aria-label"));
    }

    [Fact]
    public void Binds_a_value()
    {
        string? seen = null;
        var cut = Make(p => p.Add(x => x.ValueChanged, (string v) => seen = v));
        cut.Find("select").Change("b");
        Assert.Equal("b", seen);
    }
}
