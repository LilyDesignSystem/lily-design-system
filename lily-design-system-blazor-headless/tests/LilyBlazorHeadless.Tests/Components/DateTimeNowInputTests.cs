using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class DateTimeNowInputTests : TestContext
{
    private IRenderedComponent<DateTimeNowInput> Labelled(Action<ComponentParameterCollectionBuilder<DateTimeNowInput>>? more = null) =>
        RenderComponent<DateTimeNowInput>(p =>
        {
            p.Add(x => x.Label, "Cita")
             .Add(x => x.DateLabel, "Fecha")
             .Add(x => x.TimeLabel, "Hora")
             .Add(x => x.NowLabel, "Ahora");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var root = Labelled().Find("div.date-time-now-input");
        Assert.Equal("group", root.GetAttribute("role"));
        Assert.Equal("Cita", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var root = Labelled(p => p.Add(x => x.CssClass, "extra")).Find(".date-time-now-input");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var root = Labelled(p => p.AddUnmatched("data-test", "value")).Find(".date-time-now-input");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Names_the_date_input_time_input_and_Now_button_from_its_parameters()
    {
        var cut = Labelled();
        Assert.Equal("Fecha", cut.Find("input[type=date]").GetAttribute("aria-label"));
        Assert.Equal("Hora", cut.Find("input[type=time]").GetAttribute("aria-label"));
        var button = cut.Find("button");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Equal("Ahora", button.GetAttribute("aria-label"));
        Assert.Equal("Ahora", button.TextContent.Trim());
    }

    [Fact]
    public void Has_no_English_default_without_labels_the_controls_carry_no_name_or_text()
    {
        var cut = RenderComponent<DateTimeNowInput>(p => p.Add(x => x.Label, "Cita"));
        foreach (var el in cut.FindAll("input, button")) Assert.False(el.HasAttribute("aria-label"));
        Assert.Equal("", cut.Find("button").TextContent.Trim());
        Assert.DoesNotMatch("Date|Time|Now", cut.Markup);
    }

    [Fact]
    public void Shows_and_writes_back_both_values()
    {
        string? date = null, time = null;
        var cut = Labelled(p => p
            .Add(x => x.DateValue, "2026-01-02")
            .Add(x => x.TimeValue, "03:04")
            .Add(x => x.DateValueChanged, v => date = v)
            .Add(x => x.TimeValueChanged, v => time = v));
        Assert.Equal("2026-01-02", cut.Find("input[type=date]").GetAttribute("value"));
        Assert.Equal("03:04", cut.Find("input[type=time]").GetAttribute("value"));
        cut.Find("input[type=date]").Input("2026-05-06");
        cut.Find("input[type=time]").Input("07:08");
        Assert.Equal("2026-05-06", date);
        Assert.Equal("07:08", time);
    }

    [Fact]
    public void Now_sets_both_to_the_current_local_date_and_time()
    {
        string? date = null, time = null;
        var before = DateTime.Now;
        var cut = Labelled(p => p
            .Add(x => x.DateValueChanged, v => date = v)
            .Add(x => x.TimeValueChanged, v => time = v));
        cut.Find("button").Click();
        var after = DateTime.Now;
        Assert.Matches(@"^\d{4}-\d{2}-\d{2}$", date);
        Assert.Matches(@"^\d{2}:\d{2}$", time);
        Assert.Contains(date, new[] { before.ToString("yyyy-MM-dd"), after.ToString("yyyy-MM-dd") });
        Assert.Contains(time, new[] { before.ToString("HH:mm"), after.ToString("HH:mm") });
        Assert.Equal(date, cut.Find("input[type=date]").GetAttribute("value"));
    }

    [Fact]
    public void Required_and_Disabled_reach_both_inputs_and_Disabled_the_button()
    {
        var cut = Labelled(p => p.Add(x => x.Required, true).Add(x => x.Disabled, true));
        foreach (var input in cut.FindAll("input"))
        {
            Assert.True(input.HasAttribute("required"));
            Assert.True(input.HasAttribute("disabled"));
        }
        Assert.True(cut.Find("button").HasAttribute("disabled"));
    }
}
