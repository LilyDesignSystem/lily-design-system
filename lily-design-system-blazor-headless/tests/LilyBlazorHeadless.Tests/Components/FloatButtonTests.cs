using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class FloatButtonTests : TestContext
{
    public FloatButtonTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<FloatButton> Make(Action<ComponentParameterCollectionBuilder<FloatButton>>? more = null) =>
        RenderComponent<FloatButton>(p =>
        {
            p.Add(x => x.Label, "Help");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("button.float-button"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("button.float-button").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("button.float-button").GetAttribute("data-test"));

    [Fact]
    public void Is_named_and_defaults_to_the_bottom_right()
    {
        var button = Make().Find("button");
        Assert.Equal("Help", button.GetAttribute("aria-label"));
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Equal("bottom-right", button.GetAttribute("data-position"));
        Assert.Equal("position: fixed; bottom: 1rem; right: 1rem;", button.GetAttribute("style"));
    }

    [Fact]
    public void Position_type_and_disabled_are_passed_on()
    {
        var button = Make(p => p.Add(x => x.Position, "top-left").Add(x => x.Type, "submit").Add(x => x.Disabled, true)).Find("button");
        Assert.Equal("position: fixed; top: 1rem; left: 1rem;", button.GetAttribute("style"));
        Assert.Equal("submit", button.GetAttribute("type"));
        Assert.True(button.HasAttribute("disabled"));
    }

    [Fact]
    public void Clicking_reports()
    {
        var clicks = 0;
        Make(p => p.Add(x => x.OnClick, () => clicks++)).Find("button").Click();
        Assert.Equal(1, clicks);
    }
}
