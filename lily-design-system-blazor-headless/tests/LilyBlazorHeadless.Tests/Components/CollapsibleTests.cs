using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class CollapsibleTests : TestContext
{
    public CollapsibleTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<Collapsible> Make(Action<ComponentParameterCollectionBuilder<Collapsible>>? more = null) =>
        RenderComponent<Collapsible>(p =>
        {
            p.Add(x => x.Summary, "More");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("details.collapsible"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("details.collapsible").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("details.collapsible").GetAttribute("data-test"));

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
}
