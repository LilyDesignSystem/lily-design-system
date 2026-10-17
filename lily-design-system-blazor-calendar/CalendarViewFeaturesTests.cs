// CalendarView 0.6.0 feature tests — search, EventCompare, copy, right-to-left keys, field validation and field-edit undo / redo.
// Numbered like the canonical Svelte suite's §8.110+ clauses.

using System.Collections.Generic;
using System.Linq;
using AngleSharp.Dom;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class CalendarViewFeaturesTests : TestContext
{
    private static DataGridRow Values(params (string Key, object? Value)[] values)
        => new(values.Select(v => new KeyValuePair<string, object?>(v.Key, v.Value)));

    private static readonly IReadOnlyList<CalendarEvent> Events = new[]
    {
        new CalendarEvent { Id = "e1", Date = "2026-01-06", Title = "Design review", Values = Values(("cost", 5)) },
        new CalendarEvent { Id = "e2", Date = "2026-01-06", Title = "Café standup" },
        new CalendarEvent { Id = "e3", Date = "2026-01-07", Title = "Write docs" },
    };

    private static readonly IReadOnlyList<DataGridColumn> Fields = new[]
    {
        new DataGridColumn { Id = "cost", Header = "Cost", Type = DataGridCellType.Number, Editable = true, Validate = (v, _) => v is double d && d < 0 ? "must not be negative" : null },
    };

    private static readonly CalendarViewLabels Labels = new()
    {
        Search = "Search events",
        SearchAnnouncement = (m, t) => $"{m} of {t} events",
        Copy = "Copy",
        Export = "Export",
        CopyAnnouncement = n => $"{n} events copied",
        CopyFailed = "Copy failed",
        ExportHeaders = new CalendarExportHeaders("Title", "Start", "End"),
        EditRefused = (title, field, message) => $"{title} {field}: {message}",
        FieldUndoAnnouncement = (title, field, text) => $"Undid {field}: {text}",
        FieldRedoAnnouncement = (title, field, text) => $"Redid {field}: {text}",
    };

    public CalendarViewFeaturesTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
    }

    private IRenderedComponent<CalendarView> Render(Action<ComponentParameterCollectionBuilder<CalendarView>>? configure = null, CalendarViewMode view = CalendarViewMode.Week, IReadOnlyList<CalendarEvent>? events = null)
        => RenderComponent<CalendarView>(p =>
        {
            p.Add(x => x.Label, "Cal");
            p.Add(x => x.View, view);
            p.Add(x => x.AnchorDate, view == CalendarViewMode.Agenda ? "2026-01-15" : "2026-01-06");
            p.Add(x => x.Events, events ?? Events);
            p.Add(x => x.Labels, Labels);
            configure?.Invoke(p);
        });

    private static string Status(IRenderedComponent<CalendarView> cut) => cut.Find(".calendar-view-status").TextContent;
    private static KeyboardEventArgs Key(string key, bool ctrl = false, bool shift = false) => new() { Key = key, CtrlKey = ctrl, ShiftKey = shift };
    private static IReadOnlyList<string> Titles(IRenderedComponent<CalendarView> cut) => cut.FindAll(".calendar-view-event").Select(b => b.TextContent.Trim()).ToList();

    [Fact]
    public void Section_8_110_Every_Search_Word_Must_Appear_Ignoring_Case_And_Diacritics()
    {
        var cut = Render();
        Assert.Equal(3, Titles(cut).Count);
        cut.Find(".calendar-view-search").Input("CAFE stand");
        Assert.Equal(new[] { "Café standup" }, Titles(cut));
        Assert.Equal("1 of 3 events", Status(cut));
        Assert.Equal("search-input", cut.Find(".calendar-view-search").ClassList.First());
    }

    [Fact]
    public void Section_8_111_Field_Text_Is_Searched_And_Escape_Clears()
    {
        var cut = Render(p => p.Add(x => x.EventFields, Fields));
        cut.Find(".calendar-view-search").Input("5");
        Assert.Contains("Design review", Titles(cut));
        Assert.DoesNotContain("Write docs", Titles(cut));
        cut.Find(".calendar-view-search").KeyDown(Key("Escape"));
        Assert.Equal(3, Titles(cut).Count);
    }

    [Fact]
    public void Section_8_112_EventCompare_Orders_A_Days_Events()
    {
        var cut = Render(p => p.Add(x => x.EventCompare, (a, b) => string.CompareOrdinal(a.Title, b.Title)));
        var day = cut.Find(".calendar-table-td[data-date='2026-01-06']");
        Assert.Equal(new[] { "Café standup", "Design review" }, day.QuerySelectorAll(".calendar-view-event").Select(b => b.TextContent.Trim()));
    }

    [Fact]
    public void Section_8_113_Copy_Puts_The_Events_On_The_Clipboard_Header_First_And_Announces()
    {
        JSInterop.SetupVoid("navigator.clipboard.writeText", _ => true).SetVoidResult();
        DataGridCopy? seen = null;
        var cut = Render(p => p.Add(x => x.OnCopy, EventCallback.Factory.Create<DataGridCopy>(this, c => seen = c)));
        cut.Find("[data-calendar-export-format='copy']").Click();
        Assert.Equal("Title\tStart\tEnd", seen!.Text.Split("\r\n")[0]);
        Assert.Equal(3, seen.RowCount);
        Assert.Equal("3 events copied", Status(cut));
        Assert.Equal(seen.Text, JSInterop.Invocations["navigator.clipboard.writeText"].Single().Arguments[0]);
    }

    [Fact]
    public void Section_8_114_A_Refused_Clipboard_Announces_Failure_And_CopyHandler_Takes_Over()
    {
        JSInterop.SetupVoid("navigator.clipboard.writeText", _ => true).SetException(new InvalidOperationException("denied"));
        var cut = Render();
        cut.Find("[data-calendar-export-format='copy']").Click();
        Assert.Equal("Copy failed", Status(cut));
        var taken = Render(p => p.Add(x => x.CopyHandler, _ => false));
        taken.Find("[data-calendar-export-format='copy']").Click();
        Assert.Equal("", Status(taken));
    }

    [Fact]
    public void Section_8_115_Right_To_Left_ArrowLeft_Goes_To_The_Next_Day()
    {
        var cut = Render(p => p.Add(x => x.Direction, "rtl"));
        var start = cut.FindAll(".calendar-table-td[tabindex='0']").Single().GetAttribute("data-date")!;
        cut.Find(".calendar-table").KeyDown(Key("ArrowLeft"));
        var next = cut.FindAll(".calendar-table-td[tabindex='0']").Single().GetAttribute("data-date")!;
        Assert.True(string.CompareOrdinal(next, start) > 0);
    }

    private IRenderedComponent<CalendarView> RenderEditable(List<CalendarFieldEdit> edits)
        => Render(p =>
        {
            p.Add(x => x.EventFields, Fields);
            p.Add(x => x.OnFieldEdit, EventCallback.Factory.Create<CalendarFieldEdit>(this, e => edits.Add(e)));
        }, CalendarViewMode.Agenda, new[] { new CalendarEvent { Id = "e1", Date = "2026-01-06", Title = "Review", Values = Values(("cost", 5)) } });

    [Fact]
    public void Section_8_116_A_Value_Validate_Refuses_Keeps_The_Editor_Open_Invalid_And_Announces_The_Reason()
    {
        var edits = new List<CalendarFieldEdit>();
        var cut = RenderEditable(edits);
        cut.Find("[data-event-key='e1'] .calendar-view-field-button").Click();
        var input = cut.Find("input.calendar-view-field-editor");
        input.Input("-1");
        input.KeyDown(Key("Enter"));
        Assert.Empty(edits);
        Assert.Equal("true", cut.Find("input.calendar-view-field-editor").GetAttribute("aria-invalid"));
        Assert.Equal("Review Cost: must not be negative", Status(cut));
        cut.Find("input.calendar-view-field-editor").Input("2");
        Assert.Null(cut.Find("input.calendar-view-field-editor").GetAttribute("aria-invalid"));
    }

    [Fact]
    public void Section_8_117_Ctrl_Z_In_The_Agenda_Reports_The_Earlier_Value_And_Redo_Re_Applies()
    {
        var edits = new List<CalendarFieldEdit>();
        var cut = RenderEditable(edits);
        cut.Find("[data-event-key='e1'] .calendar-view-field-button").Click();
        var input = cut.Find("input.calendar-view-field-editor");
        input.Input("9");
        input.KeyDown(Key("Enter"));
        Assert.Single(edits);
        cut.Find(".calendar-view-agenda").KeyDown(Key("z", ctrl: true));
        Assert.Equal(2, edits.Count);
        Assert.Equal(5, Convert.ToInt32(edits[1].Value));
        Assert.Equal(9d, Convert.ToDouble(edits[1].Previous));
        Assert.Equal("Undid Cost: 5", Status(cut));
        cut.Find(".calendar-view-agenda").KeyDown(Key("z", ctrl: true, shift: true));
        Assert.Equal(3, edits.Count);
        Assert.Equal(9d, Convert.ToDouble(edits[2].Value));
    }
}
