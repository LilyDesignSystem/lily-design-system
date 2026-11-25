using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class MedicationViewTests : TestContext
{
    [Fact]
    public void Renders_each_part()
    {
        var cut = RenderComponent<MedicationView>(p => p
            .Add(x => x.Name, "amoxicillin").Add(x => x.Strength, "500 mg").Add(x => x.Form, "capsule")
            .Add(x => x.Route, "oral").Add(x => x.Frequency, "three times daily"));
        Assert.Equal("amoxicillin", cut.Find(".medication-view-name").TextContent);
        Assert.Equal("500 mg", cut.Find(".medication-view-strength").TextContent);
        Assert.Equal("capsule", cut.Find(".medication-view-form").TextContent);
        Assert.Equal("oral", cut.Find(".medication-view-route").TextContent);
        Assert.Equal("three times daily", cut.Find(".medication-view-frequency").TextContent);
    }

    // HC-C6
    [Fact]
    public void Marks_the_consumers_tall_man_segments_and_none_of_its_own()
    {
        var cut = RenderComponent<MedicationView>(p => p.Add(x => x.NameSegments,
            new[] { new MedicationNameSegment("hydr"), new MedicationNameSegment("ALAZINE", true) }));
        Assert.Equal("hydrALAZINE", cut.Find(".medication-view-name").TextContent);
        Assert.Equal("ALAZINE", Assert.Single(cut.FindAll(".medication-view-tall-man")).TextContent);
        var plain = RenderComponent<MedicationView>(p => p.Add(x => x.Name, "hydroxyzine HCl"));
        Assert.Empty(plain.FindAll(".medication-view-tall-man"));
    }

    [Fact]
    public void Renders_a_free_text_dose_as_its_own_part()
    {
        var cut = RenderComponent<MedicationView>(p => p.Add(x => x.Name, "metformin").Add(x => x.DosageText, "Take one tablet twice a day with food"));
        Assert.Equal("Take one tablet twice a day with food", cut.Find(".medication-view-dosage").TextContent);
    }
}
