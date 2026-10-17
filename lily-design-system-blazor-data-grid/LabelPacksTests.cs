// LabelPack tests — the C# port of shared/label-pack.test.ts, run against the real pack files in shared/label-packs.

using System.Linq;
using LilyDesignSystem.Blazor.Helpers;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class LabelPacksTests
{
    [Fact]
    public void Fill_replaces_placeholders_and_leaves_unknown_ones()
    {
        Assert.Equal("a 1 {y}", LabelPack.Fill("a {x} {y}", ("x", 1)));
    }

    [Fact]
    public void Fill_shows_an_exception_message_a_list_joined_and_an_upper_cased_format()
    {
        Assert.Equal("failed: offline", LabelPack.Fill("failed: {error}", ("error", new InvalidOperationException("offline"))));
        Assert.Equal("Depends on A, B", LabelPack.Fill("Depends on {tasks}", ("tasks", new[] { "A", "B" })));
        Assert.Equal("as XLSX", LabelPack.Fill("as {format}", ("format", "xlsx")));
    }

    [Fact]
    public void A_pack_names_its_locale_and_whether_it_is_reviewed()
    {
        var en = PackFiles.Load("en-001");
        Assert.Equal("en-001", en.Locale);
        Assert.True(en.Reviewed);
        Assert.False(PackFiles.Load("ta-001").Reviewed);
    }

    [Fact]
    public void English_data_grid_labels_fill_as_written()
    {
        var labels = PackFiles.Load("en-001").ToDataGridLabels();
        Assert.Equal("Page 2 of 5 (47 rows)", labels.PageStatus!(2, 5, 47));
        Assert.Equal("Sorted by Name, descending", labels.SortAnnouncement!("Name", DataGridSortDirection.Descending));
        Assert.Equal("Exported 3 as XLSX: a.xlsx", labels.ExportAnnouncement!(DataGridExportFormat.Xlsx, 3, "a.xlsx"));
        Assert.Equal("Select Ann", labels.SelectRow!("Ann"));
        Assert.Equal("Search", labels.Search);
    }

    [Fact]
    public void A_key_the_pack_lacks_leaves_the_label_null_never_another_language()
    {
        var labels = LabelPack.FromJson("""{ "locale": "xx-001", "reviewed": false, "data-grid": { "selectAll": "Alles" } }""").ToDataGridLabels();
        Assert.Equal("Alles", labels.SelectAll);
        Assert.Null(labels.SelectRow);
        Assert.Null(labels.SortAnnouncement);
        Assert.Null(labels.Search);
    }

    [Fact]
    public void The_data_grid_takes_no_search_announcement_but_the_shared_export_labels()
    {
        var pack = PackFiles.Load("en-001");
        Assert.Equal("Export", pack.ToDataGridLabels().Export);
        Assert.Null(pack.Text("data-grid", "searchAnnouncement"));
    }

    [Fact]
    public void Every_pack_builds_working_data_grid_labels_with_no_placeholder_left_over()
    {
        foreach (var locale in PackFiles.Locales())
        {
            var l = PackFiles.Load(locale).ToDataGridLabels();
            var outputs = new[]
            {
                l.ColumnVisibilityOption!("H"), l.ResizeHandle!("H"), l.SelectRow!("R"), l.PageStatus!(1, 2, 3), l.PageAnnouncement!(1, 2),
                l.SortAnnouncement!("H", DataGridSortDirection.Ascending), l.SortAnnouncement!("H", DataGridSortDirection.Descending), l.SortAnnouncement!("H", DataGridSortDirection.None),
                l.FilterAnnouncement!(1, 2), l.SelectionAnnouncement!(3), l.ColumnMoveAnnouncement!("H", 1, 2), l.EditCell!("H", "R"), l.CellEditor!("H"),
                l.EditAnnouncement!("H", "V"), l.ExportAnnouncement!(DataGridExportFormat.Csv, 3, "f.csv"), l.CopyAnnouncement!(3), l.InvalidValue!("H", "number"),
                l.OpensInNewTab!("T"), l.RadioGroup!("H", "R"), l.TimeZone!("H"), l.ExportUtcHeader!("H"), l.MorePeople!(2), l.RemoveFile!("n"), l.FileInput!("H", "R"),
                l.FormulaEditor!("H"), l.RollupDescription!("H"), l.EditCancelAnnouncement!("H"), l.UndoAnnouncement!("H", "T"), l.RedoAnnouncement!("H", "T"), l.EditError!("H", "M"),
            };
            foreach (var o in outputs)
            {
                Assert.False(string.IsNullOrWhiteSpace(o), locale);
                Assert.DoesNotContain("{", o);
            }
        }
    }
}
