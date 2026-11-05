using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class AccordionListItemTests : TestContext
{
    public AccordionListItemTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<AccordionListItem> Make(Action<ComponentParameterCollectionBuilder<AccordionListItem>>? more = null) =>
        RenderComponent<AccordionListItem>(p =>
        {
            p.AddUnmatched("data-item", "1");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("li.accordion-list-item"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("li.accordion-list-item").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("li.accordion-list-item").GetAttribute("data-test"));

    [Fact]
    public void The_li_holds_a_native_details()
    {
        var cut = Make(p => p.Add(x => x.Summary, "Head").AddChildContent("<p>body</p>"));
        Assert.Equal("Head", cut.Find("li > details > summary").TextContent);
        Assert.NotNull(cut.Find("li > details > p"));
    }

    [Fact]
    public void Without_Summary_the_content_brings_its_own()
    {
        var cut = Make(p => p.AddChildContent("<summary>Own</summary>"));
        Assert.Single(cut.FindAll("summary"));
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
