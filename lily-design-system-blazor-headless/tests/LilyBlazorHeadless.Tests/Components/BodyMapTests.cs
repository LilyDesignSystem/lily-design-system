using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class BodyMapTests : TestContext
{
    private static readonly BodyMapRegion[] Regions = [new("head", "Head"), new("left-arm", "Left arm")];

    [Fact]
    public void Is_a_fieldset_whose_regions_are_checkboxes_and_whose_drawing_gets_the_choice()
    {
        IReadOnlyList<string>? chosen = null;
        var cut = RenderComponent<BodyMap>(p => p
            .Add(x => x.Label, "Where is the pain?").Add(x => x.Regions, Regions).Add(x => x.Name, "sites")
            .Add(x => x.SelectedChanged, (IReadOnlyList<string> s) => chosen = s)
            .Add(x => x.Drawing, (IReadOnlyList<string> selected) => b => b.AddMarkupContent(0, $"<svg data-chosen=\"{string.Join(",", selected)}\"></svg>")));
        Assert.Equal("Where is the pain?", cut.Find("fieldset.body-map legend").TextContent);
        Assert.Equal("true", cut.Find(".body-map-figure").GetAttribute("aria-hidden"));
        var boxes = cut.FindAll("input[type=checkbox]");
        Assert.Equal(2, boxes.Count);
        Assert.Equal("sites", boxes[0].GetAttribute("name"));
        boxes[0].Change(true);
        Assert.Equal(new[] { "head" }, chosen);
        Assert.True(cut.FindAll("input[type=checkbox]")[0].HasAttribute("checked"));
        Assert.Equal("head", cut.Find("svg").GetAttribute("data-chosen"));
    }
}
