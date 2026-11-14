using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class AllergyRecordListTests : TestContext
{
    [Fact]
    public void Known_list_is_named_by_its_status_and_holds_its_items()
    {
        var cut = RenderComponent<AllergyRecordList>(p => p
            .Add(x => x.Status, "known").Add(x => x.StatusLabel, "Known allergies")
            .AddChildContent("<li class=\"allergy-record-list-item\">Penicillin</li>"));
        var list = cut.Find("ul.allergy-record-list");
        Assert.Equal("Known allergies", list.GetAttribute("aria-label"));
        Assert.Equal("known", list.GetAttribute("data-status"));
        Assert.Empty(cut.FindAll(".allergy-record-list-status"));
        Assert.Contains("Penicillin", list.TextContent);
    }

    [Theory]
    [InlineData("none-known", "No known allergies")]
    [InlineData("not-recorded", "Allergies not recorded")]
    [InlineData("unavailable", "Allergies unavailable")]
    public void Other_statuses_are_the_lists_one_item(string status, string words)
    {
        var cut = RenderComponent<AllergyRecordList>(p => p.Add(x => x.Status, status).Add(x => x.StatusLabel, words));
        var items = cut.FindAll("li");
        Assert.Single(items);
        Assert.Equal("allergy-record-list-status", items[0].ClassName);
        Assert.Equal(words, items[0].TextContent);
    }
}
