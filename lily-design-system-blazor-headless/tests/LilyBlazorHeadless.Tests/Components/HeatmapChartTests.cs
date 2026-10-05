using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class HeatmapChartTests : TestContext
{
    private IRenderedComponent<HeatmapChart> Render(Action<Bunit.ComponentParameterCollectionBuilder<HeatmapChart>>? extra = null) =>
        RenderComponent<HeatmapChart>(p => { p.Add(x => x.Label, "Quarterly figures").AddChildContent("<svg data-testid=\"art\" viewBox=\"0 0 10 10\"><circle r=\"4\" /></svg>"); extra?.Invoke(p); });

    [Fact] public void Renders_figure_with_base_class() => Assert.NotNull(Render().Find("figure.heatmap-chart"));
    [Fact] public void Exposes_single_image() => Assert.Equal("FIGURE", Render().Find("[role=img]").TagName);
    [Fact] public void Aria_label_from_label() => Assert.Equal("Quarterly figures", Render().Find("[role=img]").GetAttribute("aria-label"));
    [Fact] public void Consumer_class_follows_base_class() =>
        Assert.Equal("heatmap-chart mine", Render(p => p.Add(x => x.CssClass, "mine")).Find("[role=img]").GetAttribute("class"));
    [Fact] public void Renders_svg_as_children() => Assert.NotNull(Render().Find("figure svg[data-testid=art]"));
    [Fact] public void Passes_aria_describedby() =>
        Assert.Equal("desc", Render(p => p.AddUnmatched("aria-describedby", "desc")).Find("[role=img]").GetAttribute("aria-describedby"));
    [Fact] public void Spreads_rest_props_on_figure()
    {
        var el = Render(p => p.AddUnmatched("id", "c1").AddUnmatched("data-test", "chart")).Find("figure");
        Assert.Equal("c1", el.Id);
        Assert.Equal("chart", el.GetAttribute("data-test"));
    }
}
