using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class DecisionSupportCardTests : TestContext
{
    private IRenderedComponent<DecisionSupportCard> Render(Action<ComponentParameterCollectionBuilder<DecisionSupportCard>>? more = null)
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        return RenderComponent<DecisionSupportCard>(p =>
        {
            p.Add(x => x.Summary, "Penicillin allergy recorded").Add(x => x.Indicator, "critical")
             .Add(x => x.IndicatorLabel, "Critical").Add(x => x.SourceLabel, "Local formulary");
            more?.Invoke(p);
        });
    }

    [Fact]
    public void Is_a_group_named_by_its_summary_not_a_live_region()
    {
        var card = Render().Find(".decision-support-card");
        Assert.Equal("group", card.GetAttribute("role"));
        Assert.Equal("Penicillin allergy recorded", card.GetAttribute("aria-label"));
        Assert.Equal("critical", card.GetAttribute("data-indicator"));
        Assert.Null(card.GetAttribute("aria-live"));
        Assert.Equal("Critical", card.QuerySelector(".decision-support-card-indicator")!.TextContent);
    }

    [Fact]
    public void A_suggestion_is_a_button_that_reports_its_id()
    {
        string? chosen = null;
        var cut = Render(p => p
            .Add(x => x.Suggestions, new[] { new DecisionSupportSuggestion("cancel", "Cancel amoxicillin", true) })
            .Add(x => x.OnSuggestion, (string id) => chosen = id));
        var button = cut.Find("button.decision-support-card-suggestion");
        Assert.Equal("true", button.GetAttribute("data-recommended"));
        button.Click();
        Assert.Equal("cancel", chosen);
    }

    [Fact]
    public void Dismissing_without_a_reason_is_refused_when_reasons_are_offered()
    {
        var dismissed = new List<string?>();
        var cut = Render(p => p
            .Add(x => x.DismissLabel, "Dismiss")
            .Add(x => x.OverrideReasons, new[] { new DecisionSupportOverrideReason("error", "Allergy recorded in error") })
            .Add(x => x.OverrideReasonLabel, "Reason for dismissing")
            .Add(x => x.OnDismiss, (string? reason) => dismissed.Add(reason)));
        cut.Find("form").Submit();
        Assert.Empty(dismissed);
        Assert.Equal("true", cut.Find("select").GetAttribute("aria-invalid"));
        cut.Find("select").Change("error");
        Assert.Null(cut.Find("select").GetAttribute("aria-invalid"));
        cut.Find("form").Submit();
        Assert.Equal(new string?[] { "error" }, dismissed);
    }

    [Fact]
    public void No_dismiss_control_without_its_words()
    {
        Assert.Empty(Render().FindAll("button"));
    }
}
