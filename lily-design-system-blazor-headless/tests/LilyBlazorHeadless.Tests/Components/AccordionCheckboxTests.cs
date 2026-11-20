using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class AccordionCheckboxTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<AccordionCheckbox>(p => p
            .Add(x => x.Checked, false)
            .Add(x => x.Id, "x")
            .AddChildContent("body"));
        var root = cut.Find(".accordion-checkbox");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<AccordionCheckbox>(p => p
            .Add(x => x.Checked, false)
            .Add(x => x.Id, "x")
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".accordion-checkbox");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<AccordionCheckbox>(p => p
            .Add(x => x.Checked, false)
            .Add(x => x.Id, "x")
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".accordion-checkbox");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Checking_reveals_the_panel_and_reports_once()
    {
        var reports = new List<bool>();
        var cut = RenderComponent<AccordionCheckbox>(p => p
            .Add(x => x.Label, "More options")
            .Add(x => x.CheckedChanged, v => reports.Add(v))
            .AddChildContent("panel"));
        var box = cut.Find("input");
        Assert.True(cut.Find(".accordion-checkbox-panel").HasAttribute("hidden"));
        box.Change(true);
        Assert.False(cut.Find(".accordion-checkbox-panel").HasAttribute("hidden"));
        Assert.Equal("true", cut.Find("input").GetAttribute("aria-expanded"));
        cut.Find("input").Change(true); // no change, no report
        cut.Find("input").Change(false);
        Assert.Equal([true, false], reports);
        Assert.True(cut.Find(".accordion-checkbox-panel").HasAttribute("hidden"));
    }

    [Fact]
    public void Id_names_the_checkbox_and_the_panel_it_controls()
    {
        var cut = RenderComponent<AccordionCheckbox>(p => p
            .Add(x => x.Label, "More options")
            .Add(x => x.Id, "extras")
            .AddChildContent("panel"));
        var box = cut.Find("input");
        Assert.Equal("extras-checkbox", box.Id);
        Assert.Equal("extras-panel", box.GetAttribute("aria-controls"));
        Assert.Equal("extras-checkbox", cut.Find("label").GetAttribute("for"));
        Assert.Equal("extras-checkbox", cut.Find(".accordion-checkbox-panel").GetAttribute("aria-labelledby"));
    }
}
