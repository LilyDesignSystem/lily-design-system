using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// A record list never says "none known" beside an entry (tasks.md P50-T2), in all seven lists.
public class RecordListConflictTests : TestContext
{
    private const string None = "No known allergies";
    private const string Conflict = "The record also says none are known. Check the source.";

    // list, its class, its item, and the parameter and value that withdraw an entry.
    public static TheoryData<Type, string, Type, string, string> Lists => new()
    {
        { typeof(RecordList), "record-list", typeof(RecordListItem), "EntryState", "entered-in-error" },
        { typeof(AllergyRecordList), "allergy-record-list", typeof(AllergyRecordListItem), "VerificationStatus", "refuted" },
        { typeof(MedicationRecordList), "medication-record-list", typeof(MedicationRecordListItem), "Status", "entered-in-error" },
        { typeof(ProblemRecordList), "problem-record-list", typeof(ProblemRecordListItem), "VerificationStatus", "refuted" },
        { typeof(ImmunizationRecordList), "immunization-record-list", typeof(ImmunizationRecordListItem), "Status", "entered-in-error" },
        { typeof(ProcedureRecordList), "procedure-record-list", typeof(ProcedureRecordListItem), "Status", "entered-in-error" },
        { typeof(DeviceRecordList), "device-record-list", typeof(DeviceRecordListItem), "Status", "entered-in-error" },
    };

    private static RenderFragment Item(Type item, string? parameter = null, string? value = null) => builder =>
    {
        builder.OpenComponent(0, item);
        builder.AddAttribute(1, "ChildContent", (RenderFragment)(b => b.AddContent(0, "Penicillin")));
        if (parameter is not null) builder.AddAttribute(2, parameter, value);
        builder.CloseComponent();
    };

    private IRenderedComponent<DynamicComponent> Show(
        Type list, string status, string words, string? conflict, RenderFragment? content) =>
        RenderComponent<DynamicComponent>(p => p.Add(x => x.Type, list).Add(x => x.Parameters, Given(status, words, conflict, content)));

    private static Dictionary<string, object> Given(string status, string words, string? conflict, RenderFragment? content)
    {
        var given = new Dictionary<string, object> { ["Status"] = status, ["StatusLabel"] = words };
        if (conflict is not null) given["ConflictLabel"] = conflict;
        if (content is not null) given["ChildContent"] = content;
        return given;
    }

    // HC-C17
    [Theory]
    [MemberData(nameof(Lists))]
    public void None_known_beside_an_entry_says_the_conflict(Type list, string css, Type item, string parameter, string value)
    {
        var cut = Show(list, "none-known", None, Conflict, Item(item));
        var ul = cut.Find($"ul.{css}");
        Assert.Contains("Penicillin", ul.TextContent);
        Assert.Equal(Conflict, cut.Find($".{css}-status").TextContent);
        Assert.Equal(Conflict, ul.GetAttribute("aria-label"));
        Assert.Equal("conflict", ul.GetAttribute("data-status"));
        Assert.DoesNotContain("No known", cut.Markup);
        Assert.NotNull(parameter + value);
    }

    // HC-C17
    [Theory]
    [MemberData(nameof(Lists))]
    public void With_no_words_none_known_still_goes(Type list, string css, Type item, string parameter, string value)
    {
        foreach (var words in new[] { null, "", "   ", " " })
        {
            var cut = Show(list, "none-known", None, words, Item(item));
            Assert.Contains("Penicillin", cut.Find($"ul.{css}").TextContent);
            Assert.DoesNotContain("No known", cut.Markup);
            Assert.Null(cut.Find($"ul.{css}").GetAttribute("aria-label"));
        }
        Assert.NotNull(parameter + value);
    }

    // HC-C17
    [Theory]
    [MemberData(nameof(Lists))]
    public void A_withdrawn_entry_or_none_is_none_known_as_before(Type list, string css, Type item, string parameter, string value)
    {
        foreach (var content in new[] { null, Item(item, parameter, value) })
        {
            var cut = Show(list, "none-known", None, Conflict, content);
            Assert.Equal(None, cut.Find($".{css}-status").TextContent);
            Assert.Equal("none-known", cut.Find($"ul.{css}").GetAttribute("data-status"));
        }
    }

    // HC-C17
    [Theory]
    [MemberData(nameof(Lists))]
    public void The_conflict_comes_and_goes(Type list, string css, Type item, string parameter, string value)
    {
        var cut = Show(list, "known", "Known", Conflict, Item(item));
        void Again(string status, string words, RenderFragment content) =>
            cut.SetParametersAndRender(p => p.Add(x => x.Parameters, Given(status, words, Conflict, content)));
        Assert.Empty(cut.FindAll($".{css}-status"));
        Again("none-known", None, Item(item));
        Assert.Equal(Conflict, cut.Find($".{css}-status").TextContent);
        Again("none-known", None, Item(item, parameter, value));
        Assert.Equal(None, cut.Find($".{css}-status").TextContent);
        Again("none-known", None, Item(item, parameter, null)); // omitted, it would keep its value
        Assert.Equal(Conflict, cut.Find($".{css}-status").TextContent);
        Again("none-known", None, _ => { });
        Assert.Equal(None, cut.Find($".{css}-status").TextContent);
        Again("unavailable", "Unavailable", Item(item));
        Assert.Equal("Unavailable", cut.Find($".{css}-status").TextContent);
        Assert.Equal("unavailable", cut.Find($"ul.{css}").GetAttribute("data-status"));
    }

    // HC-C17, P50-T29: inside an IPS section, every list tells the section of its conflict, and the section stops saying "none
    // known" above it; a list that goes away takes its conflict with it.
    [Theory]
    [MemberData(nameof(Lists))]
    public void A_section_steps_aside_above_a_list_in_conflict(Type list, string css, Type item, string parameter, string value)
    {
        RenderFragment Listed(RenderFragment? content) => builder =>
        {
            builder.OpenComponent<DynamicComponent>(0);
            builder.AddAttribute(1, "Type", list);
            builder.AddAttribute(2, "Parameters", Given("none-known", None, Conflict, content));
            builder.CloseComponent();
        };
        var cut = RenderComponent<InternationalPatientSummarySection>(p => p
            .Add(x => x.Section, "allergies")
            .Add(x => x.Heading, "Allergies")
            .Add(x => x.Status, "none-known")
            .Add(x => x.StatusLabel, None)
            .Add(x => x.ChildContent, Listed(Item(item))));
        cut.WaitForAssertion(() => Assert.Empty(cut.FindAll(".international-patient-summary-section-status")));
        Assert.Equal(Conflict, cut.Find($".{css}-status").TextContent);

        cut.SetParametersAndRender(p => p.Add(x => x.ChildContent, Listed(Item(item, parameter, value))));
        cut.WaitForAssertion(() => Assert.Equal(None, cut.Find(".international-patient-summary-section-status").TextContent));

        cut.SetParametersAndRender(p => p.Add(x => x.ChildContent, Listed(Item(item, parameter, null)))); // omitted, it would stay withdrawn
        cut.WaitForAssertion(() => Assert.Empty(cut.FindAll(".international-patient-summary-section-status")));
        cut.SetParametersAndRender(p => p.Add(x => x.ChildContent, (RenderFragment)(_ => { })));
        cut.WaitForAssertion(() => Assert.Equal(None, cut.Find(".international-patient-summary-section-status").TextContent));
    }
}
