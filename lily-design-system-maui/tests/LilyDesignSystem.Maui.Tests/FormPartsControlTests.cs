using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui.Tests;

// The MAUI form parts (tasks.md P62-T3), read from what MAUI hands the platform screen reader. Announcements go to a
// RecordingAnnouncer, so these run with the other announcer tests, one at a time.
[Collection("announcer")]
public class FormPartsControlTests
{
    [Fact]
    public void ADateFieldsPartsAreInTheReadersOrder_SpokenWithTheDate_AndJoinToIso()
    {
        var field = new DateField { Label = "Date of birth", DayLabel = "Day", MonthLabel = "Month", YearLabel = "Year", Order = "dmy", Error = "Enter a date" };
        Assert.Equal(["day", "month", "year"], field.PartEntries.Keys);
        Assert.Equal("Date of birth\nDay\nEnter a date", SemanticProperties.GetDescription(field.PartEntries["day"]));
        field.PartEntries["day"].Text = "3";
        field.PartEntries["month"].Text = "2";
        Assert.Equal("", field.Value);
        field.PartEntries["year"].Text = "1949";
        Assert.Equal("1949-02-03", field.Value);
        field.Value = "2000-12-25";
        Assert.Equal("25", field.PartEntries["day"].Text);
        Assert.Empty(field.Warnings());
        Assert.Equal(2, new DateField { YearLabel = "Year" }.Warnings().Count);
    }

    [Fact]
    public void AQuantityIsSpokenWithItsName_KeepsToItsUnitsLimits_AndOffersUnitsWhenThereAreMore()
    {
        var input = new QuantityInput
        {
            Label = "Your weight",
            MagnitudeLabel = "Weight",
            UnitLabel = "Weight unit",
            Units = [new("kg", "kilograms", 1, 400), new("lb", "pounds", 2, 880)],
        };
        Assert.Equal("kg", input.Unit);
        Assert.Equal("Your weight\nWeight", SemanticProperties.GetDescription(input.Magnitude));
        input.Magnitude.Text = "500";
        Assert.Equal("above-maximum", input.Problem);
        var unitChanges = 0;
        input.UnitChanged += (_, _) => unitChanges++;
        input.Unit = "lb";
        input.Unit = "lb";
        Assert.Equal(1, unitChanges);
        Assert.Null(input.Problem);
        input.Magnitude.Text = "";
        Assert.Equal("empty", input.Problem);

        var height = new QuantityInput { Label = "Your height", MagnitudeLabel = "Height", Units = [new("cm", "centimetres")] };
        Assert.Equal("Your height\nHeight\ncentimetres", SemanticProperties.GetDescription(height.Magnitude));
    }

    [Fact]
    public void ARepeatableFieldsetAddsAndRemovesWithinItsLimits_AndAnnouncesEachChange()
    {
        var spoken = new RecordingAnnouncer();
        LilyAnnouncer.Current = spoken;
        var changes = 0;
        var fieldset = new RepeatableFieldset<string>
        {
            Legend = "Medicines",
            Items = ["Ramipril"],
            NewItem = () => "",
            ItemView = (item, _) => new Label { Text = item },
            ItemLegend = n => $"Medicine {n}",
            AddLabel = "Add a medicine",
            RemoveLabel = n => $"Remove medicine {n}",
            Min = 1,
            Max = 2,
            AddedLabel = n => $"Medicine {n} added",
            RemovedLabel = n => $"Medicine {n} removed",
        };
        fieldset.ItemsChanged += (_, _) => changes++;
        Assert.Empty(fieldset.RemoveButtons);
        Assert.True(fieldset.AddButton.IsEnabled);
        fieldset.AddButton.SendClicked();
        Assert.Equal(2, fieldset.Items.Count);
        Assert.False(fieldset.AddButton.IsEnabled);
        Assert.Equal(["Remove medicine 1", "Remove medicine 2"], fieldset.RemoveButtons.Select(b => b.Text));
        fieldset.RemoveButtons[1].SendClicked();
        Assert.Equal(["Ramipril"], fieldset.Items);
        Assert.Equal(["Medicine 2 added", "Medicine 2 removed"], spoken.Spoken);
        Assert.Equal(2, changes);
    }

    [Fact]
    public void EachStepIsOneStopSayingItsStatusInWords()
    {
        var list = new StepList
        {
            Label = "Questions",
            Steps = ["About you", "Medicines", "Check"],
            Current = 1,
            StatusLabel = s => s switch { "finished" => "Done", "in-progress" => "Now", _ => "To do" },
        };
        Assert.Equal(
            ["About you\nDone", "Medicines\nNow", "Check\nTo do"],
            list.Children.Select(c => SemanticProperties.GetDescription((BindableObject)c)));
        Assert.Contains("step-list-item-in-progress", ((VisualElement)list.Children[1]).StyleClass!);
        Assert.Equal(["waiting", "waiting"], StepList.Statuses(2, -1));
    }
}
