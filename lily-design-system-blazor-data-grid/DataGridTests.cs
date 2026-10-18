// DataGrid tests — one or more [Fact]s per spec/index.md §8 acceptance clause, mirroring the
// canonical Svelte suite's §8 numbering (DataGrid.test.ts). Selectors are read from the actual
// rendered markup (DataGrid.razor / the headless DataTable family), not guessed.
//
// What Blazor cannot do (no key-event target, no conditional preventDefault, no pointer capture,
// no File objects) is not tested here; spec/index.md § Blazor idioms lists each deviation.

using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AngleSharp.Dom;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class DataGridTests : TestContext
{
    private static DataGridRow R(params (string Key, object? Value)[] pairs)
        => new(pairs.Select(p => new KeyValuePair<string, object?>(p.Key, p.Value)));

    private static readonly IReadOnlyList<DataGridColumn> Columns = new[]
    {
        new DataGridColumn { Id = "name", Header = "Name", Sortable = true, Resizable = true },
        new DataGridColumn { Id = "email", Header = "Email", Hidable = true },
    };

    private static readonly IReadOnlyList<DataGridRow> Rows = new[]
    {
        R(("name", "Bob"), ("email", "bob@example.com")),
        R(("name", "Alice"), ("email", "alice@example.com")),
    };

    private static readonly DataGridLabels Labels = new()
    {
        Search = "Search rows",
        ColumnVisibility = "Columns",
        ColumnVisibilityOption = header => $"Show {header}",
        ResizeHandle = header => $"Resize {header}",
        SelectAll = "Select all rows",
        SelectionColumn = "Select",
        SelectRow = rowLabel => $"Select {rowLabel}",
        PreviousPage = "Previous page",
        NextPage = "Next page",
        PageStatus = (page, pages, rows) => $"Page {page} of {pages} ({rows})",
        PageAnnouncement = (page, pages) => $"Page {page} of {pages}",
        SortAnnouncement = (header, direction) => $"{header} sorted {direction.ToString().ToLowerInvariant()}",
        FilterAnnouncement = (matches, total) => $"{matches} of {total} rows match",
        SelectionAnnouncement = count => $"{count} selected",
    };

    public DataGridTests()
    {
        // bUnit JSInterop defaults to Strict; relax so the eval-based focus call does not throw during render.
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
    }

    private IRenderedComponent<DataGrid> Render(
        IReadOnlyList<DataGridColumn>? columns = null,
        IReadOnlyList<DataGridRow>? rows = null,
        Action<ComponentParameterCollectionBuilder<DataGrid>>? configure = null)
        => RenderComponent<DataGrid>(p =>
        {
            p.Add(x => x.Label, "Users");
            p.Add(x => x.Columns, columns ?? Columns);
            p.Add(x => x.Rows, rows ?? Rows);
            configure?.Invoke(p);
        });

    private static IReadOnlyList<IElement> BodyRows(IRenderedComponent<DataGrid> cut) => cut.FindAll(".data-table-body .data-table-row").Where(r => !r.ClassList.Contains("data-grid-spacer")).ToList();
    private static IReadOnlyList<IElement> Tabbable(IRenderedComponent<DataGrid> cut) => cut.FindAll(".data-table-th[tabindex='0'], .data-table-td[tabindex='0']");
    private static IElement DataCell(IRenderedComponent<DataGrid> cut, int row, int col) => cut.Find($".data-table-body [data-row='{row}'][data-col='{col}']");
    private static string Text(IElement el) => el.TextContent.Trim();
    private static string Status(IRenderedComponent<DataGrid> cut) => cut.Find(".data-grid-status").TextContent;
    private static KeyboardEventArgs Key(string key, bool alt = false, bool ctrl = false, bool shift = false) => new() { Key = key, AltKey = alt, CtrlKey = ctrl, ShiftKey = shift };
    private static void Press(IElement el, string key, bool alt = false, bool ctrl = false) => el.KeyDown(Key(key, alt, ctrl));

    // ---- Markup (§8.1) ----

    [Fact]
    public void Section_8_1_Renders_A_DataGrid_Root_Wrapping_A_Labelled_Grid()
    {
        var cut = Render();
        Assert.NotNull(cut.Find("div.data-grid"));
        var grid = cut.Find("table.data-table");
        Assert.Equal("grid", grid.GetAttribute("role"));
        Assert.Equal("Users", grid.GetAttribute("aria-label"));
        Assert.Equal(2, cut.FindAll(".data-table-head .data-table-th").Count);
        Assert.Equal(2, BodyRows(cut).Count);
        Assert.Equal("polite", cut.Find(".data-grid-status").GetAttribute("aria-live"));
    }

    [Fact]
    public void Section_8_1_Caption_And_Extra_Attributes_And_Class_Land_On_The_Root()
    {
        var cut = Render(configure: p =>
        {
            p.Add(x => x.Caption, "All users");
            p.Add(x => x.CssClass, "mine");
            p.AddUnmatched("data-testid", "g");
        });
        Assert.Equal("All users", Text(cut.Find("caption")));
        Assert.Equal("data-grid mine", cut.Find("div.data-grid").GetAttribute("class"));
        Assert.Equal("g", cut.Find("div.data-grid").GetAttribute("data-testid"));
    }

    // ---- Sorting (§8.2, §8.3) ----

    [Fact]
    public void Section_8_2_A_Sortable_Column_Cycles_Ascending_Descending_None_Updating_AriaSort()
    {
        var cut = Render(configure: p => p.Add(x => x.Labels, Labels));
        var th = () => cut.Find(".data-table-head .data-table-th[data-col='0']");
        Assert.Equal("none", th().GetAttribute("aria-sort"));
        cut.Find(".data-grid-sort-button").Click();
        Assert.Equal("ascending", th().GetAttribute("aria-sort"));
        cut.Find(".data-grid-sort-button").Click();
        Assert.Equal("descending", th().GetAttribute("aria-sort"));
        cut.Find(".data-grid-sort-button").Click();
        Assert.Equal("none", th().GetAttribute("aria-sort"));
    }

    [Fact]
    public void Section_8_2_A_NonSortable_Column_Never_Carries_AriaSort()
    {
        var cut = Render();
        Assert.Null(cut.Find(".data-table-head .data-table-th[data-col='1']").GetAttribute("aria-sort"));
    }

    [Fact]
    public void Section_8_3_Ascending_Sort_Reorders_Body_Rows_By_The_Active_Column()
    {
        var cut = Render();
        cut.Find(".data-grid-sort-button").Click();
        Assert.Equal(new[] { "Alice", "Bob" }, BodyRows(cut).Select(r => Text(r.QuerySelector("[data-col='0']")!)).ToArray());
        cut.Find(".data-grid-sort-button").Click();
        Assert.Equal(new[] { "Bob", "Alice" }, BodyRows(cut).Select(r => Text(r.QuerySelector("[data-col='0']")!)).ToArray());
    }

    [Fact]
    public void Section_8_3_Missing_Values_Sort_Last_In_Both_Directions()
    {
        var rows = new[] { R(("name", null)), R(("name", "B")), R(("name", "A")) };
        foreach (var direction in new[] { DataGridSortDirection.Ascending, DataGridSortDirection.Descending })
        {
            var cut = Render(rows: rows, configure: p => p.Add(x => x.Sort, new DataGridSort("name", direction)));
            Assert.Equal("", Text(DataCell(cut, 2, 0)));
        }
    }

    [Fact]
    public void Section_8_24_A_Columns_Compare_Orders_The_Sort()
    {
        var columns = new[] { new DataGridColumn { Id = "n", Header = "N", Sortable = true, Compare = (a, b) => ((string)b!).Length - ((string)a!).Length } };
        var rows = new[] { R(("n", "aaa")), R(("n", "a")), R(("n", "aa")) };
        var cut = Render(columns, rows, p => p.Add(x => x.Sort, new DataGridSort("n", DataGridSortDirection.Ascending)));
        Assert.Equal(new[] { "aaa", "aa", "a" }, Enumerable.Range(0, 3).Select(i => Text(DataCell(cut, i, 0))).ToArray());
    }

    // ---- Filtering (§8.4) ----

    [Fact]
    public void Section_8_4_Filters_Rows_By_Case_Insensitive_Substring_And_Announces()
    {
        var cut = Render(configure: p => p.Add(x => x.Labels, Labels));
        cut.Find(".data-grid-search").Input("ALI");
        Assert.Single(BodyRows(cut));
        Assert.Equal("1 of 2 rows match", Status(cut));
    }

    [Fact]
    public void Section_8_4_A_Filterable_False_Column_Is_Not_Searched()
    {
        var columns = new[] { new DataGridColumn { Id = "a", Header = "A" }, new DataGridColumn { Id = "b", Header = "B", Filterable = false } };
        var rows = new[] { R(("a", "x"), ("b", "needle")) };
        var cut = Render(columns, rows, p => p.Add(x => x.Labels, Labels));
        cut.Find(".data-grid-search").Input("needle");
        Assert.Empty(BodyRows(cut));
    }

    // ---- Selection (§8.5–§8.7) ----

    [Fact]
    public void Section_8_5_Single_Selection_Renders_Radios_And_Reports_The_Id()
    {
        IReadOnlyList<string> selected = new List<string>();
        var cut = Render(configure: p =>
        {
            p.Add(x => x.SelectionMode, DataGridSelectionMode.Single);
            p.Add(x => x.Labels, Labels);
            p.Add(x => x.SelectedChanged, EventCallback.Factory.Create<IReadOnlyList<string>>(this, v => selected = v));
        });
        var radios = cut.FindAll("input[type='radio']");
        Assert.Equal(2, radios.Count);
        radios[0].Click();
        Assert.Equal(new[] { "0" }, selected.ToArray());
        cut.FindAll("input[type='radio']")[1].Click();
        Assert.Equal(new[] { "1" }, selected.ToArray());
        Assert.Equal("1 selected", Status(cut));
    }

    [Fact]
    public void Section_8_6_Multiple_Selection_Ctrl_Click_Toggles_And_Select_All_Reflects_State()
    {
        IReadOnlyList<string> selected = new List<string>();
        var cut = Render(configure: p =>
        {
            p.Add(x => x.SelectionMode, DataGridSelectionMode.Multiple);
            p.Add(x => x.Labels, Labels);
            p.Add(x => x.SelectedChanged, EventCallback.Factory.Create<IReadOnlyList<string>>(this, v => selected = v));
        });
        var boxes = () => cut.FindAll(".data-table-body input[type='checkbox']");
        boxes()[0].Click();
        Assert.Equal(new[] { "0" }, selected.ToArray());
        boxes()[1].Click(new MouseEventArgs { CtrlKey = true });
        Assert.Equal(new[] { "0", "1" }, selected.ToArray());
        Assert.True(cut.Find("input[aria-label='Select all rows']").HasAttribute("checked"));
        cut.Find("input[aria-label='Select all rows']").Click();
        Assert.Empty(selected);
    }

    [Fact]
    public void Section_8_6_Shift_Click_Selects_The_Range()
    {
        IReadOnlyList<string> selected = new List<string>();
        var rows = Enumerable.Range(0, 4).Select(i => R(("name", $"R{i}"))).ToList();
        var cut = Render(new[] { new DataGridColumn { Id = "name", Header = "Name" } }, rows, p =>
        {
            p.Add(x => x.SelectionMode, DataGridSelectionMode.Multiple);
            p.Add(x => x.SelectedChanged, EventCallback.Factory.Create<IReadOnlyList<string>>(this, v => selected = v));
        });
        var boxes = () => cut.FindAll(".data-table-body input[type='checkbox']");
        boxes()[0].Click();
        boxes()[2].Click(new MouseEventArgs { ShiftKey = true });
        Assert.Equal(new[] { "0", "1", "2" }, selected.OrderBy(x => x).ToArray());
    }

    [Fact]
    public void Section_8_7_Selected_Is_Bindable_And_Rows_Report_AriaSelected()
    {
        var cut = Render(configure: p =>
        {
            p.Add(x => x.SelectionMode, DataGridSelectionMode.Multiple);
            p.Add(x => x.Selected, new[] { "1" });
        });
        Assert.Equal("true", BodyRows(cut)[1].GetAttribute("aria-selected"));
        Assert.Equal("false", BodyRows(cut)[0].GetAttribute("aria-selected"));
    }

    // ---- Resize (§8.8), visibility (§8.9) ----

    [Fact]
    public void Section_8_8_Arrow_Keys_On_A_Focused_Resize_Handle_Adjust_The_Width()
    {
        var cut = Render(configure: p => p.Add(x => x.Labels, Labels));
        var handle = () => cut.Find("[role='separator']");
        Assert.Equal("120", handle().GetAttribute("aria-valuenow"));
        handle().KeyDown(Key("ArrowRight"));
        Assert.Equal("136", handle().GetAttribute("aria-valuenow"));
        handle().KeyDown(Key("ArrowLeft"));
        handle().KeyDown(Key("ArrowLeft"));
        Assert.Equal("104", handle().GetAttribute("aria-valuenow"));
        Assert.Contains("width:104px", cut.Find(".data-table-head .data-table-th[data-col='0']").GetAttribute("style"));
    }

    [Fact]
    public void Section_8_23_The_Resize_Handle_Exposes_Its_Minimum_Width()
    {
        var cut = Render(configure: p => p.Add(x => x.Labels, Labels));
        Assert.Equal("40", cut.Find("[role='separator']").GetAttribute("aria-valuemin"));
        Assert.Equal("Resize Name", cut.Find("[role='separator']").GetAttribute("aria-label"));
    }

    [Fact]
    public void Section_8_9_Hiding_A_Column_Removes_Its_Header_And_Every_Cell()
    {
        var cut = Render(configure: p => p.Add(x => x.Labels, Labels));
        cut.Find("input[type='checkbox']").Change(false);
        Assert.Single(cut.FindAll(".data-table-head .data-table-th"));
        Assert.All(BodyRows(cut), r => Assert.Single(r.QuerySelectorAll(".data-table-td")));
    }

    // ---- Pagination (§8.10, §8.21, §8.22) ----

    private static IReadOnlyList<DataGridRow> ManyRows(int n) => Enumerable.Range(0, n).Select(i => R(("name", $"Row {i:D2}"), ("email", $"r{i}@x"))).ToList();

    [Fact]
    public void Section_8_10_PageSize_Renders_A_Pagination_Footer_And_Slices_The_Rows()
    {
        var cut = Render(rows: ManyRows(5), configure: p =>
        {
            p.Add(x => x.PageSize, 2);
            p.Add(x => x.Labels, Labels);
        });
        Assert.Equal(2, BodyRows(cut).Count);
        Assert.Equal("Page 1 of 3 (5)", Text(cut.Find(".data-grid-page-status")));
        Assert.True(cut.Find(".data-grid-page-previous").HasAttribute("disabled"));
        cut.Find(".data-grid-page-next").Click();
        Assert.Equal("Row 02", Text(DataCell(cut, 0, 0)));
        cut.Find(".data-grid-page-next").Click();
        Assert.Single(BodyRows(cut));
        Assert.True(cut.Find(".data-grid-page-next").HasAttribute("disabled"));
    }

    [Fact]
    public void Section_8_21_A_Paginated_Grid_Exposes_AriaRowcount_And_RowIndex()
    {
        var cut = Render(rows: ManyRows(5), configure: p => p.Add(x => x.PageSize, 2));
        Assert.Equal("6", cut.Find("table").GetAttribute("aria-rowcount"));
        Assert.Equal("1", cut.Find(".data-table-head .data-table-row").GetAttribute("aria-rowindex"));
        Assert.Equal("2", BodyRows(cut)[0].GetAttribute("aria-rowindex"));
    }

    [Fact]
    public void Section_8_22_Changing_Page_Announces()
    {
        var cut = Render(rows: ManyRows(5), configure: p =>
        {
            p.Add(x => x.PageSize, 2);
            p.Add(x => x.Labels, Labels);
        });
        cut.Find(".data-grid-page-next").Click();
        Assert.Equal("Page 2 of 3", Status(cut));
    }

    [Fact]
    public void Section_8_10_Filtering_Resets_To_Page_One()
    {
        var cut = Render(rows: ManyRows(6), configure: p =>
        {
            p.Add(x => x.PageSize, 2);
            p.Add(x => x.Labels, Labels);
            p.Add(x => x.Page, 3);
        });
        cut.Find(".data-grid-search").Input("Row 0");
        Assert.Equal("Page 1 of 3 (6)", Text(cut.Find(".data-grid-page-status")));
    }

    // ---- Roving-tabindex keyboard navigation (§8.11, §8.12, §8.20) ----

    [Fact]
    public void Section_8_11_Exactly_One_Cell_Carries_Tabindex_0_And_Arrows_Move_It_And_Clamp()
    {
        var cut = Render();
        Assert.Single(Tabbable(cut));
        Assert.Equal("-1", Tabbable(cut)[0].GetAttribute("data-row"));
        var start = Tabbable(cut)[0];
        Press(start, "ArrowDown");
        Assert.Equal("0", Tabbable(cut).Single().GetAttribute("data-row"));
        Press(Tabbable(cut).Single(), "ArrowRight");
        Assert.Equal("1", Tabbable(cut).Single().GetAttribute("data-col"));
        Press(Tabbable(cut).Single(), "ArrowRight");
        Assert.Equal("1", Tabbable(cut).Single().GetAttribute("data-col"));
        Press(Tabbable(cut).Single(), "ArrowUp");
        Press(Tabbable(cut).Single(), "ArrowUp");
        Assert.Equal("-1", Tabbable(cut).Single().GetAttribute("data-row"));
    }

    [Fact]
    public void Section_8_12_Home_End_And_Ctrl_Home_End_Jump()
    {
        var cut = Render();
        Press(Tabbable(cut)[0], "ArrowDown");
        Press(Tabbable(cut).Single(), "End");
        Assert.Equal("1", Tabbable(cut).Single().GetAttribute("data-col"));
        Press(Tabbable(cut).Single(), "Home");
        Assert.Equal("0", Tabbable(cut).Single().GetAttribute("data-col"));
        Press(Tabbable(cut).Single(), "End", ctrl: true);
        Assert.Equal("1", Tabbable(cut).Single().GetAttribute("data-row"));
        Press(Tabbable(cut).Single(), "Home", ctrl: true);
        Assert.Equal("-1", Tabbable(cut).Single().GetAttribute("data-row"));
    }

    [Fact]
    public void Section_8_12_Enter_On_A_Sortable_Header_Sorts_And_Space_On_A_Row_Selects_It()
    {
        var cut = Render(configure: p =>
        {
            p.Add(x => x.SelectionMode, DataGridSelectionMode.Single);
            p.Add(x => x.Labels, Labels);
        });
        Press(Tabbable(cut).Single(), "ArrowRight");
        Press(Tabbable(cut).Single(), "Enter");
        Assert.Equal("Name sorted ascending", Status(cut));
        Press(Tabbable(cut).Single(), "ArrowLeft");
        Press(Tabbable(cut).Single(), "ArrowDown");
        Press(Tabbable(cut).Single(), " ");
        Assert.True(cut.FindAll(".data-table-body input[type='radio']")[0].HasAttribute("checked"));
    }

    [Fact]
    public void Section_8_20_Pointer_Focus_On_A_Cell_Moves_The_Roving_Position_There()
    {
        var cut = Render();
        DataCell(cut, 1, 1).FocusIn(new FocusEventArgs());
        Assert.Equal("1", Tabbable(cut).Single().GetAttribute("data-row"));
        Assert.Equal("1", Tabbable(cut).Single().GetAttribute("data-col"));
    }

    [Fact]
    public void Section_8_20_Filtering_Away_The_Focused_Row_Leaves_Exactly_One_Tabbable_Cell()
    {
        var cut = Render(configure: p => p.Add(x => x.Labels, Labels));
        DataCell(cut, 1, 0).FocusIn(new FocusEventArgs());
        cut.Find(".data-grid-search").Input("bob");
        Assert.Single(Tabbable(cut));
    }

    [Fact]
    public void Section_8_20_Hiding_The_Focused_Column_Leaves_Exactly_One_Tabbable_Cell()
    {
        var cut = Render(configure: p => p.Add(x => x.Labels, Labels));
        DataCell(cut, 0, 1).FocusIn(new FocusEventArgs());
        cut.Find("input[type='checkbox']").Change(false);
        Assert.Single(Tabbable(cut));
    }

    // ---- Persistence (§8.14) ----

    [Fact]
    public void Section_8_14_StorageKey_Persists_Widths_Hidden_Columns_And_Sort_Never_Rows_Or_Selection()
    {
        var writes = new List<string>();
        JSInterop.SetupVoid("eval", i => { var s = i.Arguments[0]?.ToString() ?? ""; if (s.Contains("setItem")) writes.Add(s); return true; }).SetVoidResult();
        var cut = Render(configure: p =>
        {
            p.Add(x => x.StorageKey, "lily-dg-1");
            p.Add(x => x.Labels, Labels);
            p.Add(x => x.SelectionMode, DataGridSelectionMode.Single);
        });
        cut.Find(".data-grid-sort-button").Click();
        cut.Find("[role='separator']").KeyDown(Key("ArrowRight"));
        Assert.NotEmpty(writes);
        var last = writes.Last();
        Assert.Contains("columnWidths", last);
        Assert.Contains("ascending", last);
        Assert.DoesNotContain("selected", last);
        Assert.DoesNotContain("bob@example.com", last);
    }

    private static readonly IReadOnlyList<DataGridColumn> MoneyColumns = new[]
    {
        new DataGridColumn { Id = "name", Header = "Name", Filterable = true },
        new DataGridColumn { Id = "amount", Header = "Amount", Type = DataGridCellType.Number },
    };

    private static readonly IReadOnlyList<DataGridRow> Money = new[]
    {
        R(("name", "a"), ("amount", 10)),
        R(("name", "ab"), ("amount", 20)),
        R(("name", "abc"), ("amount", null)),
        R(("name", "abcd"), ("amount", "")),
        R(("name", "z"), ("amount", 1000)),
    };

    [Fact]
    public void The_Footers_Total_Covers_Every_Filtered_Row_Not_Only_The_Current_Page()
    {
        RenderFragment<DataGridFooterContext> footer = ctx => b =>
        {
            b.OpenElement(0, "tr");
            b.OpenElement(1, "td"); b.AddAttribute(2, "class", "f-page"); b.AddContent(3, ctx.Rows.Count); b.CloseElement();
            b.OpenElement(4, "td"); b.AddAttribute(5, "class", "f-all"); b.AddContent(6, ctx.AllRows!.Count); b.CloseElement();
            b.OpenElement(7, "td"); b.AddAttribute(8, "class", "f-sum"); b.AddContent(9, ctx.Total("amount", DataGridAggregate.Sum)); b.CloseElement();
            b.CloseElement();
        };
        var cut = Render(MoneyColumns, Money, p =>
        {
            p.Add(x => x.PageSize, 2);
            p.Add(x => x.Footer, footer);
            p.Add(x => x.Filter, "a");
            p.Add(x => x.Labels, new DataGridLabels { Pagination = "Pages", PageStatus = (a, b, c) => $"{a}/{b}" });
        });
        Assert.Equal("2", cut.Find(".f-page").TextContent);
        Assert.Equal("4", cut.Find(".f-all").TextContent);
        Assert.Equal("30", cut.Find(".f-sum").TextContent);
    }

    [Fact]
    public void A_Pinned_Column_Gets_Pinned_Offset_From_The_Widths_Of_The_Pinned_Columns_Before_It()
    {
        var cols = new[]
        {
            new DataGridColumn { Id = "a", Header = "A", Pinned = DataGridPinned.Start, Width = 100 },
            new DataGridColumn { Id = "b", Header = "B", Pinned = DataGridPinned.Start, Width = 50 },
            new DataGridColumn { Id = "c", Header = "C" },
        };
        var cut = Render(cols, new[] { R(("a", 1), ("b", 2), ("c", 3)) });
        var ths = cut.FindAll("thead th");
        Assert.Contains("--data-grid-pinned-offset:0px", ths[0].GetAttribute("style"));
        Assert.Contains("--data-grid-pinned-offset:100px", ths[1].GetAttribute("style"));
        Assert.DoesNotContain("--data-grid-pinned-offset", ths[2].GetAttribute("style") ?? "");
    }

    [Fact]
    public void StorageKey_Remembers_The_Column_Order()
    {
        var writes = new List<string>();
        JSInterop.SetupVoid("eval", i => { var s = i.Arguments[0]?.ToString() ?? ""; if (s.Contains("setItem")) writes.Add(s); return true; }).SetVoidResult();
        Render(configure: p =>
        {
            p.Add(x => x.StorageKey, "lily-dg-order");
            p.Add(x => x.ColumnOrder, new[] { "email", "name" });
        });
        Assert.Contains("columnOrder", writes.Last());
        Assert.Contains("email", writes.Last());

        JSInterop.Setup<string?>("eval", i => (i.Arguments[0]?.ToString() ?? "").Contains("getItem")).SetResult("{\"columnOrder\":[\"email\",\"name\"]}");
        var restored = Render(configure: p => p.Add(x => x.StorageKey, "lily-dg-order"));
        Assert.Equal("bob@example.com", Text(BodyRows(restored)[0].QuerySelectorAll(".data-table-td")[0]));
    }

    [Fact]
    public void Section_8_14_With_No_StorageKey_Nothing_Is_Written()
    {
        var touched = false;
        JSInterop.SetupVoid("eval", i => { if ((i.Arguments[0]?.ToString() ?? "").Contains("localStorage")) touched = true; return true; }).SetVoidResult();
        var cut = Render(configure: p => p.Add(x => x.Labels, Labels));
        cut.Find(".data-grid-sort-button").Click();
        Assert.False(touched);
    }

    // ---- Row identity (§8.17) ----

    [Fact]
    public void Section_8_17_Default_Ids_Come_From_The_Rows_Position_So_Page_Two_Does_Not_Reuse_Page_One()
    {
        IReadOnlyList<string> selected = new List<string>();
        var cut = Render(rows: ManyRows(4), configure: p =>
        {
            p.Add(x => x.PageSize, 2);
            p.Add(x => x.SelectionMode, DataGridSelectionMode.Single);
            p.Add(x => x.SelectedChanged, EventCallback.Factory.Create<IReadOnlyList<string>>(this, v => selected = v));
            p.Add(x => x.Labels, Labels);
        });
        cut.Find(".data-grid-page-next").Click();
        cut.FindAll(".data-table-body input[type='radio']")[0].Click();
        Assert.Equal(new[] { "2" }, selected.ToArray());
    }

    [Fact]
    public void Section_8_17_A_Row_Keeps_Its_Id_When_Sorting_Moves_It()
    {
        IReadOnlyList<string> selected = new List<string>();
        var cut = Render(configure: p =>
        {
            p.Add(x => x.SelectionMode, DataGridSelectionMode.Single);
            p.Add(x => x.SelectedChanged, EventCallback.Factory.Create<IReadOnlyList<string>>(this, v => selected = v));
            p.Add(x => x.Sort, new DataGridSort("name", DataGridSortDirection.Ascending));
        });
        cut.FindAll(".data-table-body input[type='radio']")[0].Click();
        Assert.Equal(new[] { "1" }, selected.ToArray()); // Alice is second in `rows`
    }

    [Fact]
    public void Section_8_17_A_Custom_RowId_Is_Used()
    {
        IReadOnlyList<string> selected = new List<string>();
        var cut = Render(configure: p =>
        {
            p.Add(x => x.RowId, (row, _) => (string)row["email"]!);
            p.Add(x => x.SelectionMode, DataGridSelectionMode.Single);
            p.Add(x => x.SelectedChanged, EventCallback.Factory.Create<IReadOnlyList<string>>(this, v => selected = v));
        });
        cut.FindAll(".data-table-body input[type='radio']")[0].Click();
        Assert.Equal(new[] { "bob@example.com" }, selected.ToArray());
    }

    // ---- Hot path (§8.18) ----

    [Fact]
    public void Section_8_18_Sorting_And_Filtering_Read_Each_Cell_Once()
    {
        var reads = 0;
        var columns = new[] { new DataGridColumn { Id = "name", Header = "Name", Sortable = true, Accessor = row => { reads++; return row["name"]; } } };
        var cut = Render(columns, ManyRows(32), p => p.Add(x => x.Labels, Labels));
        reads = 0;
        cut.Find(".data-grid-sort-button").Click();
        cut.Find(".data-grid-search").Input("r");
        cut.Find(".data-grid-search").Input("ro");
        Assert.True(reads <= 32 * 2, $"read {reads} times");
    }

    // ---- Cell render fragment, header cell (§8.19, §8.30) ----

    [Fact]
    public void Section_8_19_A_Cell_Fragment_Renders_Each_Body_Cell_With_Value_Formatted_Text_And_Row()
    {
        var columns = new[]
        {
            new DataGridColumn { Id = "name", Header = "Name" },
            new DataGridColumn
            {
                Id = "email", Header = "Email", Format = (v, _) => ((string)v!).ToUpperInvariant(),
                Cell = ctx => builder => { builder.OpenElement(0, "a"); builder.AddAttribute(1, "class", "test-cell"); builder.AddAttribute(2, "href", $"mailto:{ctx.Value}"); builder.AddContent(3, $"{ctx.Formatted} ({ctx.Row["name"]})"); builder.CloseElement(); },
            },
        };
        var cut = Render(columns);
        var links = cut.FindAll(".test-cell");
        Assert.Equal(2, links.Count);
        Assert.Equal("mailto:bob@example.com", links[0].GetAttribute("href"));
        Assert.Equal("BOB@EXAMPLE.COM (Bob)", links[0].TextContent);
    }

    [Fact]
    public void Section_8_30_HeaderCell_Replaces_The_Header_Text_Inside_The_Sort_Button()
    {
        var columns = new[]
        {
            new DataGridColumn
            {
                Id = "name", Header = "Name", Sortable = true, Hidable = true,
                HeaderCell = column => builder => { builder.OpenElement(0, "span"); builder.AddAttribute(1, "class", "h-icon"); builder.AddContent(2, $"★ {column.Header}"); builder.CloseElement(); },
            },
        };
        var cut = Render(columns, configure: p => p.Add(x => x.Labels, Labels));
        Assert.Equal("★ Name", cut.Find(".data-grid-sort-button .h-icon").TextContent);
        Assert.NotNull(cut.Find("input[type='checkbox']"));
    }

    // ---- Row header, cell hooks (§8.28, §8.29) ----

    [Fact]
    public void Section_8_28_A_RowHeader_Column_Renders_Th_Scope_Row_In_The_Body()
    {
        var columns = new[] { new DataGridColumn { Id = "name", Header = "Name", RowHeader = true }, Columns[1] };
        var cut = Render(columns);
        var th = cut.Find(".data-table-body th");
        Assert.Equal("row", th.GetAttribute("scope"));
        Assert.Equal("rowheader", th.GetAttribute("role"));
    }

    [Fact]
    public void Section_8_29_Align_CellClass_And_CellAttrs_Land_On_The_Cell()
    {
        var columns = new[]
        {
            new DataGridColumn
            {
                Id = "name", Header = "Name", Align = DataGridAlign.End, CellClass = _ => "mine",
                CellAttrs = ctx => new Dictionary<string, object> { ["data-name"] = (string)ctx.Value! },
            },
        };
        var cut = Render(columns);
        var cell = DataCell(cut, 0, 0);
        Assert.Equal("end", cell.GetAttribute("data-align"));
        Assert.Contains("text-align:end", cell.GetAttribute("style"));
        Assert.Contains("mine", cell.GetAttribute("class"));
        Assert.Equal("Bob", cell.GetAttribute("data-name"));
    }

    // ---- Table mode (§8.27), empty / footer / busy (§8.31, §8.32), scroll region (§8.33) ----

    [Fact]
    public void Section_8_27_Table_Mode_Is_A_Plain_Table_With_No_Roving_Tab_Stop()
    {
        var cut = Render(configure: p =>
        {
            p.Add(x => x.Mode, DataGridMode.Table);
            p.Add(x => x.Labels, Labels);
        });
        Assert.Equal("table", cut.Find("table").GetAttribute("role"));
        Assert.All(cut.FindAll(".data-table-body .data-table-td"), c => { Assert.Equal("cell", c.GetAttribute("role")); Assert.False(c.HasAttribute("tabindex")); });
        Assert.False(cut.Find(".data-grid-sort-button").HasAttribute("tabindex"));
    }

    [Fact]
    public void Section_8_31_With_Nothing_To_Show_An_Empty_Fragment_Fills_One_Cell_Spanning_Every_Column()
    {
        RenderFragment empty = b => { b.OpenElement(0, "span"); b.AddAttribute(1, "class", "e-text"); b.AddContent(2, "Nobody here"); b.CloseElement(); };
        var cut = Render(rows: Array.Empty<DataGridRow>(), configure: p => p.Add(x => x.Empty, empty));
        var cell = cut.Find(".data-grid-empty");
        Assert.Equal("2", cell.GetAttribute("colspan"));
        Assert.Equal("Nobody here", cell.QuerySelector(".e-text")!.TextContent);
        Assert.Empty(Render(rows: Array.Empty<DataGridRow>()).FindAll(".data-grid-empty"));
    }

    [Fact]
    public void Section_8_32_A_Footer_Renders_In_A_Tfoot_And_Busy_Sets_AriaBusy()
    {
        RenderFragment<DataGridFooterContext> footer = ctx => b => { b.OpenElement(0, "tr"); b.AddAttribute(1, "class", "f-row"); b.OpenElement(2, "td"); b.AddContent(3, $"{ctx.Rows.Count} rows"); b.CloseElement(); b.CloseElement(); };
        var cut = Render(configure: p =>
        {
            p.Add(x => x.Footer, footer);
            p.Add(x => x.Busy, true);
        });
        Assert.Equal("2 rows", cut.Find("tfoot .f-row").TextContent);
        Assert.Equal("true", cut.Find("table").GetAttribute("aria-busy"));
    }

    [Fact]
    public void Section_8_33_The_Table_Sits_In_A_Named_Scroll_Region_Only_In_Table_Mode_Is_It_A_Tab_Stop()
    {
        var cut = Render();
        var region = cut.Find(".data-grid-scroll");
        Assert.Equal("region", region.GetAttribute("role"));
        Assert.Equal("Users", region.GetAttribute("aria-label"));
        Assert.False(region.HasAttribute("tabindex"));
        var table = Render(configure: p => p.Add(x => x.Mode, DataGridMode.Table));
        Assert.Equal("0", table.Find(".data-grid-scroll").GetAttribute("tabindex"));
        var bare = Render(configure: p => p.Add(x => x.Scroll, false));
        Assert.Empty(bare.FindAll(".data-grid-scroll"));
        Assert.NotNull(bare.Find("table"));
    }

    // ---- Row activation (§8.34) ----

    [Fact]
    public void Section_8_34_Enter_On_A_Body_Cell_And_A_Click_Activate_The_Row()
    {
        var activated = new List<string>();
        var cut = Render(configure: p => p.Add(x => x.OnRowActivate, EventCallback.Factory.Create<(DataGridRow Row, string Id)>(this, a => activated.Add(a.Id))));
        DataCell(cut, 1, 0).FocusIn(new FocusEventArgs());
        Press(Tabbable(cut).Single(), "Enter");
        Assert.Equal(new[] { "1" }, activated);
    }

    [Fact]
    public void Section_8_34_Without_A_Listener_Enter_Does_Not_Activate()
    {
        var cut = Render(configure: p => p.Add(x => x.SelectionMode, DataGridSelectionMode.None));
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        Press(Tabbable(cut).Single(), "Enter");
        Assert.Empty(cut.FindAll(".data-grid-cell-editor"));
    }

    // ---- Column reorder and pinning (§8.40–§8.46) ----

    private static readonly IReadOnlyList<DataGridColumn> MovableColumns = new[]
    {
        new DataGridColumn { Id = "a", Header = "A", Movable = true },
        new DataGridColumn { Id = "b", Header = "B", Movable = true },
        new DataGridColumn { Id = "c", Header = "C", Movable = true, Hidable = true },
    };

    private static readonly IReadOnlyList<DataGridRow> Rows3 = new[] { R(("a", "a1"), ("b", "b1"), ("c", "c1")) };

    [Fact]
    public void Section_8_41_Alt_ArrowRight_On_A_Movable_Header_Moves_The_Column_Reports_And_Announces()
    {
        IReadOnlyList<string> order = new List<string>();
        var cut = Render(MovableColumns, Rows3, p =>
        {
            p.Add(x => x.ColumnOrderChanged, EventCallback.Factory.Create<IReadOnlyList<string>>(this, v => order = v));
            p.Add(x => x.Labels, new DataGridLabels { ColumnMoveAnnouncement = (h, pos, n) => $"{h} is now column {pos} of {n}" });
        });
        Press(cut.Find(".data-table-head .data-table-th[data-col='0']"), "ArrowRight", alt: true);
        Assert.Equal(new[] { "b", "a", "c" }, order.ToArray());
        Assert.Equal(new[] { "B", "A", "C" }, cut.FindAll(".data-table-head .data-table-th").Select(Text).ToArray());
        Assert.Equal("A is now column 2 of 3", Status(cut));
        Assert.Equal("1", Tabbable(cut).Single().GetAttribute("data-col"));
    }

    [Fact]
    public void Section_8_42_A_NonMovable_Header_Ignores_Alt_Arrows()
    {
        var cut = Render(Columns, Rows, p => { });
        Press(cut.Find(".data-table-head .data-table-th[data-col='0']"), "ArrowRight", alt: true);
        Assert.Equal(new[] { "Name", "Email" }, cut.FindAll(".data-table-head .data-table-th").Select(Text).ToArray());
    }

    [Fact]
    public void Section_8_43_ColumnOrder_Seeds_The_Order_And_Unnamed_Columns_Follow()
    {
        var cut = Render(MovableColumns, Rows3, p => p.Add(x => x.ColumnOrder, new[] { "c", "a" }));
        Assert.Equal(new[] { "C", "A", "B" }, cut.FindAll(".data-table-head .data-table-th").Select(Text).ToArray());
    }

    [Fact]
    public void Section_8_44_Pinned_Columns_Mark_Header_And_Cells()
    {
        var columns = new[] { new DataGridColumn { Id = "a", Header = "A", Pinned = DataGridPinned.Start }, new DataGridColumn { Id = "b", Header = "B", Pinned = DataGridPinned.End } };
        var cut = Render(columns, new[] { R(("a", "x"), ("b", "y")) });
        Assert.Equal("start", cut.Find(".data-table-head .data-table-th[data-col='0']").GetAttribute("data-pinned"));
        Assert.Equal("end", DataCell(cut, 0, 1).GetAttribute("data-pinned"));
    }

    [Fact]
    public void Section_8_45_Hidden_Columns_Keep_Their_Place_When_Others_Move()
    {
        IReadOnlyList<string> order = new List<string>();
        var cut = Render(MovableColumns, Rows3, p =>
        {
            p.Add(x => x.Labels, Labels);
            p.Add(x => x.ColumnOrderChanged, EventCallback.Factory.Create<IReadOnlyList<string>>(this, v => order = v));
        });
        cut.Find("input[type='checkbox']").Change(false); // hide C
        cut.Find(".data-table-head .data-table-th[data-col='1']").FocusIn(new FocusEventArgs());
        Press(cut.Find(".data-table-head .data-table-th[data-col='1']"), "ArrowLeft", alt: true);
        Assert.Equal(new[] { "b", "a", "c" }, order.ToArray());
    }

    // ---- Cell editing (§8.47–§8.53) ----

    private static readonly IReadOnlyList<DataGridColumn> EditColumns = new[]
    {
        new DataGridColumn { Id = "name", Header = "Name", Editable = true },
        new DataGridColumn { Id = "age", Header = "Age", Editable = true, Editor = DataGridEditor.Number },
        new DataGridColumn { Id = "note", Header = "Note" },
    };

    private static readonly IReadOnlyList<DataGridRow> EditRows = new[] { R(("name", "Ann"), ("age", 30), ("note", "n")) };

    private IRenderedComponent<DataGrid> RenderEdit(List<DataGridCellEdit> edits, DataGridLabels? labels = null, IReadOnlyList<DataGridColumn>? columns = null, IReadOnlyList<DataGridRow>? rows = null)
        => Render(columns ?? EditColumns, rows ?? EditRows, p =>
        {
            p.Add(x => x.OnCellEdit, EventCallback.Factory.Create<DataGridCellEdit>(this, e => edits.Add(e)));
            if (labels is not null) p.Add(x => x.Labels, labels);
        });

    [Fact]
    public void Section_8_47_F2_Opens_An_Editor_And_Enter_Commits_Through_OnCellEdit()
    {
        var edits = new List<DataGridCellEdit>();
        var cut = RenderEdit(edits, new DataGridLabels { EditAnnouncement = (h, v) => $"{h} is now {v}" });
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        Press(DataCell(cut, 0, 0), "F2");
        var input = cut.Find("input.data-grid-cell-editor");
        Assert.Equal("Name", input.GetAttribute("aria-label"));
        Assert.Equal("Ann", input.GetAttribute("value"));
        input.Input("Bea");
        input.KeyDown(Key("Enter"));
        var edit = Assert.Single(edits);
        Assert.Equal(("0", "name", "Bea", "Ann"), (edit.RowId, edit.ColumnId, edit.Value, edit.Previous));
        Assert.Empty(cut.FindAll(".data-grid-cell-editor"));
        Assert.Equal("Name is now Bea", Status(cut));
    }

    [Fact]
    public void Section_8_48_Enter_On_An_Editable_Cell_Starts_Editing_Before_Row_Activation()
    {
        var activated = false;
        var cut = Render(EditColumns, EditRows, p => p.Add(x => x.OnRowActivate, EventCallback.Factory.Create<(DataGridRow Row, string Id)>(this, _ => activated = true)));
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        Press(DataCell(cut, 0, 0), "Enter");
        Assert.NotEmpty(cut.FindAll(".data-grid-cell-editor"));
        Assert.False(activated);
        cut.Find(".data-grid-cell-editor").KeyDown(Key("Escape"));
        DataCell(cut, 0, 2).FocusIn(new FocusEventArgs());
        Press(DataCell(cut, 0, 2), "F2");
        Assert.Empty(cut.FindAll(".data-grid-cell-editor"));
    }

    [Fact]
    public void Section_8_49_Escape_Cancels_Without_OnCellEdit_And_Announces()
    {
        var edits = new List<DataGridCellEdit>();
        var cut = RenderEdit(edits, new DataGridLabels { EditCancelAnnouncement = h => $"{h} edit cancelled" });
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        Press(DataCell(cut, 0, 0), "F2");
        var input = cut.Find(".data-grid-cell-editor");
        input.Input("Zed");
        input.KeyDown(Key("Escape"));
        Assert.Empty(edits);
        Assert.Equal("Name edit cancelled", Status(cut));
    }

    [Fact]
    public void Section_8_50_The_Number_Editor_Commits_A_Number_And_An_Unchanged_Value_Commits_Nothing()
    {
        var edits = new List<DataGridCellEdit>();
        var cut = RenderEdit(edits);
        DataCell(cut, 0, 1).FocusIn(new FocusEventArgs());
        Press(DataCell(cut, 0, 1), "F2");
        var input = cut.Find(".data-grid-cell-editor");
        Assert.Equal("number", input.GetAttribute("type"));
        input.Input("31");
        input.KeyDown(Key("Enter"));
        Assert.Equal(31d, Assert.Single(edits).Value);
        Press(DataCell(cut, 0, 1), "F2");
        cut.Find(".data-grid-cell-editor").KeyDown(Key("Enter"));
        Assert.Single(edits);
    }

    [Fact]
    public void Section_8_51_Validate_Refuses_A_Value_The_Cell_Stays_In_Edit_Mode()
    {
        var edits = new List<DataGridCellEdit>();
        var columns = new[] { new DataGridColumn { Id = "name", Header = "Name", Editable = true, Validate = (v, _) => (string?)v == "" ? "Required" : null } };
        var cut = RenderEdit(edits, new DataGridLabels { EditError = (h, m) => $"{h}: {m}" }, columns, new[] { R(("name", "Ann")) });
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        Press(DataCell(cut, 0, 0), "F2");
        var input = cut.Find(".data-grid-cell-editor");
        input.Input("");
        input.KeyDown(Key("Enter"));
        Assert.Empty(edits);
        Assert.Equal("true", cut.Find(".data-grid-cell-editor").GetAttribute("aria-invalid"));
        Assert.Equal("Required", Text(cut.Find(".data-grid-cell-error")));
        Assert.Equal("Name: Required", Status(cut));
    }

    [Fact]
    public void Section_8_52_Leaving_The_Editor_Commits_And_A_Double_Click_Starts_Editing()
    {
        var edits = new List<DataGridCellEdit>();
        var cut = RenderEdit(edits);
        DataCell(cut, 0, 0).DoubleClick();
        var input = cut.Find(".data-grid-cell-editor");
        input.Input("Cy");
        input.Blur();
        Assert.Equal("Cy", Assert.Single(edits).Value);
    }

    [Fact]
    public void Section_8_53_EditCell_Gates_An_Edit_Button_On_Editable_Cells()
    {
        Assert.Empty(Render(EditColumns, EditRows).FindAll(".data-grid-edit-button"));
        var cut = Render(EditColumns, EditRows, p => p.Add(x => x.Labels, new DataGridLabels { EditCell = (h, r) => $"Edit {h} of {r}" }));
        Assert.Equal(2, cut.FindAll(".data-grid-edit-button").Count);
        cut.Find("button[aria-label='Edit Name of Ann']").Click();
        Assert.NotEmpty(cut.FindAll(".data-grid-cell-editor"));
    }

    [Fact]
    public void Section_8_75_An_Input_Methods_Composing_Keys_Do_Not_Commit_Or_Cancel()
    {
        var edits = new List<DataGridCellEdit>();
        var cut = RenderEdit(edits);
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        Press(DataCell(cut, 0, 0), "F2");
        var input = cut.Find(".data-grid-cell-editor");
        input.Input("にほん");
        input.KeyDown(Key("Process"));
        Assert.Empty(edits);
        Assert.NotEmpty(cut.FindAll(".data-grid-cell-editor"));
        cut.Find(".data-grid-cell-editor").KeyDown(Key("Enter"));
        Assert.Equal("にほん", Assert.Single(edits).Value);
    }

    // ---- Virtualize (§8.54–§8.56) ----

    [Fact]
    public void Section_8_54_Virtualize_Renders_Only_The_Rows_In_View_With_Spacers_And_Aria()
    {
        var cut = Render(rows: ManyRows(200), configure: p => p.Add(x => x.Virtualize, new DataGridVirtualize(20, 100)));
        Assert.True(BodyRows(cut).Count < 20);
        Assert.NotEmpty(cut.FindAll(".data-grid-spacer"));
        Assert.Equal("201", cut.Find("[role='grid']").GetAttribute("aria-rowcount"));
        Assert.Equal("2", BodyRows(cut)[0].GetAttribute("aria-rowindex"));
        Assert.Contains("height:100px", cut.Find(".data-grid-scroll").GetAttribute("style"));
    }

    [Fact]
    public async Task Section_8_55_Scrolling_Moves_The_Window()
    {
        JSInterop.Setup<double>("eval", i => (i.Arguments[0]?.ToString() ?? "").Contains("scrollTop ??")).SetResult(1000);
        var cut = Render(rows: ManyRows(200), configure: p => p.Add(x => x.Virtualize, new DataGridVirtualize(20, 100, 0)));
        await cut.Find(".data-grid-scroll").TriggerEventAsync("onscroll", EventArgs.Empty);
        Assert.Equal("Row 50", Text(BodyRows(cut)[0].QuerySelector("[data-col='0']")!));
    }

    [Fact]
    public async Task Section_8_56_The_Roving_Tab_Stops_Row_Stays_Rendered_Outside_The_Window()
    {
        JSInterop.Setup<double>("eval", i => (i.Arguments[0]?.ToString() ?? "").Contains("scrollTop ??")).SetResult(2000);
        var cut = Render(rows: ManyRows(200), configure: p => p.Add(x => x.Virtualize, new DataGridVirtualize(20, 100, 0)));
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        await cut.Find(".data-grid-scroll").TriggerEventAsync("onscroll", EventArgs.Empty);
        Assert.Equal("0", DataCell(cut, 0, 0).GetAttribute("tabindex"));
        Assert.Single(Tabbable(cut));
    }

    // ---- Export (§8.67–§8.77, §8.116–§8.119) ----

    private static readonly DataGridLabels ExportLabels = new()
    {
        Export = "Export", ExportCsv = "CSV", ExportTsv = "TSV", ExportExcel = "Excel",
        ExportAnnouncement = (format, count, filename) => $"{count} rows as {format}: {filename}",
    };

    private static readonly IReadOnlyList<DataGridColumn> ExportColumns = new[]
    {
        new DataGridColumn { Id = "name", Header = "Name", Sortable = true },
        new DataGridColumn { Id = "qty", Header = "Qty", Format = (v, _) => $"{v} pcs" },
        new DataGridColumn { Id = "act", Header = "Actions", Exportable = false },
        new DataGridColumn { Id = "email", Header = "Email", Hidable = true },
    };

    private static readonly IReadOnlyList<DataGridRow> ExportRows = new[]
    {
        R(("name", "Bo"), ("qty", 2), ("act", "x"), ("email", "bo@x")),
        R(("name", "Ann"), ("qty", 3), ("act", "x"), ("email", "ann@x")),
        R(("name", "Cy"), ("qty", 1), ("act", "x"), ("email", "cy@x")),
    };

    private (DataGridExport? File, string Text, IRenderedComponent<DataGrid> Cut) Exported(Action<ComponentParameterCollectionBuilder<DataGrid>>? configure = null, string format = "csv", IReadOnlyList<DataGridColumn>? columns = null, IReadOnlyList<DataGridRow>? rows = null, DataGridLabels? labels = null)
    {
        DataGridExport? file = null;
        var cut = Render(columns ?? ExportColumns, rows ?? ExportRows, p =>
        {
            p.Add(x => x.Labels, labels ?? ExportLabels);
            p.Add(x => x.ExportHandler, f => { file = f; return false; });
            configure?.Invoke(p);
        });
        cut.Find($"[data-grid-export-format='{format}']").Click();
        var text = file is null ? "" : Encoding.UTF8.GetString(file.Bytes);
        return (file, text, cut);
    }

    [Fact]
    public void Section_8_67_Labels_Gate_The_Buttons_One_Per_Label_Inside_A_Named_Group()
    {
        Assert.Empty(Render().FindAll(".data-grid-export"));
        var cut = Render(configure: p => p.Add(x => x.Labels, new DataGridLabels { Export = "Export", ExportExcel = "Excel" }));
        Assert.Equal("group", cut.Find(".data-grid-export").GetAttribute("role"));
        Assert.Equal("Export", cut.Find(".data-grid-export").GetAttribute("aria-label"));
        Assert.Single(cut.FindAll(".data-grid-export-button"));
        Assert.Equal("xlsx", cut.Find(".data-grid-export-button").GetAttribute("data-grid-export-format"));
    }

    [Fact]
    public void Section_8_68_Csv_Holds_The_Visible_Exportable_Columns_With_A_Bom()
    {
        var (file, text, _) = Exported();
        Assert.Equal(DataGridExportFormat.Csv, file!.Format);
        Assert.Equal("data-grid.csv", file.Filename);
        Assert.Equal(3, file.RowCount);
        Assert.Equal("﻿Name,Qty,Email\r\nBo,2,bo@x\r\nAnn,3,ann@x\r\nCy,1,cy@x\r\n", text);
    }

    [Fact]
    public void Section_8_69_Hidden_Columns_Are_Left_Out()
    {
        DataGridExport? file = null;
        var cut = Render(ExportColumns, ExportRows, p =>
        {
            p.Add(x => x.Labels, ExportLabels with { ColumnVisibility = "Columns", ColumnVisibilityOption = h => $"Show {h}" });
            p.Add(x => x.ExportHandler, f => { file = f; return false; });
        });
        cut.Find("input[type='checkbox']").Change(false);
        cut.Find("[data-grid-export-format='csv']").Click();
        Assert.Equal("﻿Name,Qty\r\nBo,2\r\nAnn,3\r\nCy,1\r\n", Encoding.UTF8.GetString(file!.Bytes));
    }

    [Fact]
    public void Section_8_70_The_Export_Is_The_Filtered_Sorted_View_Across_Every_Page()
    {
        var (file, text, _) = Exported(p =>
        {
            p.Add(x => x.PageSize, 1);
            p.Add(x => x.Sort, new DataGridSort("name", DataGridSortDirection.Ascending));
            p.Add(x => x.Filter, "x");
        }, labels: ExportLabels with { PageStatus = (_, _, _) => "" });
        Assert.Equal(3, file!.RowCount);
        Assert.Equal(new[] { "Ann,3,ann@x", "Bo,2,bo@x", "Cy,1,cy@x" }, text.Split("\r\n").Skip(1).Take(3).ToArray());
    }

    [Fact]
    public void Section_8_71_ExportScope_Selected_Exports_Only_The_Selected_Rows()
    {
        var (file, text, _) = Exported(p =>
        {
            p.Add(x => x.ExportScope, DataGridExportScope.Selected);
            p.Add(x => x.SelectionMode, DataGridSelectionMode.Multiple);
            p.Add(x => x.Selected, new[] { "1" });
        });
        Assert.Equal(1, file!.RowCount);
        Assert.Contains("Ann,3,ann@x", text);
        Assert.DoesNotContain("Bo,", text);
    }

    [Fact]
    public void Section_8_72_Tsv_And_Excel_Have_The_Right_Extension_And_Type_The_Xlsx_Is_A_Zip()
    {
        var (tsv, tsvText, _) = Exported(p => p.Add(x => x.ExportFilename, "report"), "tsv");
        Assert.Equal("report.tsv", tsv!.Filename);
        Assert.Contains("Name\tQty\tEmail", tsvText);
        var (xlsx, _, _) = Exported(format: "xlsx");
        Assert.Equal("data-grid.xlsx", xlsx!.Filename);
        Assert.Contains("spreadsheetml.sheet", xlsx.MimeType);
        Assert.Equal(new byte[] { 0x50, 0x4B }, xlsx.Bytes.Take(2).ToArray());
    }

    [Fact]
    public void Section_8_73_ExportValue_Overrides_The_Cell_And_Formula_Looking_Text_Is_Defused()
    {
        var columns = new[] { new DataGridColumn { Id = "n", Header = "N", ExportValue = row => $"={row["n"]}" }, new DataGridColumn { Id = "m", Header = "M", Accessor = _ => "plain" } };
        var (_, text, _) = Exported(columns: columns, rows: new[] { R(("n", 1)) });
        Assert.Equal("﻿N,M\r\n'=1,plain\r\n", text);
    }

    [Fact]
    public void Section_8_74_Saves_The_File_And_Announces_Unless_The_Handler_Returns_False_Buttons_Disable_With_Nothing()
    {
        var saved = new List<string>();
        JSInterop.SetupVoid("eval", i => { var s = i.Arguments[0]?.ToString() ?? ""; if (s.Contains("createObjectURL")) saved.Add(s); return true; }).SetVoidResult();
        var cut = Render(ExportColumns, ExportRows, p => p.Add(x => x.Labels, ExportLabels));
        cut.Find("[data-grid-export-format='csv']").Click();
        Assert.Single(saved);
        Assert.Equal("3 rows as Csv: data-grid.csv", Status(cut));
        Assert.True(Render(ExportColumns, Array.Empty<DataGridRow>(), p => p.Add(x => x.Labels, ExportLabels)).Find("[data-grid-export-format='csv']").HasAttribute("disabled"));
    }

    [Fact]
    public void Section_8_77_A_Virtualized_Grid_Exports_Every_Row_Not_Only_The_Rendered_Window()
    {
        var (file, text, _) = Exported(p => p.Add(x => x.Virtualize, new DataGridVirtualize(20, 100)),
            columns: new[] { new DataGridColumn { Id = "name", Header = "Name" } }, rows: ManyRows(300), labels: new DataGridLabels { ExportCsv = "CSV" });
        Assert.Equal(300, file!.RowCount);
        Assert.Equal(301, text.TrimEnd().Split("\r\n").Length);
        Assert.Contains("Row 299", text);
    }

    // ---- Cell types (§8.79–§8.97) ----

    [Fact]
    public void Section_8_79_Type_Sets_DataCellType_On_Header_And_Cells_And_Its_Alignment()
    {
        var cut = Render(new[] { new DataGridColumn { Id = "n", Header = "N", Type = DataGridCellType.Number }, new DataGridColumn { Id = "t", Header = "T", Type = DataGridCellType.Text } }, new[] { R(("n", 1), ("t", "a")) });
        Assert.Equal(2, cut.FindAll("[data-cell-type='number']").Count);
        Assert.Equal(2, cut.FindAll("[data-cell-type='text']").Count);
        Assert.Equal("end", DataCell(cut, 0, 0).GetAttribute("data-align"));
        Assert.Equal("start", DataCell(cut, 0, 1).GetAttribute("data-align"));
    }

    [Fact]
    public void Section_8_80_Number_Formats_With_The_Locale_A_Columns_Own_Format_Wins_No_Locale_Shows_As_Stored()
    {
        var columns = new[] { new DataGridColumn { Id = "n", Header = "N", Type = DataGridCellType.Number }, new DataGridColumn { Id = "m", Header = "M", Type = DataGridCellType.Number, Format = (v, _) => $"#{v}" } };
        var cut = Render(columns, new[] { R(("n", 1200.5), ("m", 3)) }, p => p.Add(x => x.Locale, "en-US"));
        Assert.Equal("1,200.5", Text(DataCell(cut, 0, 0)));
        Assert.Equal("#3", Text(DataCell(cut, 0, 1)));
        Assert.Equal("1200.5", Text(DataCell(Render(new[] { columns[0] }, new[] { R(("n", 1200.5)) }), 0, 0)));
    }

    [Fact]
    public void Section_8_81_Link_Renders_An_Anchor_The_Label_Is_The_Text_The_Address_The_Href()
    {
        var cut = Render(new[] { new DataGridColumn { Id = "l", Header = "L", Type = DataGridCellType.Link } }, new[] { R(("l", new DataGridLink("https://example.com/a", "Example"))), R(("l", "/docs")) });
        var a = DataCell(cut, 0, 0).QuerySelector("a")!;
        Assert.Equal("https://example.com/a", a.GetAttribute("href"));
        Assert.Equal("Example", Text(a));
        Assert.Equal("/docs", DataCell(cut, 1, 0).QuerySelector("a")!.GetAttribute("href"));
    }

    [Fact]
    public void Section_8_82_An_Unsafe_Link_Scheme_Is_Shown_As_Text_Never_As_A_Link()
    {
        var cut = Render(new[] { new DataGridColumn { Id = "l", Header = "L", Type = DataGridCellType.Link } }, new[] { R(("l", "javascript:alert(1)")), R(("l", new DataGridLink("data:text/html,x", "Bad"))), R(("l", " java\tscript:alert(1)")) });
        Assert.Empty(cut.FindAll(".data-table-body a"));
        Assert.Equal("Bad", Text(DataCell(cut, 1, 0)));
        Assert.Equal(3, cut.FindAll(".data-grid-link-unsafe").Count);
    }

    [Fact]
    public void Section_8_83_An_External_Link_Opens_A_New_Tab_Safely_And_Says_So()
    {
        var cut = Render(new[] { new DataGridColumn { Id = "l", Header = "L", Type = DataGridCellType.Link } }, new[] { R(("l", new DataGridLink("https://example.com", "Ex", true))) },
            p => p.Add(x => x.Labels, new DataGridLabels { OpensInNewTab = t => $"{t} opens in a new tab" }));
        var a = DataCell(cut, 0, 0).QuerySelector("a")!;
        Assert.Equal("_blank", a.GetAttribute("target"));
        Assert.Equal("noopener noreferrer", a.GetAttribute("rel"));
        Assert.Equal("Ex opens in a new tab", a.QuerySelector(".data-grid-visually-hidden")!.TextContent);
    }

    [Fact]
    public void Section_8_84_Links_Sort_By_Label_And_Filter_On_Label_And_Address()
    {
        var cut = Render(new[] { new DataGridColumn { Id = "l", Header = "L", Type = DataGridCellType.Link, Sortable = true } },
            new[] { R(("l", new DataGridLink("https://b.test", "Zed"))), R(("l", new DataGridLink("https://a.test/special", "Amy"))) },
            p => { p.Add(x => x.Labels, new DataGridLabels { Search = "Search" }); p.Add(x => x.Sort, new DataGridSort("l", DataGridSortDirection.Ascending)); });
        Assert.Equal("Amy", Text(DataCell(cut, 0, 0)));
        cut.Find(".data-grid-search").Input("special");
        Assert.Single(BodyRows(cut));
    }

    [Fact]
    public void Section_8_85_Date_Is_A_Time_Element_Locale_Text_ISO_Without_A_Locale()
    {
        var columns = new[] { new DataGridColumn { Id = "d", Header = "D", Type = DataGridCellType.Date, DateFormat = "d MMMM yyyy" } };
        var cut = Render(columns, new[] { R(("d", "2026-10-16")), R(("d", "2026-01-01")) }, p => p.Add(x => x.Locale, "en-GB"));
        Assert.Equal("2026-10-16", DataCell(cut, 0, 0).QuerySelector("time")!.GetAttribute("datetime"));
        Assert.Equal("16 October 2026", Text(DataCell(cut, 0, 0)));
        Assert.Equal("1 January 2026", Text(DataCell(cut, 1, 0)));
        Assert.Equal("2026-10-16", Text(DataCell(Render(new[] { new DataGridColumn { Id = "d", Header = "D", Type = DataGridCellType.Date } }, new[] { R(("d", "2026-10-16")) }), 0, 0)));
    }

    [Fact]
    public void Section_8_86_Time_Is_A_Time_Element_Locale_Text_The_Stored_Text_Without_A_Locale()
    {
        var plain = Render(new[] { new DataGridColumn { Id = "t", Header = "T", Type = DataGridCellType.Time } }, new[] { R(("t", "14:30")) });
        Assert.Equal("14:30", Text(DataCell(plain, 0, 0)));
        Assert.Equal("14:30", DataCell(plain, 0, 0).QuerySelector("time")!.GetAttribute("datetime"));
        var local = Render(new[] { new DataGridColumn { Id = "t", Header = "T", Type = DataGridCellType.Time, TimeFormat = "h:mm tt" } }, new[] { R(("t", "14:30")) }, p => p.Add(x => x.Locale, "en-US"));
        Assert.Equal("2:30 PM", Text(DataCell(local, 0, 0)));
    }

    [Fact]
    public void Section_8_87_Date_And_Time_Editors_Are_Native_Inputs_A_Bad_Date_Is_Refused()
    {
        var edits = new List<DataGridCellEdit>();
        var columns = new[] { new DataGridColumn { Id = "d", Header = "D", Type = DataGridCellType.Date, Editable = true }, new DataGridColumn { Id = "t", Header = "T", Type = DataGridCellType.Time, Editable = true } };
        var cut = RenderEdit(edits, null, columns, new[] { R(("d", "2026-10-16"), ("t", "09:00")) });
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        Press(DataCell(cut, 0, 0), "F2");
        var input = cut.Find(".data-grid-cell-editor");
        Assert.Equal("date", input.GetAttribute("type"));
        input.Input("2026-02-30");
        input.KeyDown(Key("Enter"));
        Assert.Empty(edits);
        Assert.Equal("true", cut.Find(".data-grid-cell-editor").GetAttribute("aria-invalid"));
        cut.Find(".data-grid-cell-editor").Input("2027-02-03");
        cut.Find(".data-grid-cell-editor").KeyDown(Key("Enter"));
        Assert.Equal("2027-02-03", Assert.Single(edits).Value);
        DataCell(cut, 0, 1).FocusIn(new FocusEventArgs());
        Press(DataCell(cut, 0, 1), "F2");
        Assert.Equal("time", cut.Find(".data-grid-cell-editor").GetAttribute("type"));
    }

    private static readonly DataGridOption[] StatusOptions = { new("todo", "To do"), new("done", "Done") };

    [Fact]
    public void Section_8_88_Select_Shows_The_Option_Label_A_Stale_Id_Shows_As_Itself()
    {
        var cut = Render(new[] { new DataGridColumn { Id = "s", Header = "S", Type = DataGridCellType.Select, Options = StatusOptions } }, new[] { R(("s", "done")), R(("s", "gone")), R(("s", null)) });
        Assert.Equal("Done", Text(DataCell(cut, 0, 0)));
        Assert.Equal("gone", Text(DataCell(cut, 1, 0)));
        Assert.Equal("", Text(DataCell(cut, 2, 0)));
    }

    [Fact]
    public void Section_8_89_Select_Edits_With_A_Native_Select_Grouped_Options_And_Reports_The_Id()
    {
        var edits = new List<DataGridCellEdit>();
        var options = new DataGridOption[] { new("a", "Alpha"), new("b", "Beta", Group: "More") };
        var cut = RenderEdit(edits, null, new[] { new DataGridColumn { Id = "s", Header = "Status", Type = DataGridCellType.Select, Options = options, Editable = true } }, new[] { R(("s", "a")) });
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        Press(DataCell(cut, 0, 0), "F2");
        var select = cut.Find("select.data-grid-cell-editor");
        Assert.Equal("More", select.QuerySelector("optgroup")!.GetAttribute("label"));
        select.Change("b");
        select.KeyDown(Key("Enter"));
        var edit = Assert.Single(edits);
        Assert.Equal(("s", "b", "a"), (edit.ColumnId, edit.Value, edit.Previous));
    }

    [Fact]
    public void Section_8_90_Select_Sorts_By_Label_Or_Option_Order_Filter_Matches_The_Label_Export_Is_The_Label_Or_The_Id()
    {
        var options = new DataGridOption[] { new("z", "Aardvark"), new("a", "Zebra") };
        var rows = new[] { R(("s", "a")), R(("s", "z")) };
        var cut = Render(new[] { new DataGridColumn { Id = "s", Header = "S", Type = DataGridCellType.Select, Options = options, Sortable = true } }, rows,
            p => { p.Add(x => x.Sort, new DataGridSort("s", DataGridSortDirection.Ascending)); p.Add(x => x.Labels, new DataGridLabels { Search = "Search" }); });
        Assert.Equal("Aardvark", Text(DataCell(cut, 0, 0)));
        cut.Find(".data-grid-search").Input("zeb");
        Assert.Single(BodyRows(cut));
        var byOrder = Render(new[] { new DataGridColumn { Id = "s", Header = "S", Type = DataGridCellType.Select, Options = new DataGridOption[] { new("q", "Qux"), new("b", "Bar") }, SortBy = DataGridSortBy.Order, Sortable = true } },
            new[] { R(("s", "b")), R(("s", "q")) }, p => p.Add(x => x.Sort, new DataGridSort("s", DataGridSortDirection.Ascending)));
        Assert.Equal("Qux", Text(DataCell(byOrder, 0, 0)));
        foreach (var exportAs in new[] { DataGridExportAs.Label, DataGridExportAs.Id })
        {
            var (_, text, _) = Exported(columns: new[] { new DataGridColumn { Id = "s", Header = "S", Type = DataGridCellType.Select, Options = options, ExportAs = exportAs } }, rows: new[] { R(("s", "a")) }, labels: new DataGridLabels { ExportCsv = "CSV" });
            Assert.Equal($"﻿S\r\n{(exportAs == DataGridExportAs.Id ? "a" : "Zebra")}\r\n", text);
        }
    }

    [Fact]
    public void Section_8_91_Radio_Group_Is_A_Fieldset_With_A_Legend_One_Radio_Per_Option_A_Name_Per_Row_And_Column()
    {
        var edits = new List<DataGridCellEdit>();
        var options = new DataGridOption[] { new("lo", "Low"), new("hi", "High") };
        var cut = RenderEdit(edits, null, new[] { new DataGridColumn { Id = "p", Header = "Priority", Type = DataGridCellType.Radio, Options = options, Editable = true } }, new[] { R(("p", "lo")), R(("p", "hi")) });
        var groups = cut.FindAll("fieldset.data-grid-radio-group");
        Assert.Equal(2, groups.Count);
        Assert.Equal("Priority", groups[0].QuerySelector("legend")!.TextContent);
        Assert.Equal(2, cut.FindAll("input[type='radio']").Select(r => r.GetAttribute("name")).Distinct().Count());
        Assert.True(groups[0].QuerySelector("input[value='lo']")!.HasAttribute("checked"));
        groups[0].QuerySelector("input[value='hi']")!.Change(true);
        var edit = Assert.Single(edits);
        Assert.Equal(("p", "hi", "lo"), (edit.ColumnId, edit.Value, edit.Previous));
    }

    [Fact]
    public void Section_8_92_A_ReadOnly_Radio_Column_Shows_The_Label_As_Text()
    {
        var cut = Render(new[] { new DataGridColumn { Id = "p", Header = "P", Type = DataGridCellType.Radio, Options = new DataGridOption[] { new("lo", "Low") } } }, new[] { R(("p", "lo")) });
        Assert.Empty(cut.FindAll("fieldset"));
        Assert.Equal("Low", Text(DataCell(cut, 0, 0)));
    }

    [Fact]
    public void Section_8_94_Editing_A_Link_Changes_The_Address_And_Keeps_The_Label_A_Bad_Scheme_Is_Refused()
    {
        var edits = new List<DataGridCellEdit>();
        var cut = RenderEdit(edits, new DataGridLabels { InvalidValue = (h, t) => $"{h} is not a valid {t}" },
            new[] { new DataGridColumn { Id = "l", Header = "L", Type = DataGridCellType.Link, Editable = true } }, new[] { R(("l", new DataGridLink("https://a.test", "A"))) });
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        Press(DataCell(cut, 0, 0), "F2");
        var input = cut.Find(".data-grid-cell-editor");
        Assert.Equal("https://a.test", input.GetAttribute("value"));
        input.Input("javascript:alert(1)");
        input.KeyDown(Key("Enter"));
        Assert.Empty(edits);
        Assert.Equal("L is not a valid link", Text(cut.Find(".data-grid-cell-error")));
        cut.Find(".data-grid-cell-editor").Input("https://b.test");
        cut.Find(".data-grid-cell-editor").KeyDown(Key("Enter"));
        Assert.Equal(new DataGridLink("https://b.test", "A"), Assert.Single(edits).Value);
    }

    [Fact]
    public void Section_8_95_Date_Exports_Typed_Time_And_Link_Export_As_Text()
    {
        var (_, text, _) = Exported(columns: new[]
        {
            new DataGridColumn { Id = "d", Header = "D", Type = DataGridCellType.Date },
            new DataGridColumn { Id = "t", Header = "T", Type = DataGridCellType.Time },
            new DataGridColumn { Id = "l", Header = "L", Type = DataGridCellType.Link },
        }, rows: new[] { R(("d", "2026-10-16"), ("t", "09:05"), ("l", new DataGridLink("https://a.test", "Home"))) }, labels: new DataGridLabels { ExportCsv = "CSV" });
        Assert.Equal("﻿D,T,L\r\n2026-10-16,09:05,Home\r\n", text);
    }

    [Fact]
    public void Section_8_96_The_Columns_Own_Hooks_Override_The_Types()
    {
        var cut = Render(new[] { new DataGridColumn { Id = "d", Header = "D", Type = DataGridCellType.Date, Format = (_, _) => "custom", Align = DataGridAlign.End } }, new[] { R(("d", "2026-10-16")) });
        Assert.Equal("custom", Text(DataCell(cut, 0, 0)));
        Assert.Equal("end", DataCell(cut, 0, 0).GetAttribute("data-align"));
    }

    [Fact]
    public void Section_8_97_A_Column_Without_A_Type_Is_Untouched()
    {
        var cut = Render(new[] { new DataGridColumn { Id = "x", Header = "X" } }, new[] { R(("x", "plain")) });
        Assert.False(DataCell(cut, 0, 0).HasAttribute("data-cell-type"));
        Assert.Equal("plain", Text(DataCell(cut, 0, 0)));
    }

    // ---- Time zone, person, file, rollup, formula (§8.98–§8.119) ----

    private static readonly DataGridOption[] Zones = { new("Europe/London", "London"), new("America/New_York", "New York") };

    [Fact]
    public void Section_8_98_TimeZone_Shows_The_Time_And_The_Zone_Id_As_Given_Never_Converted()
    {
        var column = new[] { new DataGridColumn { Id = "t", Header = "T", Type = DataGridCellType.TimeZone } };
        Assert.Equal("14:30 Europe/London", Text(DataCell(Render(column, new[] { R(("t", new DataGridZonedTime("14:30", "Europe/London"))) }), 0, 0)));
        Assert.Equal("09:00 +01:00", Text(DataCell(Render(column, new[] { R(("t", new DataGridZonedTime("09:00", "+01:00"))) }), 0, 0)));
    }

    [Fact]
    public void Section_8_99_TimeZone_Sorts_By_The_UTC_Minute_At_The_Reference_Date_Else_By_The_Stated_Time()
    {
        var rows = new[]
        {
            R(("t", new DataGridZonedTime("13:00", "America/New_York"))), // 17:00 UTC in July
            R(("t", new DataGridZonedTime("17:30", "Europe/London"))), // 16:30 UTC
            R(("t", new DataGridZonedTime("10:00", "+00:00"))), // 10:00 UTC
        };
        string[] Times(IRenderedComponent<DataGrid> cut) => Enumerable.Range(0, 3).Select(i => Text(DataCell(cut, i, 0))[..5]).ToArray();
        var withReference = Render(new[] { new DataGridColumn { Id = "t", Header = "T", Type = DataGridCellType.TimeZone, Sortable = true, ReferenceDate = "2026-07-01" } }, rows,
            p => p.Add(x => x.Sort, new DataGridSort("t", DataGridSortDirection.Ascending)));
        Assert.Equal(new[] { "10:00", "17:30", "13:00" }, Times(withReference));
        var without = Render(new[] { new DataGridColumn { Id = "t", Header = "T", Type = DataGridCellType.TimeZone, Sortable = true } }, rows,
            p => p.Add(x => x.Sort, new DataGridSort("t", DataGridSortDirection.Ascending)));
        Assert.Equal(new[] { "10:00", "13:00", "17:30" }, Times(without));
    }

    [Fact]
    public void Section_8_100_The_TimeZone_Editor_Is_A_Time_Field_And_A_Zone_Select_Commit_Reports_Both()
    {
        var edits = new List<DataGridCellEdit>();
        var cut = RenderEdit(edits, new DataGridLabels { TimeZone = h => $"{h} zone" },
            new[] { new DataGridColumn { Id = "t", Header = "Start", Type = DataGridCellType.TimeZone, Editable = true, TimeZones = Zones } }, new[] { R(("t", new DataGridZonedTime("09:00", "Europe/London"))) });
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        Press(DataCell(cut, 0, 0), "F2");
        Assert.Equal("09:00", cut.Find("input[type='time']").GetAttribute("value"));
        var zone = cut.Find("select[aria-label='Start zone']");
        zone.Change("America/New_York");
        zone.KeyDown(Key("Enter"));
        Assert.Equal(new DataGridZonedTime("09:00", "America/New_York"), Assert.Single(edits).Value);
    }

    [Fact]
    public void Section_8_101_Person_Shows_Names_As_Text_Avatars_Are_Decorative_MorePeople_Counts_The_Rest()
    {
        var people = new[] { new DataGridPerson("a", "Ann", "ann@x"), new DataGridPerson("b", "Bo"), new DataGridPerson("c") };
        var columns = new[]
        {
            new DataGridColumn
            {
                Id = "p", Header = "P", Type = DataGridCellType.Person, MaxPeople = 2,
                Avatar = person => b => { b.OpenElement(0, "i"); b.AddAttribute(1, "class", "av"); b.CloseElement(); },
            },
        };
        var cut = Render(columns, new[] { R(("p", people)), R(("p", new DataGridPerson("z", "Zed"))) },
            p => p.Add(x => x.Labels, new DataGridLabels { MorePeople = n => $"+{n} more", Search = "Search" }));
        Assert.Equal(new[] { "Ann", "Bo" }, DataCell(cut, 0, 0).QuerySelectorAll(".data-grid-person-name").Select(Text).ToArray());
        Assert.Equal("+1 more", Text(DataCell(cut, 0, 0).QuerySelector(".data-grid-people-more")!));
        Assert.Equal("true", DataCell(cut, 0, 0).QuerySelector(".data-grid-avatar")!.GetAttribute("aria-hidden"));
        cut.Find(".data-grid-search").Input("ann@x");
        Assert.Single(BodyRows(cut));
    }

    [Fact]
    public void Section_8_102_A_Person_With_No_Name_Falls_Back_To_The_Id_Export_Is_The_Names_Joined()
    {
        var (_, text, cut) = Exported(columns: new[] { new DataGridColumn { Id = "p", Header = "P", Type = DataGridCellType.Person } },
            rows: new[] { R(("p", new[] { new DataGridPerson("a", "Ann"), new DataGridPerson("u7") })) }, labels: new DataGridLabels { ExportCsv = "CSV" });
        Assert.Equal("Annu7", Text(DataCell(cut, 0, 0)));
        Assert.Equal("﻿P\r\nAnn; u7\r\n", text);
    }

    [Fact]
    public void Section_8_103_File_Shows_Names_A_Link_Only_For_A_Safe_Href_Sizes_Through_The_Formatter_And_Remove_Reports()
    {
        var removed = new List<DataGridFileRemove>();
        var files = new[] { new DataGridFile("1", "a.pdf", 2048, Href: "https://x.test/a.pdf"), new DataGridFile("2", "b.txt", Href: "javascript:alert(1)") };
        var cut = Render(new[] { new DataGridColumn { Id = "f", Header = "Files", Type = DataGridCellType.File, Editable = true, FormatSize = n => $"{n / 1024} KB" } }, new[] { R(("f", files)) }, p =>
        {
            p.Add(x => x.Labels, new DataGridLabels { RemoveFile = n => $"Remove {n}" });
            p.Add(x => x.OnFileRemove, EventCallback.Factory.Create<DataGridFileRemove>(this, r => removed.Add(r)));
        });
        var cell = DataCell(cut, 0, 0);
        var links = cell.QuerySelectorAll("a");
        Assert.Single(links);
        Assert.Equal("https://x.test/a.pdf", links[0].GetAttribute("href"));
        Assert.Equal("2 KB", Text(cell.QuerySelector(".data-grid-file-size")!));
        Assert.Equal("Files", cell.QuerySelector("input[type='file']")!.GetAttribute("aria-label"));
        cut.Find("button[aria-label='Remove b.txt']").Click();
        Assert.Equal("2", Assert.Single(removed).FileId);
    }

    [Fact]
    public void Section_8_103_The_File_Input_Reports_The_Chosen_Files_And_Uploads_Nothing()
    {
        var chosen = new List<DataGridFilesSelected>();
        var cut = Render(new[] { new DataGridColumn { Id = "f", Header = "Files", Type = DataGridCellType.File, Editable = true } }, new[] { R(("f", Array.Empty<DataGridFile>())) },
            p => p.Add(x => x.OnFilesSelected, EventCallback.Factory.Create<DataGridFilesSelected>(this, e => chosen.Add(e))));
        cut.FindComponent<InputFile>().UploadFiles(InputFileContent.CreateFromText("hello", "c.txt"));
        var selection = Assert.Single(chosen);
        Assert.Equal("c.txt", selection.Files.Single().Name);
        Assert.Equal("f", selection.ColumnId);
    }

    [Fact]
    public void Section_8_104_File_Sorts_By_First_Name_Then_Count()
    {
        var cut = Render(new[] { new DataGridColumn { Id = "f", Header = "F", Type = DataGridCellType.File, Sortable = true } },
            new[] { R(("f", new[] { new DataGridFile("1", "b", null) })), R(("f", new[] { new DataGridFile("2", "a"), new DataGridFile("3", "z") })) },
            p => p.Add(x => x.Sort, new DataGridSort("f", DataGridSortDirection.Ascending)));
        Assert.Equal("az", Text(DataCell(cut, 0, 0)));
    }

    [Fact]
    public void Section_8_105_Rollup_Derives_Its_Number_From_The_Related_Values_Empty_Is_Empty_Count_Of_None_Is_Zero()
    {
        var columns = new[]
        {
            new DataGridColumn { Id = "h", Header = "Hours", Type = DataGridCellType.Rollup, Aggregate = DataGridAggregate.Sum, ResultType = DataGridResultType.Number },
            new DataGridColumn { Id = "c", Header = "Count", Type = DataGridCellType.Rollup, Aggregate = DataGridAggregate.Count, Relation = r => (IEnumerable<object?>)r["h"]! },
        };
        var rows = new[] { R(("h", new object?[] { 1, 2, 3 }), ("c", null)), R(("h", new object?[0]), ("c", null)), R(("h", new object?[] { null, "x" }), ("c", null)) };
        var cut = Render(columns, rows);
        Assert.Equal("6", Text(DataCell(cut, 0, 0)));
        Assert.Equal("", Text(DataCell(cut, 1, 0)));
        Assert.Equal("0", Text(DataCell(cut, 1, 1)));
        Assert.Equal("end", DataCell(cut, 0, 0).GetAttribute("data-align"));
    }

    [Fact]
    public void Section_8_106_Aggregates_Avg_Median_Min_Max_Range_CountUnique_PercentTrue_PercentEmpty_And_A_Custom_Reduce()
    {
        var values = new object?[] { 1, 2, 2, 9 };
        Assert.Equal(3.5, CellTypes.AggregateValues(DataGridAggregate.Avg, values));
        Assert.Equal(2d, CellTypes.AggregateValues(DataGridAggregate.Median, values));
        Assert.Equal(1d, CellTypes.AggregateValues(DataGridAggregate.Min, values));
        Assert.Equal(9d, CellTypes.AggregateValues(DataGridAggregate.Max, values));
        Assert.Equal(8d, CellTypes.AggregateValues(DataGridAggregate.Range, values));
        Assert.Equal(3, CellTypes.AggregateValues(DataGridAggregate.CountUnique, values));
        Assert.Null(CellTypes.AggregateValues(DataGridAggregate.PercentTrue, values));
        Assert.Equal(0d, CellTypes.AggregateValues(DataGridAggregate.PercentEmpty, values));
        Assert.Equal(50d, CellTypes.AggregateValues(DataGridAggregate.PercentTrue, new object?[] { true, false }));
        Assert.Null(CellTypes.AggregateValues(DataGridAggregate.Sum, Array.Empty<object?>()));
        Assert.Equal(0, CellTypes.AggregateValues(DataGridAggregate.Count, Array.Empty<object?>()));
        var cut = Render(new[] { new DataGridColumn { Id = "x", Header = "x", Type = DataGridCellType.Rollup, Reduce = (v, _) => v.Count * 10, Relation = r => (IEnumerable<object?>)r["v"]! } }, new[] { R(("v", values)) });
        Assert.Equal("40", Text(DataCell(cut, 0, 0)));
    }

    [Fact]
    public void Section_8_107_A_Rollup_Cell_Is_ReadOnly_The_Header_Carries_Its_Description()
    {
        var cut = Render(new[] { new DataGridColumn { Id = "h", Header = "Hours", Type = DataGridCellType.Rollup, Aggregate = DataGridAggregate.Sum, Editable = true } }, new[] { R(("h", new object?[] { 1, 2 })) },
            p => p.Add(x => x.Labels, new DataGridLabels { RollupDescription = h => $"Sum of {h}", EditCell = (_, _) => "Edit" }));
        var cell = DataCell(cut, 0, 0);
        Assert.Equal("true", cell.GetAttribute("aria-readonly"));
        Assert.True(cell.HasAttribute("data-readonly"));
        cell.FocusIn(new FocusEventArgs());
        Press(cell, "F2");
        cell.DoubleClick();
        Assert.Empty(cut.FindAll(".data-grid-cell-editor"));
        Assert.Empty(cut.FindAll(".data-grid-edit-button"));
        var describedBy = cut.Find(".data-table-head .data-table-th").GetAttribute("aria-describedby")!;
        Assert.Equal("Sum of Hours", cut.Find($"#{describedBy}").TextContent);
    }

    [Fact]
    public void Section_8_108_Rollup_Sorts_And_Exports_On_The_Typed_Result()
    {
        var (_, text, cut) = Exported(columns: new[] { new DataGridColumn { Id = "h", Header = "H", Type = DataGridCellType.Rollup, Aggregate = DataGridAggregate.Sum, ResultType = DataGridResultType.Number, Sortable = true } },
            rows: new[] { R(("h", new object?[] { 5 })), R(("h", new object?[] { 1, 1 })) }, configure: p => p.Add(x => x.Sort, new DataGridSort("h", DataGridSortDirection.Ascending)), labels: new DataGridLabels { ExportCsv = "CSV" });
        Assert.Equal("2", Text(DataCell(cut, 0, 0)));
        Assert.Equal("﻿H\r\n2\r\n5\r\n", text);
    }

    private static DataGridFormulaResult Evaluate(string expression, DataGridFormulaContext context)
    {
        var m = System.Text.RegularExpressions.Regex.Match(expression, @"^=\s*(\d+)\s*/\s*(\d+)$");
        if (m.Success) return int.Parse(m.Groups[2].Value) == 0 ? DataGridFormulaResult.Error("Division by zero") : DataGridFormulaResult.Of(double.Parse(m.Groups[1].Value) / double.Parse(m.Groups[2].Value));
        if (expression == "=ROWS") return DataGridFormulaResult.Of(context.Rows.Count);
        if (expression == "=THROW") throw new InvalidOperationException("boom");
        return DataGridFormulaResult.Of(context.Row["n"]);
    }

    [Fact]
    public void Section_8_109_Formula_Shows_The_Result_Of_The_Consumers_Evaluate_Computed_Once_Per_Row()
    {
        var calls = 0;
        var column = new DataGridColumn { Id = "f", Header = "F", Type = DataGridCellType.Formula, ResultType = DataGridResultType.Number, Evaluate = (e, c) => { calls++; return Evaluate(e, c); } };
        var cut = Render(new[] { column }, new[] { R(("f", "=6/3")), R(("f", "=ROWS")) });
        Assert.Equal("2", Text(DataCell(cut, 0, 0)));
        Assert.Equal("2", Text(DataCell(cut, 1, 0)));
        Assert.Equal(2, calls);
    }

    [Fact]
    public void Section_8_110_A_Formula_Error_Is_Plain_Text_With_DataError_A_Thrown_Error_Becomes_Its_Message()
    {
        var cut = Render(new[] { new DataGridColumn { Id = "f", Header = "F", Type = DataGridCellType.Formula, Evaluate = Evaluate } }, new[] { R(("f", "=1/0")), R(("f", "=THROW")), R(("f", "=4/2")) });
        Assert.Equal("Division by zero", Text(DataCell(cut, 0, 0)));
        Assert.True(DataCell(cut, 0, 0).HasAttribute("data-error"));
        Assert.Equal("boom", Text(DataCell(cut, 1, 0)));
        Assert.False(DataCell(cut, 2, 0).HasAttribute("data-error"));
    }

    [Fact]
    public void Section_8_111_The_Formula_Editor_Shows_The_Expression_Commits_An_Expression_And_Is_Named_By_FormulaEditor()
    {
        var edits = new List<DataGridCellEdit>();
        var cut = RenderEdit(edits, new DataGridLabels { FormulaEditor = h => $"{h} expression" },
            new[] { new DataGridColumn { Id = "f", Header = "F", Type = DataGridCellType.Formula, Evaluate = Evaluate, Editable = true } }, new[] { R(("f", "=6/3")) });
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        Press(DataCell(cut, 0, 0), "F2");
        var input = cut.Find("input[aria-label='F expression']");
        Assert.Equal("=6/3", input.GetAttribute("value"));
        input.Input("=8/2");
        input.KeyDown(Key("Enter"));
        var edit = Assert.Single(edits);
        Assert.Equal(("f", "=8/2", "=6/3"), (edit.ColumnId, edit.Value, edit.Previous));
    }

    [Fact]
    public void Section_8_112_Validate_Refuses_An_Expression_With_The_Engines_Message()
    {
        var edits = new List<DataGridCellEdit>();
        var cut = RenderEdit(edits, null,
            new[] { new DataGridColumn { Id = "f", Header = "F", Type = DataGridCellType.Formula, Evaluate = Evaluate, Editable = true, Validate = (v, row) => Evaluate(v!.ToString()!, new DataGridFormulaContext(row, Array.Empty<DataGridRow>(), "f")) is DataGridFormulaError e ? e.Message : null } },
            new[] { R(("f", "=6/3")) });
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        Press(DataCell(cut, 0, 0), "F2");
        var input = cut.Find(".data-grid-cell-editor");
        input.Input("=1/0");
        input.KeyDown(Key("Enter"));
        Assert.Empty(edits);
        Assert.Equal("true", cut.Find(".data-grid-cell-editor").GetAttribute("aria-invalid"));
        Assert.Equal("Division by zero", Text(cut.Find(".data-grid-cell-error")));
    }

    [Fact]
    public void Section_8_113_Formula_Export_Is_The_Typed_Result_Or_The_Error_Text_Sort_And_Filter_Use_The_Result()
    {
        var (_, text, cut) = Exported(columns: new[] { new DataGridColumn { Id = "f", Header = "F", Type = DataGridCellType.Formula, Evaluate = Evaluate, Sortable = true, ResultType = DataGridResultType.Number } },
            rows: new[] { R(("f", "=9/3")), R(("f", "=1/0")), R(("f", "=4/2")) }, configure: p => p.Add(x => x.Sort, new DataGridSort("f", DataGridSortDirection.Ascending)),
            labels: new DataGridLabels { ExportCsv = "CSV", Search = "Search" });
        Assert.Equal("2", Text(DataCell(cut, 0, 0)));
        Assert.Equal("﻿F\r\n2\r\n3\r\nDivision by zero\r\n", text);
        cut.Find(".data-grid-search").Input("division");
        Assert.Single(BodyRows(cut));
    }

    [Fact]
    public void Section_8_114_A_Person_Cell_Is_ReadOnly_Without_A_PersonEditor_With_One_The_Editor_Gets_Commit()
    {
        var edits = new List<DataGridCellEdit>();
        var cut = RenderEdit(edits, null, new[] { new DataGridColumn { Id = "p", Header = "P", Type = DataGridCellType.Person, Editable = true } }, new[] { R(("p", new DataGridPerson("a", "Ann"))) });
        DataCell(cut, 0, 0).FocusIn(new FocusEventArgs());
        Press(DataCell(cut, 0, 0), "F2");
        Assert.Empty(cut.FindAll("[data-pick]"));
        var withEditor = RenderEdit(edits, null, new[]
        {
            new DataGridColumn
            {
                Id = "p", Header = "P", Type = DataGridCellType.Person, Editable = true,
                PersonEditor = ctx => b => { b.OpenElement(0, "button"); b.AddAttribute(1, "type", "button"); b.AddAttribute(2, "data-pick", ""); b.AddAttribute(3, "onclick", EventCallback.Factory.Create(this, () => ctx.Commit(new DataGridPerson("b", "Bo")))); b.AddContent(4, "pick"); b.CloseElement(); },
            },
        }, new[] { R(("p", new DataGridPerson("a", "Ann"))) });
        DataCell(withEditor, 0, 0).FocusIn(new FocusEventArgs());
        Press(DataCell(withEditor, 0, 0), "F2");
        withEditor.Find("[data-pick]").Click();
        var edit = Assert.Single(edits);
        Assert.Equal(("p", new DataGridPerson("b", "Bo"), new DataGridPerson("a", "Ann")), (edit.ColumnId, (DataGridPerson)edit.Value!, (DataGridPerson)edit.Previous!));
    }

    [Fact]
    public void Section_8_116_TimeZone_ExportUtc_Adds_A_UTC_Column_At_The_Reference_Date_Absent_Without_The_Label_Or_A_Reference_Date()
    {
        var rows = new[] { R(("t", new DataGridZonedTime("13:00", "America/New_York"))), R(("t", new DataGridZonedTime("09:00", "+01:00"))) };
        string Run(DataGridColumn column, DataGridLabels labels) => Exported(columns: new[] { column }, rows: rows, labels: labels).Text;
        var withLabel = new DataGridLabels { ExportCsv = "CSV", ExportUtcHeader = h => $"{h} (UTC)" };
        var column = new DataGridColumn { Id = "t", Header = "Start", Type = DataGridCellType.TimeZone, ExportUtc = true, ReferenceDate = "2026-07-01" };
        Assert.Equal("﻿Start,Start (UTC)\r\n13:00 America/New_York,17:00\r\n09:00 +01:00,08:00\r\n", Run(column, withLabel));
        Assert.Equal("﻿Start\r\n13:00 America/New_York\r\n09:00 +01:00\r\n", Run(column with { ReferenceDate = null }, withLabel));
        Assert.Equal("﻿Start\r\n13:00 America/New_York\r\n09:00 +01:00\r\n", Run(column, new DataGridLabels { ExportCsv = "CSV" }));
    }

    [Fact]
    public void Section_8_117_Person_ExportAs_Email_Exports_The_Emails_Joined()
    {
        var (_, text, _) = Exported(columns: new[] { new DataGridColumn { Id = "p", Header = "P", Type = DataGridCellType.Person, ExportAs = DataGridExportAs.Email } },
            rows: new[] { R(("p", new[] { new DataGridPerson("a", "Ann", "ann@x"), new DataGridPerson("b", "Bo", "bo@x") })), R(("p", new[] { new DataGridPerson("c", "Cy") })) },
            labels: new DataGridLabels { ExportCsv = "CSV" });
        Assert.Equal("﻿P\r\nann@x; bo@x\r\n\r\n", text);
    }

    [Fact]
    public void Section_8_119_ExportFormulas_Keeps_Live_Formulas_In_Xlsx_Only_Csv_Still_Carries_The_Result()
    {
        var column = new DataGridColumn { Id = "f", Header = "F", Type = DataGridCellType.Formula, Evaluate = (e, _) => DataGridFormulaResult.Of(double.Parse(e[1..]) * 2) };
        var rows = new[] { R(("f", "=21")) };
        var labels = new DataGridLabels { ExportCsv = "CSV", ExportExcel = "Excel" };
        var (_, csv, _) = Exported(p => p.Add(x => x.ExportFormulas, true), "csv", new[] { column }, rows, labels);
        Assert.Equal("﻿F\r\n42\r\n", csv);
        var (_, live, _) = Exported(p => p.Add(x => x.ExportFormulas, true), "xlsx", new[] { column }, rows, labels);
        Assert.Contains("<f>21</f><v>42</v>", Encoding.UTF8.GetString(Exported(p => p.Add(x => x.ExportFormulas, true), "xlsx", new[] { column }, rows, labels).File!.Bytes));
        Assert.DoesNotContain("<f>", Encoding.UTF8.GetString(Exported(null, "xlsx", new[] { column }, rows, labels).File!.Bytes));
        Assert.Contains("<v>42</v>", Encoding.UTF8.GetString(Exported(null, "xlsx", new[] { column }, rows, labels).File!.Bytes));
        _ = live;
    }
}
