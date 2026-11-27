using LilyDesignSystem.Maui;
using LilyDesignSystem.Maui.Core;
using Microsoft.AspNetCore.Components.WebView.Maui;

namespace LilyMauiExamples;

/// <summary>Every general control, with real words: the app supplies each one, as it must.</summary>
public class NativePage : ContentPage
{
    public NativePage()
    {
        Title = "Native controls";
        var email = new Entry { Keyboard = Keyboard.Email };
        var field = new Field
        {
            Label = "Email address",
            Description = "We will only use this to reply to you",
            Required = true,
            RequiredLabel = "required",
            Control = email,
        };
        var summary = new ErrorSummary { Title = "There is a problem" };
        summary.Problems.Add(new Problem("Enter an email address", () => email.Focus()));
        var showSummary = new Button { Text = "Send" };
        showSummary.Clicked += (_, _) =>
        {
            field.Error = string.IsNullOrWhiteSpace(email.Text) ? "Enter an email address" : null;
            summary.IsVisible = field.Error is not null;
        };
        summary.IsVisible = false;

        var list = new SummaryList { Label = "Your details" };
        list.Children.Add(new SummaryListItem { Term = "Name", Value = "Sam Okoro" });
        list.Children.Add(new SummaryListItem { Term = "Date of birth", Value = "12 July 1990" });

        Content = new ScrollView
        {
            Content = new VerticalStackLayout
            {
                Padding = 16,
                Spacing = 16,
                Children =
                {
                    new LilyAlert { Heading = "Saved", Message = "Your changes are saved.", Kind = AlertKind.Success, Politeness = Politeness.Polite },
                    new HorizontalStackLayout
                    {
                        Spacing = 8,
                        Children = { new LilyBadge { Text = "3", Label = "3 unread messages" }, new Tag { Text = "High", Label = "Priority" } },
                    },
                    new InsetText { Text = "You can change your answers before you send them." },
                    new WarningText { Prefix = "Warning", Text = "You can be fined up to £5,000 if you do not register." },
                    summary,
                    field,
                    showSummary,
                    new LilyCard { Heading = "Your details", Body = list },
                    new Disclosure { Label = "Why we ask", OpenLabel = "Hide why we ask", Body = new Label { Text = "So the clinic can contact you about your appointment." } },
                },
            },
        };
    }
}

/// <summary>The healthcare controls, with invented records.</summary>
public class HealthcarePage : ContentPage
{
    public HealthcarePage()
    {
        Title = "Healthcare";
        var allergies = new AllergyRecordList { Status = RecordListStatus.Known, StatusLabel = "Known allergies", Label = "Allergies" };
        allergies.Items.Add(new AllergyRecordListItem
        {
            Words = new AllergyWords("Penicillin", Reaction: "Anaphylaxis", Severity: "Severe", Criticality: "High risk"),
            Codes = new AllergyCodes(Severity: "severe", Criticality: "high"),
        });
        var summary = new InternationalPatientSummary
        {
            Label = "Patient summary",
            ContentsLabel = "Contents",
            OmittedLabel = "Section missing from document",
            RequiredHeadings = new Dictionary<string, string>
            {
                ["medications"] = "Medication summary",
                ["allergies"] = "Allergies and intolerances",
                ["problems"] = "Problems",
            },
        };
        summary.Sections.Add(new InternationalPatientSummarySection { Section = "allergies", Heading = "Allergies and intolerances", Body = allergies });
        summary.Sections.Add(new InternationalPatientSummarySection
        {
            Section = "medications",
            Heading = "Medication summary",
            Body = new MedicationView
            {
                NameSegments = [new("hydr"), new("ALAZINE", TallMan: true)],
                Strength = "25 mg",
                Form = "tablet",
                Route = "oral",
                Frequency = "twice daily",
            },
        });

        Content = new ScrollView
        {
            Content = new VerticalStackLayout
            {
                Padding = 16,
                Spacing = 16,
                Children =
                {
                    new ObservationView
                    {
                        Label = "Potassium",
                        Value = "5.8",
                        Unit = "mmol/L",
                        Interpretation = "H",
                        FlagLabel = "High",
                        Range = "3.5 to 5.3",
                    },
                    new EarlyWarningScoreView { Label = "Early warning score", System = "NEWS2", Score = "5", Band = "medium", BandLabel = "Medium", Escalation = "Call the nurse in charge" },
                    new HorizontalStackLayout
                    {
                        Spacing = 16,
                        Children = { new AgeView { Text = "77 years", Label = "Age" }, new DurationView { Text = "3 days early", Duration = "-P3D" } },
                    },
                    new DecisionSupportCard
                    {
                        Summary = "Penicillin allergy recorded",
                        Indicator = DecisionSupportIndicator.Critical,
                        IndicatorLabel = "Critical",
                        SourceLabel = "Allergy checker",
                        Suggestions = [new DecisionSupportSuggestion("swap", "Prescribe an alternative")],
                        DismissLabel = "Dismiss",
                        OverrideReasons = [new DecisionSupportOverrideReason("aware", "Patient aware"), new DecisionSupportOverrideReason("na", "Not applicable")],
                        OverrideReasonLabel = "Reason for dismissing",
                        OverrideReasonError = "Choose a reason",
                    },
                    summary,
                },
            },
        };
    }
}

/// <summary>The whole catalog through Blazor Hybrid: the Blazor headless library, unchanged, in a BlazorWebView.</summary>
public class BlazorPage : ContentPage
{
    public BlazorPage()
    {
        Title = "Blazor catalog";
        var view = new BlazorWebView { HostPage = "wwwroot/index.html" };
        view.RootComponents.Add(new RootComponent { Selector = "#app", ComponentType = typeof(Components.Catalog) });
        Content = view;
    }
}
