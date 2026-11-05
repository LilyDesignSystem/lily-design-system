using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class RedOrangeYellowGreenBluePickerTests : TestContext
{
    public RedOrangeYellowGreenBluePickerTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<RedOrangeYellowGreenBluePicker> Make(Action<ComponentParameterCollectionBuilder<RedOrangeYellowGreenBluePicker>>? more = null) =>
        RenderComponent<RedOrangeYellowGreenBluePicker>(p =>
        {
            p.Add(x => x.Label, "Status").Add(x => x.RedLabel, "RED").Add(x => x.OrangeLabel, "ORANGE").Add(x => x.YellowLabel, "YELLOW").Add(x => x.GreenLabel, "GREEN").Add(x => x.BlueLabel, "BLUE");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.red-orange-yellow-green-blue-picker"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.red-orange-yellow-green-blue-picker").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.red-orange-yellow-green-blue-picker").GetAttribute("data-test"));

    [Fact]
    public void The_option_names_are_the_consumers()
    {
        var cut = Make();
        Assert.Equal("Status", cut.Find("select").GetAttribute("aria-label"));
        var options = cut.FindAll("option:not([hidden])");
        Assert.Equal(new[] { "red", "orange", "yellow", "green", "blue" }, options.Select(o => o.GetAttribute("value")));
        Assert.Equal(new[] { "RED", "ORANGE", "YELLOW", "GREEN", "BLUE" }, options.Select(o => o.TextContent));
    }

    [Fact]
    public void An_empty_value_has_a_hidden_option_to_show()
    {
        var empty = Make().Find("option[hidden]");
        Assert.Equal("", empty.GetAttribute("value"));
    }

    [Fact]
    public void Binds_a_value()
    {
        string? seen = null;
        var cut = Make(p => p.Add(x => x.Value, "green").Add(x => x.ValueChanged, (string v) => seen = v));
        Assert.Equal("green", cut.Find("select").GetAttribute("value"));
        cut.Find("select").Change("red");
        Assert.Equal("red", seen);
    }
}
