using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class DeviceRecordListTests : TestContext
{
    [Fact]
    public void Known_list_is_named_by_its_status_and_holds_its_items()
    {
        var cut = RenderComponent<DeviceRecordList>(p => p
            .Add(x => x.Status, "known").Add(x => x.StatusLabel, "Medical devices")
            .AddChildContent("<li class=\"device-record-list-item\">One record</li>"));
        var list = cut.Find("ul.device-record-list");
        Assert.Equal("Medical devices", list.GetAttribute("aria-label"));
        Assert.Equal("known", list.GetAttribute("data-status"));
        Assert.Empty(cut.FindAll(".device-record-list-status"));
        Assert.Contains("One record", list.TextContent);
    }

    [Theory]
    [InlineData("none-known", "No known medical devices (none-known)")]
    [InlineData("not-recorded", "No known medical devices (not-recorded)")]
    [InlineData("unavailable", "No known medical devices (unavailable)")]
    [InlineData("omitted", "No known medical devices (omitted)")]
    public void Other_statuses_are_the_lists_one_item(string status, string words)
    {
        var cut = RenderComponent<DeviceRecordList>(p => p.Add(x => x.Status, status).Add(x => x.StatusLabel, words));
        var items = cut.FindAll("li");
        Assert.Single(items);
        Assert.Equal("device-record-list-status", items[0].ClassName);
        Assert.Equal(words, items[0].TextContent);
    }
}
