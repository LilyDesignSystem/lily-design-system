// DataGrid 0.10.0 feature tests — search, field search, row filter, empty values and nulls, copy, undo / redo, keyboard
// (page keys, type-ahead, right-to-left) and the pager landmark. Numbered like the canonical Svelte suite's §8.100+ clauses.

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

public class DataGridFeaturesTests : TestContext
{
    private static DataGridRow R(params (string Key, object? Value)[] pairs)
        => new(pairs.Select(p => new KeyValuePair<string, object?>(p.Key, p.Value)));

    private static readonly IReadOnlyList<DataGridColumn> Columns = new[]
    {
        new DataGridColumn { Id = "name", Header = "Name", Sortable = true },
        new DataGridColumn { Id = "city", Header = "City", Sortable = true },
        new DataGridColumn { Id = "age", Header = "Age", Type = DataGridCellType.Number, Editable = true },
    };

    private static readonly IReadOnlyList<DataGridRow> Rows = new[]
    {
        R(("name", "Zoë Smith"), ("city", "Paris"), ("age", 30)),
        R(("name", "Alan Jones"), ("city", "Café Town"), ("age", 41)),
        R(("name", "Beth Brown"), ("city", "Rome"), ("age", null)),
        R(("name", "Bruce Black"), ("city", ""), ("age", 25)),
    };

