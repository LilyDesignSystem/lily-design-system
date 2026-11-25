using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// The Svelte props these components lacked until 2026-11-25 (tasks.md P49-T15), one test per prop.
public class SveltePropTests : TestContext
{
    [Fact]
    public void Fieldset_legend_is_first_and_optional()
    {
        var cut = RenderComponent<Fieldset>(p => p.Add(x => x.Legend, "Contact").AddChildContent("<input>"));
        Assert.Equal("Contact", cut.Find("fieldset > legend:first-child").TextContent);
        Assert.False(cut.Find("fieldset").HasAttribute("aria-label"));
        var named = RenderComponent<Fieldset>(p => p.Add(x => x.Label, "Contact"));
        Assert.Empty(named.FindAll("legend"));
        Assert.Equal("Contact", named.Find("fieldset").GetAttribute("aria-label"));
    }

    [Fact]
    public void Tables_have_a_caption_only_when_given()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        Assert.Equal("Wards", RenderComponent<DataTable>(p => p.Add(x => x.Caption, "Wards")).Find("table > caption:first-child").TextContent);
        Assert.Equal("Wards", RenderComponent<CalendarTable>(p => p.Add(x => x.Label, "w").Add(x => x.Caption, "Wards")).Find("caption").TextContent);
        Assert.Equal("Wards", RenderComponent<GanttTable>(p => p.Add(x => x.Label, "w").Add(x => x.Caption, "Wards")).Find("caption").TextContent);
        Assert.Equal("Wards", RenderComponent<KanbanTable>(p => p.Add(x => x.Label, "w").Add(x => x.Caption, "Wards")).Find("caption").TextContent);
        Assert.Empty(RenderComponent<DataTable>().FindAll("caption"));
    }

    [Fact]
    public void Header_cells_default_to_column_scope()
    {
        Assert.Equal("col", RenderComponent<TableTH>().Find("th").GetAttribute("scope"));
        Assert.Equal("col", RenderComponent<DataTableTH>().Find("th").GetAttribute("scope"));
        Assert.Equal("col", RenderComponent<GanttTableTH>().Find("th").GetAttribute("scope"));
        Assert.Equal("col", RenderComponent<KanbanTableTH>().Find("th").GetAttribute("scope"));
        Assert.Equal("row", RenderComponent<CalendarTableTH>(p => p.Add(x => x.Scope, "row")).Find("th").GetAttribute("scope"));
        Assert.Equal("row", RenderComponent<TableTH>(p => p.AddUnmatched("scope", "row")).Find("th").GetAttribute("scope"));
    }

    [Theory]
    [InlineData(true, "true")]
    [InlineData(false, "false")]
    [InlineData(null, null)]
    public void Buttons_are_toggles_only_when_pressed_is_set(bool? pressed, string? expected)
    {
        Assert.Equal(expected, RenderComponent<Button>(p => p.Add(x => x.Pressed, pressed)).Find("button").GetAttribute("aria-pressed"));
        Assert.Equal(expected, RenderComponent<IconButton>(p => p.Add(x => x.Label, "Bold").Add(x => x.Pressed, pressed)).Find("button").GetAttribute("aria-pressed"));
    }

    [Theory]
    [InlineData(false, "status", "polite")]
    [InlineData(true, "alert", "assertive")]
    public void Urgent_notifications_and_toasts_are_alerts(bool urgent, string role, string live)
    {
        foreach (var root in new[]
        {
            RenderComponent<Notification>(p => p.Add(x => x.Urgent, urgent)).Find(".notification"),
            RenderComponent<Toast>(p => p.Add(x => x.Urgent, urgent)).Find(".toast"),
        })
        {
            Assert.Equal(role, root.GetAttribute("role"));
            Assert.Equal(live, root.GetAttribute("aria-live"));
        }
    }

    [Theory]
    [InlineData("alert", null, "assertive")]
    [InlineData("status", null, "polite")]
    [InlineData("alert", "off", "off")]
    public void Alert_politeness_follows_its_role_unless_live_is_set(string role, string? live, string expected)
    {
        var root = RenderComponent<Alert>(p => p.Add(x => x.Role, role).Add(x => x.Live, live).Add(x => x.Heading, "Saved").AddChildContent("Done")).Find(".alert");
        Assert.Equal(role, root.GetAttribute("role"));
        Assert.Equal(expected, root.GetAttribute("aria-live"));
        Assert.Equal("Saved", root.QuerySelector("p:first-child > strong")!.TextContent);
    }

    [Fact]
    public void Decorative_icons_and_characters_are_hidden_and_unnamed()
    {
        var icon = RenderComponent<Icon>(p => p.Add(x => x.Decorative, true)).Find(".icon");
        Assert.Equal("true", icon.GetAttribute("aria-hidden"));
        Assert.False(icon.HasAttribute("role"));
        var character = RenderComponent<Character>(p => p.Add(x => x.Decorative, true).Add(x => x.Label, "Star")).Find(".character");
        Assert.Equal("true", character.GetAttribute("aria-hidden"));
        Assert.Equal("presentation", character.GetAttribute("role"));
        Assert.False(character.HasAttribute("aria-label"));
        var named = RenderComponent<Icon>(p => p.Add(x => x.Label, "Star")).Find(".icon");
        Assert.Equal("img", named.GetAttribute("role"));
        Assert.False(named.HasAttribute("aria-hidden"));
    }

    [Fact]
    public void List_items_write_their_status()
    {
        Assert.Equal("waiting", RenderComponent<StepListItem>().Find("li").GetAttribute("data-status"));
        Assert.Equal("error", RenderComponent<StepListItem>(p => p.Add(x => x.Status, "error")).Find("li").GetAttribute("data-status"));
        Assert.Equal("pending", RenderComponent<ValidationListItem>().Find("li").GetAttribute("data-status"));
        Assert.Equal("passed", RenderComponent<ValidationListItem>(p => p.Add(x => x.Status, "passed")).Find("li").GetAttribute("data-status"));
    }

    [Fact]
    public void A_label_is_written_only_when_given()
    {
        Assert.Equal("Save", RenderComponent<Button>(p => p.Add(x => x.Label, "Save")).Find("button").GetAttribute("aria-label"));
        Assert.False(RenderComponent<Button>().Find("button").HasAttribute("aria-label"));
        Assert.Equal("Saved", RenderComponent<Notification>(p => p.Add(x => x.Label, "Saved")).Find(".notification").GetAttribute("aria-label"));
        Assert.False(RenderComponent<Notification>().Find(".notification").HasAttribute("aria-label"));
        Assert.Equal("Saved", RenderComponent<Toast>(p => p.Add(x => x.Label, "Saved")).Find(".toast").GetAttribute("aria-label"));
        Assert.False(RenderComponent<Toast>().Find(".toast").HasAttribute("aria-label"));
        Assert.Equal("Saved", RenderComponent<Alert>(p => p.Add(x => x.Label, "Saved")).Find(".alert").GetAttribute("aria-label"));
        Assert.Empty(RenderComponent<Alert>().FindAll("p"));
        Assert.Equal("Star", RenderComponent<Character>(p => p.Add(x => x.Label, "Star")).Find(".character").GetAttribute("aria-label"));
        Assert.False(RenderComponent<Character>().Find(".character").HasAttribute("aria-label"));
        Assert.Equal("Star", RenderComponent<Icon>(p => p.Add(x => x.Label, "Star")).Find(".icon").GetAttribute("aria-label"));
    }
}
