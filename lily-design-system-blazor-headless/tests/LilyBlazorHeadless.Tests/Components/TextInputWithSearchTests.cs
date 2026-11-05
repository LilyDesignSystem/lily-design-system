using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TextInputWithSearchTests : TestContext
{
    public TextInputWithSearchTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<TextInputWithSearch> Make(Action<ComponentParameterCollectionBuilder<TextInputWithSearch>>? more = null) =>
        RenderComponent<TextInputWithSearch>(p =>
        {
            p.Add(x => x.Label, "Site").Add(x => x.InputLabel, "Terms").Add(x => x.SearchLabel, "Search");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.text-input-with-search"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.text-input-with-search").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.text-input-with-search").GetAttribute("data-test"));

    [Fact]
    public void Is_a_named_search_landmark()
    {
        var cut = Make();
        Assert.Equal("search", cut.Find("div").GetAttribute("role"));
        Assert.Equal("Site", cut.Find("div").GetAttribute("aria-label"));
        Assert.Equal("Terms", cut.Find("input").GetAttribute("aria-label"));
        Assert.Equal("Search", cut.Find("button").TextContent);
    }

    [Fact]
    public async Task The_button_and_Enter_search()
    {
        var seen = new List<string>();
        var cut = Make(p => p.Add(x => x.OnSearch, (string v) => seen.Add(v)));
        cut.Find("input").Input("lily");
        cut.Find("button").Click();
        await cut.InvokeAsync(() => cut.Instance.OnEnter("lily2"));
        Assert.Equal(new[] { "lily", "lily2" }, seen);
        Assert.Equal("lily2", cut.Instance.Value);
    }

    [Fact]
    public void Disabled_reaches_both_controls()
    {
        var cut = Make(p => p.Add(x => x.Disabled, true));
        Assert.True(cut.Find("input").HasAttribute("disabled"));
        Assert.True(cut.Find("button").HasAttribute("disabled"));
    }
}
