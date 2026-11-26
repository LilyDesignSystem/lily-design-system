using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui.Tests;

[Collection("announcer")]
public class HealthcareControlTests
{
    private static string? Spoken(BindableObject view) => SemanticProperties.GetDescription(view);

    private static IEnumerable<Label> Labels(Layout layout) =>
        layout.Children.SelectMany(c => c switch { Label l => [l], Layout inner => Labels(inner), _ => [] });

    private static Label Part(Layout layout, string styleClass) =>
        Labels(layout).Single(l => l.StyleClass?.Contains(styleClass) == true);

    [Fact]
    public void MedicationViewIsOneStop_AndBoldsOnlyTheMarkedTallManSegments()
    {
        var view = new MedicationView
        {
            NameSegments = [new("hydr"), new("ALAZINE", TallMan: true)],
            Strength = "25 mg",
            Form = "tablet",
            Label = "Medicine",
        };
        Assert.Equal("Medicine\nhydrALAZINE\n25 mg\ntablet", Spoken(view));
        var spans = Part(view, "medication-view-name").FormattedText!.Spans;
        Assert.Equal([FontAttributes.None, FontAttributes.Bold], spans.Select(s => s.FontAttributes));
        Assert.False(Part(view, "medication-view-route").IsVisible);
    }

    [Fact]
    public void MedicationViewWithEmptySegmentsShowsThePlainName()
    {
        var view = new MedicationView { Name = "Example medicine", NameSegments = [], Strength = "10 mg" };
        Assert.Equal("Example medicine", Part(view, "medication-view-name").Text);
        Assert.Equal("Example medicine\n10 mg", Spoken(view));
    }

    [Fact]
    public void ObservationViewSpeaksValueUnitFlagRangeInOrder()
    {
        var view = new ObservationView
        {
            Label = "Potassium",
            Value = "5.8",
            Unit = "mmol/L",
            Interpretation = "H",
            FlagLabel = "High",
            Range = "3.5 to 5.3",
        };
        Assert.Equal($"Potassium\n5.8{ObservationRules.NoBreakSpace}mmol/L\nHigh\n3.5 to 5.3", Spoken(view));
        Assert.Equal("High", Part(view, "observation-view-flag").Text);
        Assert.Empty(view.Warnings);
    }

    [Fact]
    public void ObservationViewWithholdsAResultWhoseStatusHasNoWords_AndWarns()
    {
        var view = new ObservationView { Value = "5.8", Unit = "mmol/L", Status = ObservationStatus.Preliminary };
        Assert.False(Part(view, "observation-view-value").IsVisible);
        Assert.Equal(string.Empty, Spoken(view));
        Assert.Contains(view.Warnings, w => w.Contains("preliminary needs a StatusLabel"));
    }

    [Fact]
    public void AnUnlabelledFlagAndAnUnlabelledPreviousValueAreWarnings()
    {
        var view = new ObservationView { Value = "7", Interpretation = "HH", PreviousValue = "6" };
        Assert.Equal(2, view.Warnings.Count);
        var warned = new List<string>();
        LilyWarnings.Sink = warned.Add;
        try
        {
            LilyWarnings.Warn(view.Warnings);
            Assert.Equal(2, warned.Count);
            LilyWarnings.Enabled = false;
            LilyWarnings.Warn(view.Warnings);
            Assert.Equal(2, warned.Count);
        }
        finally
        {
            LilyWarnings.Enabled = true;
            LilyWarnings.Sink = _ => { };
        }
    }

    [Fact]
    public void AnEnteredInErrorResultSpeaksItsWordsFirst_AndShowsTheFormerValueOnlyInHistory()
    {
        var view = new ObservationView { Value = "5.8", Status = ObservationStatus.EnteredInError, StatusLabel = "Entered in error" };
        Assert.Equal("Entered in error", Spoken(view));
        Assert.False(Part(view, "observation-view-withdrawn").IsVisible);
        view.ShowWithdrawn = true;
        Assert.Equal("Entered in error\n5.8", Spoken(view));
        Assert.Equal(TextDecorations.Strikethrough, Part(view, "observation-view-withdrawn").TextDecorations);
    }

    [Fact]
    public void ACorrectedResultKeepsThePreviousValueStruckThroughWithItsWords()
    {
        var view = new ObservationView
        {
            Value = "5.2",
            Status = ObservationStatus.Corrected,
            StatusLabel = "Corrected",
            PreviousValue = "5.1",
            PreviousLabel = "was 5.1 until 3 Nov",
        };
        Assert.Equal("5.2\nCorrected\nwas 5.1 until 3 Nov", Spoken(view));
        Assert.Equal(TextDecorations.Strikethrough, Part(view, "observation-view-previous").TextDecorations);
    }

    [Fact]
    public void AgeAndDurationSpeakTheLabelFirst_AndAnInvalidDurationWarns()
    {
        var age = new AgeView { Text = "5 years 2 months", Label = "Age" };
        Assert.Equal("Age\n5 years 2 months", Spoken(age));
        var good = new DurationView { Text = "3 days early", Duration = "-P3D" };
        Assert.Equal("3 days early", Spoken(good));
        Assert.True(good.Parsed!.Negative);
        Assert.Empty(good.Warnings);
        var bad = new DurationView { Text = "soon", Duration = "P1Y" };
        Assert.Single(bad.Warnings);
    }

    [Fact]
    public void ADisclosureTogglesItsBody_AndTakesTheAppsOpenWords()
    {
        var body = new Label { Text = "Details" };
        var disclosure = new Disclosure { Label = "Show details", OpenLabel = "Hide details", Body = body };
        Assert.False(body.IsVisible);
        Assert.Equal("Show details", disclosure.Toggle.Text);
        ((IButtonController)disclosure.Toggle).SendClicked();
        Assert.True(disclosure.IsOpen);
        Assert.True(body.IsVisible);
        Assert.Equal("Hide details", disclosure.Toggle.Text);
        Assert.Contains("details-content", body.StyleClass!);
    }
}
