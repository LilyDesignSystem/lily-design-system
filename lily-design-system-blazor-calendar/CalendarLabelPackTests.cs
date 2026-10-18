// Calendar label pack tests: the builder against the real pack files in shared/label-packs.

using LilyDesignSystem.Blazor.Helpers;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class CalendarLabelPackTests
{
    [Fact]
    public void English_labels_fill_as_written()
    {
        var l = PackFiles.Load("en-001").ToCalendarLabels();
        Assert.Equal("Next four weeks", l.Next!(CalendarViewMode.FourWeek));
        Assert.Equal("Previous month", l.Previous!(CalendarViewMode.Agenda));
        Assert.Equal("Week 3", l.WeekNumber!(3));
        Assert.Equal("Dentist moved to 2026-01-02", l.EventMoveAnnouncement!(new CalendarEvent { Id = "e1", Title = "Dentist" }, "2026-01-02"));
        Assert.Equal("e7 moved to 2026-01-02", l.EventMoveAnnouncement!(new CalendarEvent { Id = "e7" }, "2026-01-02"));
        Assert.Equal("Title", l.ExportHeaders!.Title);
        Assert.Null(l.Weekday);
        Assert.Null(l.PeriodTitle);
        Assert.Null(l.PeriodTitleWithAnchor);
    }

    [Fact]
    public void Every_pack_builds_working_calendar_labels_with_no_placeholder_left_over()
    {
        foreach (var locale in PackFiles.Locales())
        {
            var l = PackFiles.Load(locale).ToCalendarLabels();
            var outputs = new List<string>
            {
                l.WeekNumber!(3), l.EventMoveAnnouncement!(new CalendarEvent { Id = "e1", Title = "T" }, "d"), l.ExportAnnouncement!(DataGridExportFormat.Xlsx, 2, "f"),
                l.EditAnnouncement!("E", "F", "T"), l.EditInvalid!("E", "F"), l.EditRefused!("E", "F", "M"), l.FieldUndoAnnouncement!("E", "F", "T"),
                l.FieldRedoAnnouncement!("E", "F", "T"), l.SearchAnnouncement!(1, 2), l.CopyAnnouncement!(2),
            };
            foreach (var mode in Enum.GetValues<CalendarViewMode>()) { outputs.Add(l.Previous!(mode)); outputs.Add(l.Next!(mode)); }
            foreach (var o in outputs)
            {
                Assert.False(string.IsNullOrWhiteSpace(o), locale);
                Assert.DoesNotContain("{", o);
            }
            Assert.NotNull(l.ExportHeaders);
            Assert.False(string.IsNullOrWhiteSpace(l.Today));
        }
    }
}
