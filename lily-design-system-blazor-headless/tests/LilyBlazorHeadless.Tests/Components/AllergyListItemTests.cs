using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class AllergyListItemTests : TestContext
{
    [Fact]
    public void Renders_an_li_with_each_part()
    {
        var cut = RenderComponent<AllergyListItem>(p => p
            .Add(x => x.Substance, "Penicillin").Add(x => x.Reaction, "Anaphylaxis").Add(x => x.Severity, "severe")
            .Add(x => x.SeverityLabel, "Severe").Add(x => x.Updated, "2026-11-03").Add(x => x.UpdatedLabel, "Updated 3 Nov 2026"));
        var root = cut.Find("li.allergy-list-item");
        Assert.Equal("severe", root.GetAttribute("data-severity"));
        Assert.Equal("Penicillin", cut.Find(".allergy-list-item-substance").TextContent);
        Assert.Equal("Anaphylaxis", cut.Find(".allergy-list-item-reaction").TextContent);
        Assert.Equal("Severe", cut.Find(".allergy-list-item-severity").TextContent);
        Assert.Equal("2026-11-03", cut.Find("time.allergy-list-item-updated").GetAttribute("datetime"));
    }

    [Fact]
    public void Renders_only_the_parts_given()
    {
        var cut = RenderComponent<AllergyListItem>(p => p.Add(x => x.Substance, "Latex"));
        Assert.Empty(cut.FindAll(".allergy-list-item-reaction"));
        Assert.Null(cut.Find("li").GetAttribute("data-severity"));
    }
}
