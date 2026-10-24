// TimeZonePicker tests. The pure rules live in TimeZones; the component is exercised through bUnit.
// Zone names are supplied through Names so the assertions do not depend on the platform's own zone-name data.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class TimeZonePickerTests : TestContext
{
    // A fixed date, so offsets do not depend on the day the tests run: January, standard time in the north.
    private static readonly DateTimeOffset Winter = new(2026, 1, 15, 12, 0, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset Summer = new(2026, 7, 15, 12, 0, 0, TimeSpan.Zero);
    private static readonly string[] Zones = { "Asia/Tokyo", "America/New_York", "Europe/Paris", "UTC", "Asia/Kolkata" };
    // ...and the order the picker must show them in: west to east.
    private static readonly string[] Ordered = { "America/New_York", "UTC", "Europe/Paris", "Asia/Kolkata", "Asia/Tokyo" };

    private static readonly Dictionary<string, (string Standard, string? Daylight)> Names = new()
    {
        ["America/New_York"] = ("Eastern Standard Time", "Eastern Daylight Time"),
        ["UTC"] = ("Coordinated Universal Time", null),
        ["Europe/Paris"] = ("Central European Standard Time", "Central European Summer Time"),
        ["Asia/Kolkata"] = ("India Standard Time", null),
        ["Asia/Tokyo"] = ("Japan Standard Time", null),
    };

    public TimeZonePickerTests()
    {
        // Loose: an unmatched interop call (focus, a string eval) returns its default instead of throwing.
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
    }

    private IRenderedComponent<TimeZonePicker> Render(
        Action<ComponentParameterCollectionBuilder<TimeZonePicker>>? more = null,
        string label = "Time zone",
        string[]? zones = null,
        DateTimeOffset? date = null,
        Dictionary<string, (string Standard, string? Daylight)>? names = null)
        => RenderComponent<TimeZonePicker>(p =>
        {
            p.Add(x => x.Label, label)
             .Add(x => x.Locale, "en")
             .Add(x => x.Zones, zones ?? Zones)
             .Add(x => x.Date, date ?? Winter)
             .Add(x => x.Names, names ?? Names);
            more?.Invoke(p);
        });

    private static void Key(IRenderedComponent<TimeZonePicker> cut, string selector, string key)
        => cut.Find(selector).KeyDown(new KeyboardEventArgs { Key = key });

    private static string[] OptionTexts(IRenderedComponent<TimeZonePicker> cut)
        => cut.FindAll("li.time-zone-picker-option").Select(o => o.TextContent.Trim()).ToArray();

    private void Pick(IRenderedComponent<TimeZonePicker> cut, string zone)
    {
        cut.Find("button.time-zone-picker-button").Click();
        cut.FindAll("li.time-zone-picker-option")[Array.IndexOf(Ordered, zone)].Click();
    }

    private static string Hidden(IRenderedComponent<TimeZonePicker> cut)
        => cut.Find("input[type=hidden]").GetAttribute("value") ?? "";

    // =================================================================
    // Pure rules
    // =================================================================

    [Theory]
    [InlineData(0, "UTC+00:00")]
    [InlineData(60, "UTC+01:00")]
    [InlineData(330, "UTC+05:30")]
    [InlineData(-210, "UTC-03:30")]
    [InlineData(-720, "UTC-12:00")]
    [InlineData(840, "UTC+14:00")]
    public void FormatOffset_Writes_Sign_Hours_And_Minutes_In_Ascii(int minutes, string expected)
        => Assert.Equal(expected, TimeZones.FormatOffset(minutes));

    [Theory]
    [InlineData("UTC", 0)]
    [InlineData("Europe/Paris", 60)]
    [InlineData("America/New_York", -300)]
    [InlineData("Asia/Kolkata", 330)]
    [InlineData("Asia/Kathmandu", 345)]
    [InlineData("America/St_Johns", -210)]
    public void OffsetMinutes_Is_Minutes_East_Of_Utc(string id, int minutes)
        => Assert.Equal(minutes, TimeZones.OffsetMinutes(id, Winter));

    [Fact]
    public void OffsetMinutes_Follows_Daylight_Saving_Time_In_Both_Hemispheres()
    {
        Assert.Equal(120, TimeZones.OffsetMinutes("Europe/Paris", Summer));
        Assert.Equal(-240, TimeZones.OffsetMinutes("America/New_York", Summer));
        Assert.Equal(660, TimeZones.OffsetMinutes("Australia/Sydney", Winter));
        Assert.Equal(600, TimeZones.OffsetMinutes("Australia/Sydney", Summer));
    }

    [Fact]
    public void OffsetMinutes_Is_Null_For_An_Unknown_Zone()
    {
        Assert.Null(TimeZones.OffsetMinutes("Mars/Olympus_Mons", Winter));
        Assert.Null(TimeZones.OffsetMinutes("", Winter));
    }

    [Fact]
    public void Ordered_Is_By_Offset_West_To_East_Whatever_The_Input_Order()
        => Assert.Equal(Ordered, TimeZones.Ordered(Zones, "en", Winter, Names).Select(z => z.Id));

    [Fact]
    public void Ordered_Breaks_Ties_By_Name_Then_Id_And_Drops_Unknown_And_Repeated_Zones()
    {
        var names = new Dictionary<string, (string Standard, string? Daylight)> { ["Europe/Paris"] = ("Same", null), ["Europe/Berlin"] = ("Same", null) };
        var tie = TimeZones.Ordered(new[] { "Europe/Paris", "Europe/Berlin" }, "en", Winter, names);
        Assert.Equal(new[] { "Europe/Berlin", "Europe/Paris" }, tie.Select(z => z.Id));
        var some = TimeZones.Ordered(new[] { "UTC", "Nowhere/Land", "UTC", "Asia/Tokyo" }, "en", Winter, Names);
        Assert.Equal(new[] { "UTC", "Asia/Tokyo" }, some.Select(z => z.Id));
        Assert.Empty(TimeZones.Ordered(Array.Empty<string>(), "en", Winter));
    }

    [Fact]
    public void Info_Carries_Id_Offset_Name_And_The_Default_Label()
    {
        var z = TimeZones.Info("Asia/Kolkata", Winter, Names)!;
        Assert.Equal(330, z.OffsetMinutes);
        Assert.Equal("UTC+05:30", z.Offset);
        Assert.Equal("India Standard Time", z.Name);
        Assert.Equal("UTC+05:30 – India Standard Time", z.Label);
        Assert.Equal("India Standard Time / UTC+05:30", TimeZones.Info("Asia/Kolkata", Winter, Names, e => $"{e.Name} / {e.Offset}")!.Label);
        Assert.Null(TimeZones.Info("Nowhere/Land", Winter));
    }

    [Fact]
    public void Info_Falls_Back_To_The_Platform_Name_When_No_Name_Is_Given()
        => Assert.False(string.IsNullOrWhiteSpace(TimeZones.Info("Asia/Tokyo", Winter)!.Name));

    [Fact]
    public void MatchZone_Is_The_Zone_Itself_When_Listed_And_Null_When_It_Cannot_Be_Placed()
    {
        var zones = TimeZones.Ordered(Zones, "en", Winter, Names);
        Assert.Equal("Asia/Tokyo", TimeZones.MatchZone("Asia/Tokyo", zones, Winter, Names));
        Assert.Null(TimeZones.MatchZone("Nowhere/Land", zones, Winter, Names));
        Assert.Null(TimeZones.MatchZone(null, zones, Winter, Names));
    }

    [Fact]
    public void MatchZone_Finds_The_Listed_Twin_With_The_Same_Offset_And_Name()
    {
        var names = new Dictionary<string, (string Standard, string? Daylight)>(Names) { ["Europe/Berlin"] = ("Central European Standard Time", null) };
        var zones = TimeZones.Ordered(Zones, "en", Winter, names);
        Assert.Equal("Europe/Paris", TimeZones.MatchZone("Europe/Berlin", zones, Winter, names));
    }

    [Fact]
    public void DefaultZones_Are_All_Known_To_The_Runtime_And_Cover_UTC_Minus_11_To_Plus_14()
    {
        var all = TimeZones.Ordered(TimeZones.DefaultZones, "en", Winter);
        Assert.Equal(TimeZones.DefaultZones.Count, all.Count);
        Assert.Equal("UTC-11:00", all[0].Offset);
        Assert.Equal("UTC+14:00", all[^1].Offset);
    }

    // =================================================================
    // Markup contract
    // =================================================================

    [Fact]
    public void Renders_A_Button_Controlling_A_Listbox()
    {
        var cut = Render();
        Assert.NotNull(cut.Find("div.time-zone-picker"));
        Assert.Empty(cut.FindAll("select"));
        var button = cut.Find("button.time-zone-picker-button");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Equal("listbox", button.GetAttribute("aria-haspopup"));
        Assert.Equal("false", button.GetAttribute("aria-expanded"));
        var list = cut.Find("ul.time-zone-picker-list");
        Assert.Equal(list.Id, button.GetAttribute("aria-controls"));
        Assert.Equal("listbox", list.GetAttribute("role"));
        Assert.True(list.HasAttribute("hidden"));
    }

    [Fact]
    public void The_Icon_Is_A_Bundled_Svg_Hidden_From_Assistive_Technology()
    {
        var icon = Render().Find("svg.time-zone-picker-icon");
        Assert.Equal("true", icon.GetAttribute("aria-hidden"));
        Assert.NotNull(icon.QuerySelector("path"));
    }

    [Fact]
    public void The_Label_Names_The_Button_The_Listbox_And_The_Tooltip()
    {
        var cut = Render(label: "Choose a time zone");
        Assert.Equal("Choose a time zone", cut.Find("button.time-zone-picker-button").GetAttribute("aria-label"));
        Assert.Equal("Choose a time zone", cut.Find("ul.time-zone-picker-list").GetAttribute("aria-label"));
        var tip = cut.Find("div.time-zone-picker-tooltip");
        Assert.Equal("tooltip", tip.GetAttribute("role"));
        Assert.Equal("Choose a time zone", tip.TextContent);
        Assert.False(cut.Find("button.time-zone-picker-button").HasAttribute("aria-describedby"));
    }

    [Fact]
    public void The_Root_Carries_The_Class_Hook_The_Consumer_Class_And_Extra_Attributes()
    {
        var cut = Render(p => p.Add(x => x.CssClass, "extra").AddUnmatched("data-x", "1"));
        var root = cut.Find("div.time-zone-picker");
        Assert.Equal("time-zone-picker extra", root.GetAttribute("class"));
        Assert.Equal("1", root.GetAttribute("data-x"));
    }

    [Fact]
    public void The_Hidden_Input_Carries_The_Name_And_The_Iana_Id()
    {
        var cut = Render(p => p.Add(x => x.Name, "tz").Add(x => x.DefaultValue, "Asia/Tokyo"));
        Assert.Equal("tz", cut.Find("input[type=hidden]").GetAttribute("name"));
        Assert.Equal("Asia/Tokyo", Hidden(cut));
        Assert.Equal("time-zone", Render().Find("input[type=hidden]").GetAttribute("name"));
    }

    // =================================================================
    // Options
    // =================================================================

    [Fact]
    public void Options_Are_Ordered_By_Offset_And_Show_Offset_And_Full_Name()
    {
        var texts = OptionTexts(Render());
        Assert.Equal(new[]
        {
            "UTC-05:00 – Eastern Standard Time",
            "UTC+00:00 – Coordinated Universal Time",
            "UTC+01:00 – Central European Standard Time",
            "UTC+05:30 – India Standard Time",
            "UTC+09:00 – Japan Standard Time",
        }, texts);
        var cut = Render();
        Assert.Equal("UTC+05:30", cut.FindAll("li.time-zone-picker-option")[3].GetAttribute("data-offset"));
        foreach (var o in cut.FindAll("li.time-zone-picker-option"))
        {
            Assert.Equal("option", o.GetAttribute("role"));
            Assert.Matches("true|false", o.GetAttribute("aria-selected"));
        }
    }

    [Fact]
    public void The_Date_Decides_The_Offsets()
    {
        var cut = Render(date: Summer, zones: new[] { "Europe/Paris", "America/New_York" });
        var texts = OptionTexts(cut);
        Assert.Equal("UTC-04:00 – Eastern Daylight Time", texts[0]);
        Assert.Equal("UTC+02:00 – Central European Summer Time", texts[1]);
    }

    [Fact]
    public void LabelFor_Builds_The_Text()
    {
        var cut = Render(p => p.Add(x => x.LabelFor, e => $"{e.Name} [{e.Offset}]"));
        Assert.Contains("India Standard Time [UTC+05:30]", OptionTexts(cut));
    }

    [Fact]
    public void An_Unknown_Zone_Is_Left_Out()
        => Assert.Single(Render(zones: new[] { "UTC", "Nowhere/Land" }).FindAll("li.time-zone-picker-option"));

    [Fact]
    public void The_Default_List_Is_Offered_When_No_Zones_Are_Given()
    {
        var cut = RenderComponent<TimeZonePicker>(p => p
            .Add(x => x.Label, "Time zone").Add(x => x.Locale, "en").Add(x => x.Date, Winter));
        Assert.Equal(TimeZones.DefaultZones.Count, cut.FindAll("li.time-zone-picker-option").Count);
    }

    // =================================================================
    // Selection and applying
    // =================================================================

    [Fact]
    public void Choosing_A_Zone_Sets_The_Value_Aria_Selected_And_Closes()
    {
        var cut = Render(p => p.Add(x => x.DefaultValue, "UTC"));
        Pick(cut, "Asia/Kolkata");
        Assert.Equal("Asia/Kolkata", Hidden(cut));
        var options = cut.FindAll("li.time-zone-picker-option");
        Assert.Equal("true", options[Array.IndexOf(Ordered, "Asia/Kolkata")].GetAttribute("aria-selected"));
        Assert.Equal("false", options[Array.IndexOf(Ordered, "UTC")].GetAttribute("aria-selected"));
        Assert.Equal("false", cut.Find("button.time-zone-picker-button").GetAttribute("aria-expanded"));
        Assert.True(cut.Find("ul.time-zone-picker-list").HasAttribute("hidden"));
    }

    [Fact]
    public void Choosing_A_Zone_Sets_Data_Time_Zone_On_The_Document_Through_Js()
    {
        var cut = Render(p => p.Add(x => x.DefaultValue, "UTC"));
        Pick(cut, "Asia/Tokyo");
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "eval" && i.Arguments[0]!.ToString()!.Contains("data-time-zone") && i.Arguments[0]!.ToString()!.Contains("Asia/Tokyo"));
    }

    [Fact]
    public void OnChange_And_ValueChanged_Fire_With_The_Iana_Id()
    {
        var changes = new List<string>();
        var values = new List<string>();
        var cut = Render(p => p.Add(x => x.DefaultValue, "UTC")
            .Add(x => x.OnChange, EventCallback.Factory.Create<string>(this, v => changes.Add(v)))
            .Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => values.Add(v))));
        Pick(cut, "Asia/Tokyo");
        Assert.Equal(new[] { "UTC", "Asia/Tokyo" }, changes);
        Assert.Equal(new[] { "UTC", "Asia/Tokyo" }, values);
    }

    [Fact]
    public void BuildApplyScript_Sets_The_Attribute_And_Stores_Under_The_Key()
    {
        var script = TimeZonePicker.BuildApplyScript("Asia/Tokyo", "tz");
        Assert.Contains("data-time-zone", script);
        Assert.Contains("localStorage.setItem(\"tz\",\"Asia/Tokyo\")", script);
        Assert.DoesNotContain("localStorage", TimeZonePicker.BuildApplyScript("Asia/Tokyo", null));
    }

    // =================================================================
    // Initial value
    // =================================================================

    [Fact]
    public void The_Value_Wins_Then_DefaultValue()
    {
        Assert.Equal("Asia/Tokyo", Hidden(Render(p => p.Add(x => x.Value, "Asia/Tokyo").Add(x => x.DefaultValue, "UTC"))));
        Assert.Equal("Asia/Kolkata", Hidden(Render(p => p.Add(x => x.DefaultValue, "Asia/Kolkata"))));
    }

    [Theory]
    [InlineData("Europe/Paris", "Europe/Paris")]
    [InlineData("Nowhere/Land", "UTC")]
    public void The_Readers_Own_Zone_Is_Used_When_Listed_Else_UTC(string system, string expected)
    {
        JSInterop.Setup<string?>("eval", i => i.Arguments[0]?.ToString()?.Contains("resolvedOptions") == true).SetResult(system);
        Assert.Equal(expected, Hidden(Render()));
    }

    [Fact]
    public void A_Zone_That_Is_Not_Listed_Is_Matched_To_Its_Listed_Twin()
    {
        JSInterop.Setup<string?>("eval", i => i.Arguments[0]?.ToString()?.Contains("resolvedOptions") == true).SetResult("Europe/Berlin");
        var names = new Dictionary<string, (string Standard, string? Daylight)>(Names) { ["Europe/Berlin"] = ("Central European Standard Time", null) };
        Assert.Equal("Europe/Paris", Hidden(Render(names: names)));
    }

    [Fact]
    public void The_First_Zone_When_UTC_Is_Not_Offered_Either()
        => Assert.Equal("America/New_York", Hidden(Render(zones: new[] { "Asia/Tokyo", "America/New_York" })));

    [Fact]
    public void An_Empty_List_Leaves_The_Value_Empty()
        => Assert.Equal("", Hidden(Render(zones: Array.Empty<string>())));

    [Fact]
    public void A_Stored_Zone_Is_Restored_And_One_No_Longer_Offered_Is_Not()
    {
        JSInterop.Setup<string?>("eval", i => i.Arguments[0]?.ToString()?.Contains("getItem") == true).SetResult("Asia/Kolkata");
        Assert.Equal("Asia/Kolkata", Hidden(Render(p => p.Add(x => x.StorageKey, "tz").Add(x => x.DefaultValue, "UTC"))));
        using var other = new TestContext();
        other.JSInterop.Mode = JSRuntimeMode.Loose;
        other.JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        other.JSInterop.Setup<string?>("eval", i => i.Arguments[0]?.ToString()?.Contains("getItem") == true).SetResult("Pacific/Auckland");
        var cut = other.RenderComponent<TimeZonePicker>(p => p
            .Add(x => x.Label, "Time zone").Add(x => x.Locale, "en").Add(x => x.Zones, Zones).Add(x => x.Date, Winter).Add(x => x.Names, Names)
            .Add(x => x.StorageKey, "tz").Add(x => x.DefaultValue, "UTC"));
        Assert.Equal("UTC", Hidden(cut));
    }

    // =================================================================
    // Keyboard (APG listbox) and open state
    // =================================================================

    [Fact]
    public void ArrowDown_On_The_Button_Opens_The_List_On_The_Selected_Option()
    {
        var cut = Render(p => p.Add(x => x.DefaultValue, "Asia/Kolkata"));
        Key(cut, "button.time-zone-picker-button", "ArrowDown");
        Assert.Equal("true", cut.Find("button.time-zone-picker-button").GetAttribute("aria-expanded"));
        var active = cut.Find("ul.time-zone-picker-list").GetAttribute("aria-activedescendant");
        Assert.Equal(cut.FindAll("li.time-zone-picker-option")[Array.IndexOf(Ordered, "Asia/Kolkata")].Id, active);
    }

    [Fact]
    public void ArrowUp_On_The_Button_Opens_The_List_On_The_Last_Option()
    {
        var cut = Render(p => p.Add(x => x.DefaultValue, "UTC"));
        Key(cut, "button.time-zone-picker-button", "ArrowUp");
        Assert.Equal(cut.FindAll("li.time-zone-picker-option")[^1].Id, cut.Find("ul.time-zone-picker-list").GetAttribute("aria-activedescendant"));
    }

    [Fact]
    public void Arrows_Clamp_Home_And_End_Jump_And_Enter_Selects_And_Closes()
    {
        var cut = Render(p => p.Add(x => x.DefaultValue, "UTC"));
        Key(cut, "button.time-zone-picker-button", "ArrowDown");
        Key(cut, "ul.time-zone-picker-list", "End");
        Key(cut, "ul.time-zone-picker-list", "ArrowDown");
        Assert.Equal(cut.FindAll("li.time-zone-picker-option")[^1].Id, cut.Find("ul.time-zone-picker-list").GetAttribute("aria-activedescendant"));
        Key(cut, "ul.time-zone-picker-list", "Home");
        Assert.Equal(cut.FindAll("li.time-zone-picker-option")[0].Id, cut.Find("ul.time-zone-picker-list").GetAttribute("aria-activedescendant"));
        Key(cut, "ul.time-zone-picker-list", "Enter");
        Assert.Equal("America/New_York", Hidden(cut));
        Assert.Equal("false", cut.Find("button.time-zone-picker-button").GetAttribute("aria-expanded"));
    }

    [Fact]
    public void Typing_An_Offset_Jumps_To_It()
    {
        var cut = Render(p => p.Add(x => x.DefaultValue, "UTC"));
        Key(cut, "button.time-zone-picker-button", "ArrowDown");
        foreach (var ch in "UTC+05") Key(cut, "ul.time-zone-picker-list", ch.ToString());
        Assert.Equal(cut.FindAll("li.time-zone-picker-option")[Array.IndexOf(Ordered, "Asia/Kolkata")].Id, cut.Find("ul.time-zone-picker-list").GetAttribute("aria-activedescendant"));
    }

    [Fact]
    public void Escape_Closes_Without_Changing_The_Value()
    {
        var cut = Render(p => p.Add(x => x.DefaultValue, "UTC"));
        Key(cut, "button.time-zone-picker-button", "ArrowDown");
        Key(cut, "ul.time-zone-picker-list", "ArrowDown");
        Key(cut, "ul.time-zone-picker-list", "Escape");
        Assert.Equal("false", cut.Find("button.time-zone-picker-button").GetAttribute("aria-expanded"));
        Assert.Equal("UTC", Hidden(cut));
    }

    [Fact]
    public void OpenChanged_Reports_Opening_And_Closing()
    {
        var states = new List<bool>();
        var cut = Render(p => p.Add(x => x.OpenChanged, EventCallback.Factory.Create<bool>(this, v => states.Add(v))));
        cut.Find("button.time-zone-picker-button").Click();
        cut.Find("button.time-zone-picker-button").Click();
        Assert.Equal(new[] { true, false }, states);
    }

    [Fact]
    public void A_Disabled_Picker_Cannot_Be_Opened()
    {
        var cut = Render(p => p.Add(x => x.Disabled, true));
        Assert.True(cut.Find("button.time-zone-picker-button").HasAttribute("disabled"));
        Key(cut, "button.time-zone-picker-button", "ArrowDown");
        Assert.Equal("false", cut.Find("button.time-zone-picker-button").GetAttribute("aria-expanded"));
    }

    // =================================================================
    // Tooltip and icon override
    // =================================================================

    [Fact]
    public void The_Tooltip_Shows_On_Hover_And_Escape_Dismisses_It()
    {
        var cut = Render();
        Assert.True(cut.Find("div.time-zone-picker-tooltip").HasAttribute("hidden"));
        cut.Find("button.time-zone-picker-button").TriggerEvent("onmouseenter", new MouseEventArgs());
        Assert.False(cut.Find("div.time-zone-picker-tooltip").HasAttribute("hidden"));
        cut.Find("div.time-zone-picker").KeyDown(new KeyboardEventArgs { Key = "Escape" });
        Assert.True(cut.Find("div.time-zone-picker-tooltip").HasAttribute("hidden"));
    }

    [Fact]
    public void ChildContent_Replaces_The_Icon_And_Receives_InfoFor()
    {
        var cut = Render(p => p
            .Add(x => x.DefaultValue, "Asia/Kolkata")
            .Add(x => x.ChildContent, ctx => builder => builder.AddMarkupContent(0, $"<span data-testid=\"glyph\">{ctx.InfoFor(ctx.Value)?.Offset}</span>")));
        Assert.Equal("UTC+05:30", cut.Find("[data-testid=glyph]").TextContent);
        Assert.Empty(cut.FindAll("svg.time-zone-picker-icon"));
    }
}
