using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class HeatmapChartWithYearOfDaysTests : TestContext
{
    private const string Svg = "<svg data-testid=\"art\" viewBox=\"0 0 10 10\"><circle r=\"4\" /></svg>";
    private const string Table = "<table><caption>Values</caption><tbody><tr><th scope=\"row\">A</th><td>1</td></tr></tbody></table>";

    private IRenderedComponent<HeatmapChartWithYearOfDays> Render(Action<Bunit.ComponentParameterCollectionBuilder<HeatmapChartWithYearOfDays>>? extra = null) =>
        RenderComponent<HeatmapChartWithYearOfDays>(p => { p.Add(x => x.Label, "Quarterly figures").Add(x => x.Year, 2026).Add(x => x.WeekStart, 0).AddChildContent(Svg); extra?.Invoke(p); });

    [Fact] public void Renders_figure_with_base_class() => Assert.NotNull(Render().Find("figure.heatmap-chart-with-year-of-days"));
    [Fact] public void Exposes_graphic_as_single_named_image()
    {
        var g = Render().Find("[role=img]");
        Assert.Equal("DIV", g.TagName);
        Assert.Equal("heatmap-chart-with-year-of-days-graphic", g.GetAttribute("class"));
        Assert.Equal("Quarterly figures", g.GetAttribute("aria-label"));
    }
    [Fact] public void Figure_has_no_role() => Assert.Null(Render().Find("figure").GetAttribute("role"));
    [Fact] public void Consumer_class_follows_base_class() =>
        Assert.Equal("heatmap-chart-with-year-of-days mine", Render(p => p.Add(x => x.CssClass, "mine")).Find("figure").GetAttribute("class"));
    [Fact] public void Renders_svg_inside_the_image_wrapper() => Assert.NotNull(Render().Find("[role=img] svg[data-testid=art]"));
    [Fact] public void No_data_table_wrapper_without_fragment() => Assert.Empty(Render().FindAll(".heatmap-chart-with-year-of-days-data-table"));
    [Fact] public void Renders_data_table_as_sibling_after_the_graphic()
    {
        var c = Render(p => p.Add(x => x.DataTable, (Microsoft.AspNetCore.Components.RenderFragment)(b => b.AddMarkupContent(0, Table))));
        var wrap = c.Find(".heatmap-chart-with-year-of-days-data-table");
        Assert.Equal("heatmap-chart-with-year-of-days-graphic", wrap.PreviousElementSibling!.GetAttribute("class"));
        Assert.Equal("FIGURE", wrap.ParentElement!.TagName);
    }
    [Fact] public void Table_is_outside_the_role_img_element()
    {
        var c = Render(p => p.Add(x => x.DataTable, (Microsoft.AspNetCore.Components.RenderFragment)(b => b.AddMarkupContent(0, Table))));
        Assert.Empty(c.FindAll("[role=img] table"));
        Assert.NotNull(c.Find("table"));
    }
    [Fact] public void Reflects_year_and_week_start_as_data_attributes()
    {
        var el = Render().Find("figure");
        Assert.Equal("2026", el.GetAttribute("data-year"));
        Assert.Equal("0", el.GetAttribute("data-week-start"));
        var other = RenderComponent<HeatmapChartWithYearOfDays>(p => p.Add(x => x.Label, "L").Add(x => x.Year, 2025).Add(x => x.WeekStart, 1)).Find("figure");
        Assert.Equal("2025", other.GetAttribute("data-year"));
        Assert.Equal("1", other.GetAttribute("data-week-start"));
    }
    [Fact] public void Spreads_rest_props_on_figure()
    {
        var el = Render(p => p.AddUnmatched("id", "c1").AddUnmatched("data-test", "chart")).Find("figure");
        Assert.Equal("c1", el.Id);
        Assert.Equal("chart", el.GetAttribute("data-test"));
    }
}
