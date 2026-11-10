using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class DateFieldTests : TestContext
{
    public DateFieldTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<DateField> Make(Action<ComponentParameterCollectionBuilder<DateField>>? more = null) =>
        RenderComponent<DateField>(p =>
        {
            p.Add(x => x.Label, "Date of birth").Add(x => x.DayLabel, "Day").Add(x => x.MonthLabel, "Month").Add(x => x.YearLabel, "Year");
            more?.Invoke(p);
        });

    private static string[] Parts(IRenderedComponent<DateField> cut) =>
        cut.FindAll("input").Select(i => i.GetAttribute("class") ?? "").ToArray();

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("fieldset.date-field"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("fieldset.date-field").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("fieldset.date-field").GetAttribute("data-test"));

    [Fact]
    public void The_legend_names_the_group_and_each_part_has_a_label()
    {
        var cut = Make(p => p.Add(x => x.Id, "dob"));
        Assert.Equal("Date of birth", cut.Find("legend").TextContent);
        Assert.Equal("Day", cut.Find("label[for=dob-day]").TextContent);
        Assert.Equal("numeric", cut.Find("#dob-day").GetAttribute("inputmode"));
        Assert.Equal("text", cut.Find("#dob-day").GetAttribute("type"));
    }

    [Fact]
    public void Parts_are_in_ISO_order_by_default_and_in_the_order_asked_for()
    {
        Assert.Equal(new[] { "date-field-year", "date-field-month", "date-field-day" }, Parts(Make()));
        Assert.Equal(new[] { "date-field-day", "date-field-month", "date-field-year" }, Parts(Make(p => p.Add(x => x.Order, "dmy"))));
    }

    [Fact]
    public void Value_fills_the_parts_and_name_names_them()
    {
        var cut = Make(p => p.Add(x => x.Value, "2007-03-27").Add(x => x.Name, "dob"));
        Assert.Equal("27", cut.Find(".date-field-day").GetAttribute("value"));
        Assert.Equal("dob-day", cut.Find(".date-field-day").GetAttribute("name"));
        Assert.Equal("2007", cut.Find(".date-field-year").GetAttribute("value"));
    }

    [Fact]
    public void Binds_YYYY_MM_DD_once_every_part_is_filled()
    {
        string? seen = null;
        var cut = Make(p => p.Add(x => x.ValueChanged, (string v) => seen = v));
        cut.Find(".date-field-day").Input("5");
        cut.Find(".date-field-month").Input("9");
        Assert.Equal("", seen);
        cut.Find(".date-field-year").Input("1990");
        Assert.Equal("1990-09-05", seen);
    }

    [Fact]
    public void Description_and_error_are_linked_from_the_fieldset()
    {
        var cut = Make(p => p.Add(x => x.Id, "d").Add(x => x.Description, "Help").Add(x => x.Error, "Bad"));
        Assert.Equal("d-desc d-error", cut.Find("fieldset").GetAttribute("aria-describedby"));
        Assert.Equal("true", cut.Find(".date-field-day").GetAttribute("aria-invalid"));
        Assert.Equal("alert", cut.Find("#d-error").GetAttribute("role"));
    }

    [Fact]
    public void With_neither_nothing_is_linked_and_there_is_no_alert()
    {
        var cut = Make();
        Assert.False(cut.Find("fieldset").HasAttribute("aria-describedby"));
        Assert.False(cut.Find(".date-field-day").HasAttribute("aria-invalid"));
        Assert.Empty(cut.FindAll("[role=alert]"));
    }

    [Fact]
    public void Autocomplete_bday_marks_the_parts() =>
        Assert.Equal("bday-month", Make(p => p.Add(x => x.Autocomplete, "bday")).Find(".date-field-month").GetAttribute("autocomplete"));
}
