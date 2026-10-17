// Kanban label pack tests: the builder against the real pack files in shared/label-packs.

using LilyDesignSystem.Blazor.Helpers;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class KanbanLabelPackTests
{
    private static readonly KanbanCard Card = new() { Id = "c1", ColumnId = "todo", Title = "Fix bug" };
    private static readonly KanbanColumn Column = new() { Id = "done", Title = "Done" };
    private static readonly KanbanLane Lane = new() { Id = "ann", Title = "Ann" };

    [Fact]
    public void English_labels_fill_as_written()
    {
        var l = PackFiles.Load("en-001").ToKanbanLabels();
        Assert.Equal("Move Fix bug", l.MoveButton!(Card));
        Assert.Equal("Expand Done", l.CollapseColumn!(Column, true));
        Assert.Equal("Collapse Done", l.CollapseColumn!(Column, false));
        Assert.Equal("A could not move to B: offline", l.MoveFailed!("A", "B", new Exception("offline")));
        Assert.Equal("Ann: 3 cards", l.LaneCount!(Lane, 3));
        Assert.Equal("Exported 3 as CSV: a.csv", l.ExportAnnouncement!(DataGridExportFormat.Csv, 3, "a.csv"));
        Assert.Equal("Title", l.ExportHeaders!.Title);
        Assert.Equal("Column", l.ExportHeaders!.Column);
    }

    [Fact]
    public void A_card_without_a_title_is_named_by_its_id()
    {
        var l = PackFiles.Load("en-001").ToKanbanLabels();
        Assert.Equal("Move c9", l.MoveButton!(new KanbanCard { Id = "c9", ColumnId = "todo", Title = "" }));
    }

    [Fact]
    public void Every_pack_builds_working_kanban_labels_with_no_placeholder_left_over()
    {
        foreach (var locale in PackFiles.Locales())
        {
            var l = PackFiles.Load(locale).ToKanbanLabels();
            var outputs = new[]
            {
                l.CardCount!(3), l.OverLimit!(3, 2), l.MoveButton!(Card), l.MoveAnnouncement!("C", "D"), l.MoveBlocked!("C", "D"), l.ReorderAnnouncement!("C", 1, 2),
                l.CollapseColumn!(Column, true), l.CollapseColumn!(Column, false), l.AddCard!(Column), l.EmptyColumn!(Column), l.MovePending!("C", "D"),
                l.MoveFailed!("C", "D", new Exception("x")), l.CollapseLane!(Lane, true), l.CollapseLane!(Lane, false), l.LaneCount!(Lane, 2),
                l.MoveManyAnnouncement!(2, "D"), l.UndoAnnouncement!("C", "D"), l.UndoManyAnnouncement!(2), l.ColumnMoveAnnouncement!("D", 1, 2),
                l.ExportAnnouncement!(DataGridExportFormat.Tsv, 2, "f"), l.EditAnnouncement!("C", "F", "T"), l.EditInvalid!("C", "F"), l.EditRefused!("C", "F", "M"),
                l.FieldUndoAnnouncement!("C", "F", "T"), l.FieldRedoAnnouncement!("C", "F", "T"), l.SearchAnnouncement!(1, 2), l.CopyAnnouncement!(2),
            };
            foreach (var o in outputs)
            {
                Assert.False(string.IsNullOrWhiteSpace(o), locale);
                Assert.DoesNotContain("{", o);
            }
            Assert.NotNull(l.ExportHeaders);
            Assert.False(string.IsNullOrWhiteSpace(l.Undo));
        }
    }
}
