// Gantt label pack tests: the builder against the real pack files in shared/label-packs.

using LilyDesignSystem.Blazor.Helpers;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class GanttLabelPackTests
{
    private static readonly GanttTask Task = new() { Id = "t1", Label = "Design" };

    [Fact]
    public void English_labels_fill_as_written()
    {
        var l = PackFiles.Load("en-001").ToGanttLabels();
        Assert.Equal("Depends on A, B", l.DependencySummary!(new[] { "A", "B" }));
        Assert.Equal("T: planned 2026-01-01 to 2026-01-05, variance 2 days", l.BaselineSummary!("T", new GanttBaseline("2026-01-01", "2026-01-05"), 2));
        Assert.Equal("A: start to start, lag 3 days", l.DependencyDetail!("A", "s2s", 3));
        Assert.Equal("Showing weeks", l.ZoomAnnouncement!(GanttTimeUnit.Week));
        Assert.Equal("Expand Design", l.CollapseButton!(Task, true));
        Assert.Equal("Edit Design", l.EditButton!(Task));
        Assert.Equal("Task", l.ExportHeaders!.Task);
        Assert.Null(l.ColumnLabel);
    }

    [Fact]
    public void Every_pack_builds_working_gantt_labels_with_no_placeholder_left_over()
    {
        foreach (var locale in PackFiles.Locales())
        {
            var l = PackFiles.Load(locale).ToGanttLabels();
            var outputs = new List<string>
            {
                l.EditButton!(Task), l.DependencySummary!(new[] { "A", "B" }), l.DateAnnouncement!("T", "s", "e"), l.BaselineSummary!("T", new GanttBaseline("s", "e"), 2),
                l.CollapseButton!(Task, true), l.CollapseButton!(Task, false), l.ExportAnnouncement!(DataGridExportFormat.Csv, 2, "f"), l.EditAnnouncement!("T", "F", "X"),
                l.EditInvalid!("T", "F"), l.EditRefused!("T", "F", "M"), l.FieldUndoAnnouncement!("T", "F", "X"), l.FieldRedoAnnouncement!("T", "F", "X"),
                l.SearchAnnouncement!(1, 2), l.CopyAnnouncement!(2),
            };
            foreach (var type in new[] { "e2s", "s2s", "e2e", "s2e" }) outputs.Add(l.DependencyDetail!("A", type, 2));
            foreach (var unit in Enum.GetValues<GanttTimeUnit>()) outputs.Add(l.ZoomAnnouncement!(unit));
            foreach (var o in outputs)
            {
                Assert.False(string.IsNullOrWhiteSpace(o), locale);
                Assert.DoesNotContain("{", o);
            }
            Assert.NotNull(l.ExportHeaders);
            Assert.False(string.IsNullOrWhiteSpace(l.TaskColumnHeader));
        }
    }
}
