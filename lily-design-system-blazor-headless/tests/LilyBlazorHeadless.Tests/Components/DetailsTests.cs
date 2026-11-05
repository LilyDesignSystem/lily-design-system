using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class DetailsTests : TestContext
{
    public DetailsTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<Details> Make(Action<ComponentParameterCollectionBuilder<Details>>? more = null) =>
        RenderComponent<Details>(p =>
        {
            p
            .Add(x => x.Summary, "More");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("details.details"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("details.details").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("details.details").GetAttribute("data-test"));

    [Fact]
    public void The_summary_is_the_toggle()
    {
        var cut = Make(p => p.AddChildContent("<p>body</p>"));
        Assert.Equal("More", cut.Find("details > summary").TextContent);
        Assert.NotNull(cut.Find("details > p"));
    }

    [Fact]
    public void Open_renders_the_attribute()
    {
        Assert.False(Make().Find("details").HasAttribute("open"));
        Assert.True(Make(p => p.Add(x => x.Open, true)).Find("details").HasAttribute("open"));
    }

    [Fact]
    public async Task A_toggle_in_the_browser_reports_once()
    {
        var seen = new List<bool>();
        var cut = Make(p => p.Add(x => x.OpenChanged, (bool v) => seen.Add(v)));
        await cut.InvokeAsync(() => cut.Instance.OnDetailsToggle(true));
        await cut.InvokeAsync(() => cut.Instance.OnDetailsToggle(true));
        Assert.Equal(new[] { true }, seen);
        Assert.True(cut.Find("details").HasAttribute("open"));
    }

    [Fact]
    public void A_change_from_CSharp_is_not_reported_back()
    {
        var calls = 0;
        var cut = Make(p => p.Add(x => x.OpenChanged, (bool _) => calls++));
        cut.SetParametersAndRender(p => p.Add(x => x.Open, true));
        cut.InvokeAsync(() => cut.Instance.OnDetailsToggle(true));
        Assert.Equal(0, calls);
    }
}
