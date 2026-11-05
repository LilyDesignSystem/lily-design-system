using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TimePickerInputTests : TestContext
{
    private IRenderedComponent<TimePickerInput> Make(Action<ComponentParameterCollectionBuilder<TimePickerInput>>? more = null) =>
        RenderComponent<TimePickerInput>(p =>
        {
            p
            .Add(x => x.Label, "Start");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("input.time-picker-input"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("input.time-picker-input").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("input.time-picker-input").GetAttribute("data-test"));

    [Fact]
    public void Is_a_named_time_input()
    {
        var root = Make().Find("input");
        Assert.Equal("time", root.GetAttribute("type"));
        Assert.Equal("Start", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void Binds_a_string()
    {
        string? seen = null;
        var cut = Make(p => p.Add(x => x.Value, "09:30").Add(x => x.ValueChanged, (string v) => seen = v));
        Assert.Equal("09:30", cut.Find("input").GetAttribute("value"));
        cut.Find("input").Input("10:15");
        Assert.Equal("10:15", seen);
    }

    [Fact]
    public void Required_and_Disabled_reach_the_input()
    {
        var root = Make(p => p.Add(x => x.Required, true).Add(x => x.Disabled, true)).Find("input");
        Assert.True(root.HasAttribute("required"));
        Assert.True(root.HasAttribute("disabled"));
    }
}
