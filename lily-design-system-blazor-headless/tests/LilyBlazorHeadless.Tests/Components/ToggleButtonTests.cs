using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ToggleButtonTests : TestContext
{
    private IRenderedComponent<ToggleButton> Make(Action<ComponentParameterCollectionBuilder<ToggleButton>>? more = null) =>
        RenderComponent<ToggleButton>(p =>
        {
            p
            .Add(x => x.Label, "Mute");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("button.toggle-button"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("button.toggle-button").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("button.toggle-button").GetAttribute("data-test"));

    [Fact]
    public void Is_a_switch_with_its_state_and_name()
    {
        var root = Make().Find("button");
        Assert.Equal("button", root.GetAttribute("type"));
        Assert.Equal("switch", root.GetAttribute("role"));
        Assert.Equal("false", root.GetAttribute("aria-checked"));
        Assert.Equal("Mute", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void Clicking_toggles_and_reports()
    {
        bool? seen = null;
        var cut = Make(p => p.Add(x => x.PressedChanged, (bool v) => seen = v));
        cut.Find("button").Click();
        Assert.True(seen);
        Assert.Equal("true", cut.Find("button").GetAttribute("aria-checked"));
        cut.Find("button").Click();
        Assert.False(seen);
        Assert.Equal("false", cut.Find("button").GetAttribute("aria-checked"));
    }

    [Fact]
    public void Disabled_does_not_toggle()
    {
        var cut = Make(p => p.Add(x => x.Disabled, true));
        Assert.True(cut.Find("button").HasAttribute("disabled"));
        cut.Find("button").Click();
        Assert.Equal("false", cut.Find("button").GetAttribute("aria-checked"));
    }
}