    public DataGridFeaturesTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
    }

    private IRenderedComponent<DataGrid> Render(Action<ComponentParameterCollectionBuilder<DataGrid>>? configure = null, IReadOnlyList<DataGridColumn>? columns = null, IReadOnlyList<DataGridRow>? rows = null)
        => RenderComponent<DataGrid>(p =>
        {
            p.Add(x => x.Label, "People");
            p.Add(x => x.Columns, columns ?? Columns);
            p.Add(x => x.Rows, rows ?? Rows);
            configure?.Invoke(p);
        });

    private static IReadOnlyList<IElement> BodyRows(IRenderedComponent<DataGrid> cut) => cut.FindAll(".data-table-body .data-table-row").Where(r => !r.ClassList.Contains("data-grid-spacer")).ToList();
    private static IElement DataCell(IRenderedComponent<DataGrid> cut, int row, int col) => cut.Find($".data-table-body [data-row='{row}'][data-col='{col}']");
    private static string Status(IRenderedComponent<DataGrid> cut) => cut.Find(".data-grid-status").TextContent;
    private static KeyboardEventArgs Key(string key, bool ctrl = false, bool shift = false) => new() { Key = key, CtrlKey = ctrl, ShiftKey = shift };
    private static string Names(IRenderedComponent<DataGrid> cut) => string.Join("|", BodyRows(cut).Select(r => r.QuerySelector("[data-col='0']")!.TextContent.Trim()));

    [Fact]
    public void Section_8_100_Every_Search_Word_Must_Appear_Ignoring_Case_And_Diacritics()
    {
        var cut = Render(p => p.Add(x => x.Labels, new DataGridLabels { Search = "Search", FilterAnnouncement = (m, t) => $"{m} of {t}" }));
        cut.Find(".data-grid-search").Input("SMITH zoe");
        Assert.Equal("Zoë Smith", Names(cut));
        cut.Find(".data-grid-search").Input("cafe");
        Assert.Equal("Alan Jones", Names(cut));
        Assert.Equal("1 of 4", Status(cut));
        Assert.Equal("search-input", cut.Find(".data-grid-search").ClassList.First());
    }

    [Fact]
    public void Section_8_101_Escape_In_The_Search_Field_Clears_It()
    {
        var cut = Render(p => p.Add(x => x.Labels, new DataGridLabels { Search = "Search" }));
        cut.Find(".data-grid-search").Input("rome");
        Assert.Single(BodyRows(cut));
        cut.Find(".data-grid-search").KeyDown(Key("Escape"));
        Assert.Equal(4, BodyRows(cut).Count);
    }

    [Fact]
    public void Section_8_102_Field_Search_Limits_The_Text_To_One_Column()
    {
        var cut = Render(p => p.Add(x => x.Labels, new DataGridLabels { Search = "Search", SearchField = "Search in", SearchAllFields = "Everything" }));
        cut.Find(".data-grid-search").Input("paris");
        Assert.Single(BodyRows(cut));
        cut.Find(".data-grid-search-field").Change("name");
        Assert.Empty(BodyRows(cut));
        cut.Find(".data-grid-search-field").Change("city");
        Assert.Single(BodyRows(cut));
        Assert.Equal("Search in", cut.Find(".data-grid-search-field").GetAttribute("aria-label"));
    }

    [Fact]
    public void Section_8_103_RowFilter_Hides_Rows_Before_The_Text_Filter()
    {
        var cut = Render(p => p.Add(x => x.RowFilter, row => (int?)row["age"] > 28));
        Assert.Equal("Zoë Smith|Alan Jones", Names(cut));
    }

    [Fact]
    public void Section_8_104_Missing_Values_Carry_Data_Empty_And_The_EmptyValue_Text()
    {
        var cut = Render(p => p.Add(x => x.EmptyValue, "—"));
        var missingAge = DataCell(cut, 2, 2);
        Assert.True(missingAge.HasAttribute("data-empty"));
        Assert.Equal("—", missingAge.TextContent.Trim());
        var emptyCity = DataCell(cut, 3, 1);
        Assert.True(emptyCity.HasAttribute("data-empty"));
        Assert.False(DataCell(cut, 0, 1).HasAttribute("data-empty"));
    }

    [Fact]
    public void Section_8_105_A_Column_EmptyValue_Wins_And_Without_Any_The_Cell_Stays_Blank()
    {
        var columns = new[] { Columns[0], Columns[1] with { EmptyValue = "n/a" }, Columns[2] };
        var cut = Render(p => p.Add(x => x.EmptyValue, "—"), columns);
        Assert.Equal("n/a", DataCell(cut, 3, 1).TextContent.Trim());
        Assert.Equal("—", DataCell(cut, 2, 2).TextContent.Trim());
        var plain = Render();
        Assert.Equal("", DataCell(plain, 2, 2).TextContent.Trim());
    }

    [Fact]
    public void Section_8_106_Nulls_Sort_Last_By_Default_In_Both_Directions_Or_First()
    {
        var asc = Render(p => p.Add(x => x.Sort, new DataGridSort("age", DataGridSortDirection.Ascending)));
        Assert.EndsWith("Beth Brown", Names(asc));
        var desc = Render(p => p.Add(x => x.Sort, new DataGridSort("age", DataGridSortDirection.Descending)));
        Assert.EndsWith("Beth Brown", Names(desc));
        var first = Render(p => { p.Add(x => x.Sort, new DataGridSort("age", DataGridSortDirection.Ascending)); p.Add(x => x.Nulls, DataGridNulls.First); });
        Assert.StartsWith("Beth Brown", Names(first));
    }

    [Fact]
    public void Section_8_107_Copy_Puts_The_Export_On_The_Clipboard_Header_First_And_Announces()
    {
        JSInterop.SetupVoid("navigator.clipboard.writeText", _ => true).SetVoidResult();
        DataGridCopy? seen = null;
        var cut = Render(p =>
        {
            p.Add(x => x.Labels, new DataGridLabels { Copy = "Copy", Export = "Export", CopyAnnouncement = n => $"{n} rows copied" });
            p.Add(x => x.OnCopy, EventCallback.Factory.Create<DataGridCopy>(this, c => seen = c));
        });
        cut.Find("[data-grid-export-format='copy']").Click();
        Assert.NotNull(seen);
        Assert.Equal("Name\tCity\tAge", seen!.Text.Split("\r\n")[0]);
        Assert.Equal(4, seen.RowCount);
        Assert.Equal("4 rows copied", Status(cut));
        var call = JSInterop.Invocations["navigator.clipboard.writeText"].Single();
        Assert.Equal(seen.Text, call.Arguments[0]);
    }

    [Fact]
    public void Section_8_108_A_Refused_Clipboard_Announces_CopyFailed_And_CopyHandler_Can_Take_Over()
    {
        JSInterop.SetupVoid("navigator.clipboard.writeText", _ => true).SetException(new InvalidOperationException("denied"));
        var cut = Render(p => p.Add(x => x.Labels, new DataGridLabels { Copy = "Copy", Export = "Export", CopyFailed = "Copy failed" }));
        cut.Find("[data-grid-export-format='copy']").Click();
        Assert.Equal("Copy failed", Status(cut));
        var taken = Render(p =>
        {
            p.Add(x => x.Labels, new DataGridLabels { Copy = "Copy", Export = "Export", CopyFailed = "Copy failed" });
            p.Add(x => x.CopyHandler, _ => false);
        });
        taken.Find("[data-grid-export-format='copy']").Click();
        Assert.Equal("", Status(taken));
    }

    [Fact]
    public void Section_8_109_Undo_And_Redo_Report_Through_OnCellEdit_And_Announce()
    {
        var edits = new List<DataGridCellEdit>();
        var cut = Render(p =>
        {
            p.Add(x => x.OnCellEdit, EventCallback.Factory.Create<DataGridCellEdit>(this, e => edits.Add(e)));
            p.Add(x => x.Labels, new DataGridLabels { UndoAnnouncement = (h, t) => $"Undid {h}: {t}", RedoAnnouncement = (h, t) => $"Redid {h}: {t}" });
        });
        DataCell(cut, 0, 2).FocusIn(new FocusEventArgs());
        DataCell(cut, 0, 2).KeyDown(Key("F2"));
        var editor = cut.Find(".data-grid-cell-editor");
        editor.Input("31");
        editor.KeyDown(Key("Enter"));
        Assert.Single(edits);
        DataCell(cut, 0, 2).KeyDown(Key("z", ctrl: true));
        Assert.Equal(2, edits.Count);
        Assert.Equal(30d, Convert.ToDouble(edits[1].Value));
        Assert.Equal(31d, Convert.ToDouble(edits[1].Previous));
        Assert.StartsWith("Undid Age", Status(cut));
        DataCell(cut, 0, 2).KeyDown(Key("z", ctrl: true, shift: true));
        Assert.Equal(3, edits.Count);
        Assert.Equal(31d, Convert.ToDouble(edits[2].Value));
        Assert.StartsWith("Redid Age", Status(cut));
    }

    [Fact]
    public void Section_8_110_Page_Keys_Move_Ten_Rows_And_Clamp()
    {
        var many = Enumerable.Range(0, 25).Select(i => R(("name", $"Item {i}"), ("city", "x"), ("age", i))).ToList();
        var cut = Render(rows: many);
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        cut.Find(".data-table").KeyDown(Key("PageDown"));
        Assert.Equal("0", DataCell(cut, 10, 0).GetAttribute("tabindex"));
        cut.Find(".data-table").KeyDown(Key("PageDown"));
        cut.Find(".data-table").KeyDown(Key("PageDown"));
        Assert.Equal("0", DataCell(cut, 24, 0).GetAttribute("tabindex"));
    }

    [Fact]
    public void Section_8_111_Type_Ahead_Moves_To_The_Next_Row_Whose_First_Cell_Starts_With_The_Letters()
    {
        var cut = Render();
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        cut.Find(".data-table").KeyDown(Key("b"));
        Assert.Equal("0", DataCell(cut, 2, 0).GetAttribute("tabindex"));
        cut.Find(".data-table").KeyDown(Key("r"));
        Assert.Equal("0", DataCell(cut, 3, 0).GetAttribute("tabindex"));
    }

    [Fact]
    public void Section_8_112_Right_To_Left_Swaps_The_Horizontal_Arrows()
    {
        var cut = Render(p => p.Add(x => x.Direction, "rtl"));
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        cut.Find(".data-table").KeyDown(Key("ArrowLeft"));
        Assert.Equal("0", DataCell(cut, 0, 1).GetAttribute("tabindex"));
        cut.Find(".data-table").KeyDown(Key("ArrowRight"));
        Assert.Equal("0", DataCell(cut, 0, 0).GetAttribute("tabindex"));
    }

    [Fact]
    public void Section_8_113_Pagination_Label_Makes_The_Pager_A_Nav_Landmark()
    {
        var plain = Render(p => p.Add(x => x.PageSize, 2));
        Assert.Null(plain.FindAll("nav.data-grid-pagination").FirstOrDefault());
        Assert.NotNull(plain.Find("div.data-grid-pagination"));
        var labelled = Render(p => { p.Add(x => x.PageSize, 2); p.Add(x => x.Labels, new DataGridLabels { Pagination = "Pages", PreviousPage = "Previous", NextPage = "Next" }); });
        var nav = labelled.Find("nav.data-grid-pagination");
        Assert.Equal("Pages", nav.GetAttribute("aria-label"));
        Assert.Equal(2, nav.QuerySelectorAll("button").Length);
    }
}
