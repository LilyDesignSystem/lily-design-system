using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class CalendarYearTableTests : TestContext
{
    private IRenderedComponent<CalendarYearTable> Render(Action<Bunit.ComponentParameterCollectionBuilder<CalendarYearTable>>? extra = null) =>
        RenderComponent<CalendarYearTable>(p => { p.Add(x => x.Label, "2025").AddChildContent("<tbody><tr><td>1</td></tr></tbody>"); extra?.Invoke(p); });

    [Fact] public void Renders_a_grid() => Assert.NotNull(Render().Find("[role=grid]"));
    [Fact] public void Renders_as_table_element() => Assert.Equal("TABLE", Render().Find("[role=grid]").TagName);
    [Fact] public void Has_kebab_base_class() => Assert.True(Render().Find("[role=grid]").ClassList.Contains("calendar-year-table"));
    [Fact] public void Consumer_class_follows_base_class() =>
        Assert.Equal("calendar-year-table mine", Render(p => p.Add(x => x.CssClass, "mine")).Find("[role=grid]").GetAttribute("class"));
    [Fact] public void Aria_label_from_label() => Assert.Equal("2025", Render().Find("[role=grid]").GetAttribute("aria-label"));
    [Fact] public void Marks_data_view() => Assert.Equal("year", Render().Find("[role=grid]").GetAttribute("data-view"));
    [Fact] public void Renders_caption_when_provided() =>
        Assert.Equal("Visible caption", Render(p => p.Add(x => x.Caption, "Visible caption")).Find("caption").TextContent);
    [Fact] public void No_caption_by_default() => Assert.Empty(Render().FindAll("caption"));
    [Fact] public void Renders_children() => Assert.Equal("1", Render().Find("[role=grid] td").TextContent);
    [Fact] public void Passes_through_attributes() =>
        Assert.Equal("value", Render(p => p.AddUnmatched("data-test", "value")).Find("[role=grid]").GetAttribute("data-test"));
}
