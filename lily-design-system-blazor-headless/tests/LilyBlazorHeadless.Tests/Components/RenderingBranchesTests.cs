using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// Rendering branches no other test reached: a clear button, a card's links, each heading level, each corner.
public class RenderingBranchesTests : TestContext
{
    public RenderingBranchesTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void ActionBar_shows_its_clear_button_only_with_a_label_and_it_clears()
    {
        var cleared = 0;
        var without = RenderComponent<ActionBar>(p => p.Add(x => x.Label, "Actions"));
        Assert.Empty(without.FindAll(".action-bar-clear"));
        var cut = RenderComponent<ActionBar>(p => p
            .Add(x => x.Label, "Actions")
            .Add(x => x.ClearSelectionLabel, "Clear selection")
            .Add(x => x.OnClearSelection, () => cleared++));
        var clear = cut.Find(".action-bar-clear");
        Assert.Equal("Clear selection", clear.GetAttribute("aria-label"));
        clear.Click();
        Assert.Equal(1, cleared);
    }

    [Fact]
    public void DecisionSupportCard_lists_its_links_and_none_when_there_are_none()
    {
        var cut = RenderComponent<DecisionSupportCard>(p => p
            .Add(x => x.Summary, "Check renal dose")
            .Add(x => x.IndicatorLabel, "Warning")
            .Add(x => x.SourceLabel, "Service")
            .Add(x => x.Links, new[] { new DecisionSupportLink("Guideline", "/g"), new DecisionSupportLink("Calculator", "/c") }));
        var links = cut.FindAll(".decision-support-card-links a");
        Assert.Equal(["Guideline", "Calculator"], links.Select(a => a.TextContent));
        Assert.Equal("/c", links[1].GetAttribute("href"));
        cut.SetParametersAndRender(p => p.Add(x => x.Links, Array.Empty<DecisionSupportLink>()));
        Assert.Empty(cut.FindAll(".decision-support-card-links"));
    }

    [Theory]
    [InlineData(2, "H2")]
    [InlineData(3, "H3")]
    [InlineData(4, "H4")]
    [InlineData(5, "H5")]
    [InlineData(6, "H6")]
    [InlineData(9, "H2")]
    public void InternationalPatientSummarySection_renders_its_heading_level(int level, string tag)
    {
        var cut = RenderComponent<InternationalPatientSummarySection>(p => p
            .Add(x => x.Section, "allergies")
            .Add(x => x.Heading, "Allergies")
            .Add(x => x.HeadingLevel, level));
        var heading = cut.Find(".international-patient-summary-section-heading");
        Assert.Equal(tag, heading.TagName);
        Assert.Equal("Allergies", heading.TextContent);
    }

    [Theory]
    [InlineData("top-left", "top: 1rem; left: 1rem;")]
    [InlineData("top-right", "top: 1rem; right: 1rem;")]
    [InlineData("bottom-left", "bottom: 1rem; left: 1rem;")]
    [InlineData("bottom-right", "bottom: 1rem; right: 1rem;")]
    [InlineData("nowhere", "bottom: 1rem; right: 1rem;")]
    public void FloatButton_puts_itself_in_its_corner(string position, string offsets)
    {
        var cut = RenderComponent<FloatButton>(p => p.Add(x => x.Label, "Help").Add(x => x.Position, position));
        var button = cut.Find(".float-button");
        Assert.Equal(position, button.GetAttribute("data-position"));
        Assert.Equal($"position: fixed; {offsets}", button.GetAttribute("style"));
    }
}
