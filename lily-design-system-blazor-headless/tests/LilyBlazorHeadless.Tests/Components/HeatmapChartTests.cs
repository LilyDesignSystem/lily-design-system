using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class HeatmapChartTests : TestContext
{
    private const string Svg = "<svg data-testid=\"art\" viewBox=\"0 0 10 10\"><circle r=\"4\" /></svg>";
    private const string Table = "<table><caption>Values</caption><tbody><tr><th scope=\"row\">A</th><td>1</td></tr></tbody></table>";

    private IRenderedComponent<HeatmapChart> Render(Action<Bunit.ComponentParameterCollectionBuilder<HeatmapChart>>? extra = null) =>
        RenderComponent<HeatmapChart>(p => { p.Add(x => x.Label, "Quarterly figures").AddChildContent(Svg); extra?.Invoke(p); });

    [Fact] public void Renders_figure_with_base_class() => Assert.NotNull(Render().Find("figure.heatmap-chart"));
    [Fact] public void Exposes_graphic_as_single_named_image()
    {
        var g = Render().Find("[role=img]");
        Assert.Equal("DIV", g.TagName);
        Assert.Equal("heatmap-chart-graphic", g.GetAttribute("class"));
        Assert.Equal("Quarterly figures", g.GetAttribute("aria-label"));
    }
    [Fact] public void Figure_has_no_role() => Assert.Null(Render().Find("figure").GetAttribute("role"));
    [Fact] public void Consumer_class_follows_base_class() =>
        Assert.Equal("heatmap-chart mine", Render(p => p.Add(x => x.CssClass, "mine")).Find("figure").GetAttribute("class"));
    [Fact] public void Renders_svg_inside_the_image_wrapper() => Assert.NotNull(Render().Find("[role=img] svg[data-testid=art]"));
    [Fact] public void No_data_table_wrapper_without_fragment() => Assert.Empty(Render().FindAll(".heatmap-chart-data-table"));
    [Fact] public void Renders_data_table_as_sibling_after_the_graphic()
    {
        var c = Render(p => p.Add(x => x.DataTable, (Microsoft.AspNetCore.Components.RenderFragment)(b => b.AddMarkupContent(0, Table))));
        var wrap = c.Find(".heatmap-chart-data-table");
        Assert.Equal("heatmap-chart-graphic", wrap.PreviousElementSibling!.GetAttribute("class"));
        Assert.Equal("FIGURE", wrap.ParentElement!.TagName);
    }
    [Fact] public void Table_is_outside_the_role_img_element()
    {
        var c = Render(p => p.Add(x => x.DataTable, (Microsoft.AspNetCore.Components.RenderFragment)(b => b.AddMarkupContent(0, Table))));
        Assert.Empty(c.FindAll("[role=img] table"));
        Assert.NotNull(c.Find("table"));
    }
    [Fact] public void Spreads_rest_props_on_figure()
    {
        var el = Render(p => p.AddUnmatched("id", "c1").AddUnmatched("data-test", "chart")).Find("figure");
        Assert.Equal("c1", el.Id);
        Assert.Equal("chart", el.GetAttribute("data-test"));
    }
}
