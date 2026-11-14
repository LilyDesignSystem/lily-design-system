using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class DeviceRecordListItemTests : TestContext
{
    [Fact]
    public void Renders_an_li_with_each_part_and_each_status_as_text_and_data()
    {
        var cut = RenderComponent<DeviceRecordListItem>(p => p.Add(x => x.Device, "Cardiac pacemaker").Add(x => x.Status, "active").Add(x => x.StatusLabel, "In use").Add(x => x.Timing, "2021-02-08").Add(x => x.TimingLabel, "Since 8 Feb 2021"));
        var root = cut.Find("li.device-record-list-item");
        Assert.Equal("active", root.GetAttribute("data-status"));
        Assert.Equal("Cardiac pacemaker", cut.Find(".device-record-list-item-device").TextContent);
        Assert.Equal("In use", cut.Find(".device-record-list-item-status").TextContent);
        Assert.Equal("2021-02-08", cut.Find("time.device-record-list-item-timing").GetAttribute("datetime"));
    }

    [Fact]
    public void Renders_only_the_parts_given()
    {
        var cut = RenderComponent<DeviceRecordListItem>(p => p.Add(x => x.Device, "Cardiac pacemaker"));
        Assert.Empty(cut.FindAll(".device-record-list-item-status"));
        Assert.Empty(cut.FindAll(".device-record-list-item-timing"));
        Assert.Null(cut.Find("li").GetAttribute("data-status"));
    }
}
