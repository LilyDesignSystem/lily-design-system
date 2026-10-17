// KanbanBoard 0.7.0 feature tests — search, copy, keyboard (page keys, type-ahead, right-to-left), field validation,
// field-edit undo / redo and the live drop cue. Numbered like the canonical Svelte suite's §8.110+ clauses.

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AngleSharp.Dom;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class KanbanBoardFeaturesTests : TestContext
{
    private static readonly IReadOnlyList<KanbanColumn> Columns = new[]
    {
        new KanbanColumn { Id = "todo", Title = "To Do" },
        new KanbanColumn { Id = "doing", Title = "In Progress" },
        new KanbanColumn { Id = "done", Title = "Done" },
    };

    private static DataGridRow Values(params (string Key, object? Value)[] values)
        => new(values.Select(v => new KeyValuePair<string, object?>(v.Key, v.Value)));

    private static readonly IReadOnlyList<KanbanCard> Cards = new[]
    {
        new KanbanCard { Id = "c1", ColumnId = "todo", Title = "Design login", Values = Values(("points", 5)) },
        new KanbanCard { Id = "c2", ColumnId = "todo", Title = "Café menu", Subtitle = "vip" },
        new KanbanCard { Id = "c3", ColumnId = "doing", Title = "Write docs" },
    };

    private static readonly IReadOnlyList<DataGridColumn> Fields = new[]
    {
        new DataGridColumn { Id = "points", Header = "Points", Type = DataGridCellType.Number, Editable = true, Validate = (v, _) => v is double d && d < 0 ? "must not be negative" : null },
    };

    private static readonly KanbanLabels Labels = new()
    {
        Search = "Search cards",
        SearchAnnouncement = (m, t) => $"{m} of {t} cards",
        Copy = "Copy",
        Export = "Export",
        CopyAnnouncement = n => $"{n} cards copied",
        CopyFailed = "Copy failed",
        ExportHeaders = new KanbanExportHeaders("Title", "Column"),
        EditRefused = (card, field, message) => $"{card} {field}: {message}",
        FieldUndoAnnouncement = (card, field, text) => $"Undid {field}: {text}",
        FieldRedoAnnouncement = (card, field, text) => $"Redid {field}: {text}",
    };

    public KanbanBoardFeaturesTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
    }

    private IRenderedComponent<KanbanBoard> Render(Action<ComponentParameterCollectionBuilder<KanbanBoard>>? configure = null, IReadOnlyList<KanbanCard>? cards = null)
        => RenderComponent<KanbanBoard>(p =>
        {
            p.Add(x => x.Label, "Board");
            p.Add(x => x.Columns, Columns);
            p.Add(x => x.Cards, cards ?? Cards);
            p.Add(x => x.Labels, Labels);
            configure?.Invoke(p);
        });

    private static string Status(IRenderedComponent<KanbanBoard> cut) => cut.Find(".kanban-board-status").TextContent;
    private static IElement Active(IRenderedComponent<KanbanBoard> cut) => cut.Find(".kanban-table-td[tabindex='0']");
    private static KeyboardEventArgs Key(string key, bool ctrl = false, bool shift = false) => new() { Key = key, CtrlKey = ctrl, ShiftKey = shift };
    private static string Titles(IRenderedComponent<KanbanBoard> cut) => string.Join("|", cut.FindAll(".kanban-board-card-title").Select(t => t.TextContent.Trim()));

    [Fact]
    public void Section_8_110_Every_Search_Word_Must_Appear_Ignoring_Case_And_Diacritics()
    {
        var cut = Render();
        cut.Find(".kanban-board-search").Input("LOGIN design");
        Assert.Equal("Design login", Titles(cut));
        cut.Find(".kanban-board-search").Input("cafe");
        Assert.Equal("Café menu", Titles(cut));
        Assert.Equal("1 of 3 cards", Status(cut));
        Assert.Equal("search-input", cut.Find(".kanban-board-search").ClassList.First());
    }

    [Fact]
    public void Section_8_111_Field_Text_Is_Searched_And_Escape_Clears()
    {
        var cut = Render(p => p.Add(x => x.Fields, Fields));
        cut.Find(".kanban-board-search").Input("5");
        Assert.Contains("Design login", Titles(cut));
        cut.Find(".kanban-board-search").KeyDown(Key("Escape"));
        Assert.Equal(3, cut.FindAll(".kanban-board-card-title").Count);
    }

    [Fact]
    public void Section_8_112_Copy_Puts_The_Cards_On_The_Clipboard_Header_First_And_Announces()
    {
        JSInterop.SetupVoid("navigator.clipboard.writeText", _ => true).SetVoidResult();
        DataGridCopy? seen = null;
        var cut = Render(p => p.Add(x => x.OnCopy, EventCallback.Factory.Create<DataGridCopy>(this, c => seen = c)));
        cut.Find("[data-kanban-export-format='copy']").Click();
        Assert.Equal("Title\tColumn", seen!.Text.Split("\r\n")[0]);
        Assert.Contains("Design login\tTo Do", seen.Text);
        Assert.Equal(3, seen.RowCount);
        Assert.Equal("3 cards copied", Status(cut));
        Assert.Equal(seen.Text, JSInterop.Invocations["navigator.clipboard.writeText"].Single().Arguments[0]);
    }

    [Fact]
    public void Section_8_113_A_Refused_Clipboard_Announces_Failure_And_CopyHandler_Takes_Over()
    {
        JSInterop.SetupVoid("navigator.clipboard.writeText", _ => true).SetException(new InvalidOperationException("denied"));
        var cut = Render();
        cut.Find("[data-kanban-export-format='copy']").Click();
        Assert.Equal("Copy failed", Status(cut));
        var taken = Render(p => p.Add(x => x.CopyHandler, _ => false));
        taken.Find("[data-kanban-export-format='copy']").Click();
        Assert.Equal("", Status(taken));
    }

    [Fact]
    public void Section_8_114_Page_Keys_Clamp_And_Type_Ahead_Moves_Within_The_Column()
    {
        var many = Enumerable.Range(0, 25).Select(i => new KanbanCard { Id = $"m{i}", ColumnId = "todo", Title = i == 3 ? "Beta" : i == 5 ? "Bravo" : $"Item {i}" }).ToList();
        var cut = Render(cards: many);
        Active(cut).KeyDown(Key("PageDown"));
        Assert.Equal("10", Active(cut).GetAttribute("data-row"));
        Active(cut).KeyDown(Key("PageDown"));
        Active(cut).KeyDown(Key("PageDown"));
        Assert.Equal("24", Active(cut).GetAttribute("data-row"));
        Active(cut).KeyDown(Key("Home", ctrl: true));
        Active(cut).KeyDown(Key("b"));
        Assert.Equal("3", Active(cut).GetAttribute("data-row"));
        Active(cut).KeyDown(Key("r"));
        Assert.Equal("5", Active(cut).GetAttribute("data-row"));
    }

    [Fact]
    public void Section_8_115_Right_To_Left_Swaps_The_Horizontal_Arrows()
    {
        var cut = Render(p => p.Add(x => x.Direction, "rtl"));
        Active(cut).KeyDown(Key("ArrowLeft"));
        Assert.Equal("1", Active(cut).GetAttribute("data-col"));
        Active(cut).KeyDown(Key("ArrowRight"));
        Assert.Equal("0", Active(cut).GetAttribute("data-col"));
    }

    private IRenderedComponent<KanbanBoard> RenderEditable(List<KanbanFieldEdit> edits)
        => Render(p =>
        {
            p.Add(x => x.Fields, Fields);
            p.Add(x => x.OnFieldEdit, EventCallback.Factory.Create<KanbanFieldEdit>(this, e => edits.Add(e)));
        });

    [Fact]
    public void Section_8_116_A_Value_Validate_Refuses_Keeps_The_Editor_Open_Invalid_And_Announces_The_Reason()
    {
        var edits = new List<KanbanFieldEdit>();
        var cut = RenderEditable(edits);
        cut.Find("[data-card-id='c1'] .kanban-board-field-button").Click();
        var input = cut.Find("input.kanban-board-field-editor");
        input.Input("-1");
        input.KeyDown(Key("Enter"));
        Assert.Empty(edits);
        Assert.Equal("true", cut.Find("input.kanban-board-field-editor").GetAttribute("aria-invalid"));
        Assert.Equal("Design login Points: must not be negative", Status(cut));
        cut.Find("input.kanban-board-field-editor").Input("2");
        Assert.Null(cut.Find("input.kanban-board-field-editor").GetAttribute("aria-invalid"));
    }

    [Fact]
    public void Section_8_117_Ctrl_Z_Reports_The_Earlier_Value_Through_OnFieldEdit_And_Redo_Re_Applies()
    {
        var edits = new List<KanbanFieldEdit>();
        var cut = RenderEditable(edits);
        cut.Find("[data-card-id='c1'] .kanban-board-field-button").Click();
        var input = cut.Find("input.kanban-board-field-editor");
        input.Input("9");
        input.KeyDown(Key("Enter"));
        Assert.Single(edits);
        Active(cut).KeyDown(Key("z", ctrl: true));
        Assert.Equal(2, edits.Count);
        Assert.Equal(5, Convert.ToInt32(edits[1].Value));
        Assert.Equal(9d, Convert.ToDouble(edits[1].Previous));
        Assert.Equal("Undid Points: 5", Status(cut));
        Active(cut).KeyDown(Key("z", ctrl: true, shift: true));
        Assert.Equal(3, edits.Count);
        Assert.Equal(9d, Convert.ToDouble(edits[2].Value));
    }

    [Fact]
    public async Task Section_8_118_A_Refused_Drop_Target_Carries_Data_Drop_Blocked_Not_Data_Drop_Target()
    {
        var cut = Render(p => p.Add(x => x.CanMove, (card, column) => column.Id != "done"));
        var title = cut.FindAll(".kanban-board-card-title").First(e => e.TextContent.Trim() == "Design login");
        await title.DragStartAsync(new DragEventArgs());
        IElement Cell(int col) => cut.FindAll(".kanban-table-body .kanban-table-row").First().QuerySelectorAll(".kanban-table-td")[col];
        await Cell(1).TriggerEventAsync("ondragenter", new DragEventArgs());
        Assert.True(Cell(1).HasAttribute("data-drop-target"));
        Assert.False(Cell(1).HasAttribute("data-drop-blocked"));
        await Cell(2).TriggerEventAsync("ondragenter", new DragEventArgs());
        Assert.True(Cell(2).HasAttribute("data-drop-blocked"));
        Assert.False(Cell(2).HasAttribute("data-drop-target"));
    }

    // ---- in-place title editing (OnTitleEdit) ----

    private static readonly IReadOnlyList<KanbanCard> TitleCards = new[]
    {
        new KanbanCard { Id = "c1", ColumnId = "todo", Title = "Card One" },
        new KanbanCard { Id = "c2", ColumnId = "todo", Title = "Linked", Href = "/x" },
    };

    private IRenderedComponent<KanbanBoard> RenderTitles(List<KanbanTitleEdit> edits, bool readOnly = false, bool handler = true)
        => RenderComponent<KanbanBoard>(p =>
        {
            p.Add(x => x.Label, "Board");
            p.Add(x => x.Columns, Columns);
            p.Add(x => x.Cards, TitleCards);
            p.Add(x => x.Labels, new KanbanLabels { TitleEditor = t => "Title of " + t, TitleEditAnnouncement = (a, b) => a + " -> " + b });
            p.Add(x => x.Readonly, readOnly);
            if (handler) p.Add(x => x.OnTitleEdit, EventCallback.Factory.Create<KanbanTitleEdit>(this, e => edits.Add(e)));
        });

    private static IElement TitleOf(IRenderedComponent<KanbanBoard> cut, string text) => cut.FindAll(".kanban-board-card-title").First(t => t.TextContent.Contains(text));

    [Fact]
    public void Title_Edit_Double_Click_Opens_An_Editor_And_Enter_Commits_And_Announces()
    {
        var edits = new List<KanbanTitleEdit>();
        var cut = RenderTitles(edits);
        TitleOf(cut, "Card One").DoubleClick();
        var input = cut.Find(".kanban-board-title-editor");
        Assert.Equal("Card One", input.GetAttribute("value"));
        Assert.Equal("Title of Card One", input.GetAttribute("aria-label"));
        input.Input("  Renamed  ");
        cut.Find(".kanban-board-title-editor").KeyDown(Key("Enter"));
        Assert.Equal(new KanbanTitleEdit("c1", "Renamed", "Card One"), Assert.Single(edits));
        Assert.Empty(cut.FindAll(".kanban-board-title-editor"));
        Assert.Equal("Card One -> Renamed", Status(cut));
    }

    [Fact]
    public void Title_Edit_Escape_Cancels_And_An_Empty_Or_Unchanged_Title_Changes_Nothing()
    {
        var edits = new List<KanbanTitleEdit>();
        var cut = RenderTitles(edits);
        TitleOf(cut, "Card One").DoubleClick();
        cut.Find(".kanban-board-title-editor").Input("Changed");
        cut.Find(".kanban-board-title-editor").KeyDown(Key("Escape"));
        Assert.Empty(cut.FindAll(".kanban-board-title-editor"));
        TitleOf(cut, "Card One").DoubleClick();
        cut.Find(".kanban-board-title-editor").Input("   ");
        cut.Find(".kanban-board-title-editor").KeyDown(Key("Enter"));
        TitleOf(cut, "Card One").DoubleClick();
        cut.Find(".kanban-board-title-editor").KeyDown(Key("Enter"));
        Assert.Empty(edits);
    }

    [Fact]
    public void Title_Edit_Leaving_The_Field_Commits_And_F2_On_A_Card_Opens_The_Editor()
    {
        var edits = new List<KanbanTitleEdit>();
        var cut = RenderTitles(edits);
        Active(cut).KeyDown(Key("F2"));
        cut.Find(".kanban-board-title-editor").Input("By blur");
        cut.Find(".kanban-board-title-editor").Blur();
        Assert.Equal(new KanbanTitleEdit("c1", "By blur", "Card One"), Assert.Single(edits));
    }

    [Fact]
    public void Title_Edit_Is_Off_Without_A_Handler_For_A_Linked_Card_And_When_Readonly()
    {
        var edits = new List<KanbanTitleEdit>();
        var none = RenderTitles(edits, handler: false);
        TitleOf(none, "Card One").DoubleClick();
        Assert.Empty(none.FindAll(".kanban-board-title-editor"));
        var linked = RenderTitles(edits);
        TitleOf(linked, "Linked").DoubleClick();
        Assert.Empty(linked.FindAll(".kanban-board-title-editor"));
        var readOnly = RenderTitles(edits, readOnly: true);
        TitleOf(readOnly, "Card One").DoubleClick();
        Assert.Empty(readOnly.FindAll(".kanban-board-title-editor"));
    }
}
