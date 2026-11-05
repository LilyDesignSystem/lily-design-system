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
            p.Add(x => x.Label, "Birthday");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.date-field"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.date-field").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.date-field").GetAttribute("data-test"));

    [Fact]
    public void The_label_names_a_date_input()
    {
        var cut = Make(p => p.Add(x => x.Id, "when"));
        Assert.Equal("when", cut.Find("label").GetAttribute("for"));
        var input = cut.Find("input.date-input");
        Assert.Equal("when", input.Id);
        Assert.Equal("date", input.GetAttribute("type"));
    }

    [Fact]
    public void An_id_is_generated_without_one_given()
    {
        var cut = Make();
        Assert.False(string.IsNullOrEmpty(cut.Find("input").Id));
        Assert.Equal(cut.Find("input").Id, cut.Find("label").GetAttribute("for"));
    }

    [Fact]
    public void Description_and_error_are_linked()
    {
        var cut = Make(p => p.Add(x => x.Id, "d").Add(x => x.Description, "Help").Add(x => x.Error, "Bad"));
        var input = cut.Find("input");
        Assert.Equal("d-desc", input.GetAttribute("aria-describedby"));
        Assert.Equal("true", input.GetAttribute("aria-invalid"));
        Assert.Equal("d-error", input.GetAttribute("aria-errormessage"));
        Assert.Equal("Help", cut.Find("#d-desc").TextContent);
        Assert.Equal("alert", cut.Find("#d-error").GetAttribute("role"));
    }

    [Fact]
    public void With_neither_nothing_is_linked_and_the_root_is_no_alert()
    {
        var cut = Make();
        Assert.False(cut.Find("input").HasAttribute("aria-invalid"));
        Assert.Empty(cut.FindAll("[role=alert]"));
    }

    [Fact]
    public void Binds_a_string()
    {
        string? seen = null;
        Make(p => p.Add(x => x.ValueChanged, (string v) => seen = v)).Find("input").Input("2026-11-05");
        Assert.Equal("2026-11-05", seen);
    }
}
