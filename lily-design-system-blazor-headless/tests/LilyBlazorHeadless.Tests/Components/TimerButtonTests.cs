using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TimerButtonTests : TestContext
{
    public TimerButtonTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<TimerButton> Make(Action<ComponentParameterCollectionBuilder<TimerButton>>? more = null) =>
        RenderComponent<TimerButton>(p =>
        {
            p.Add(x => x.Label, "Continue").Add(x => x.Duration, 30);
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("button.timer-button"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("button.timer-button").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("button.timer-button").GetAttribute("data-test"));

    [Fact]
    public void Starts_at_the_duration_in_a_live_button()
    {
        var button = Make().Find("button");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Equal("polite", button.GetAttribute("aria-live"));
        Assert.Equal("30", button.GetAttribute("data-remaining-seconds"));
    }

    [Fact]
    public void Counts_down_and_fires_once()
    {
        var fired = 0;
        var cut = RenderComponent<TimerButton>(p => p.Add(x => x.Label, "Continue").Add(x => x.Duration, 1).Add(x => x.OnClick, () => fired++));
        cut.WaitForAssertion(() => Assert.Equal(1, fired), TimeSpan.FromSeconds(3));
        Assert.Equal("0", cut.Find("button").GetAttribute("data-remaining-seconds"));
        Thread.Sleep(600);
        Assert.Equal(1, fired);
    }

    [Fact]
    public void Pressing_fires_at_once_and_only_once()
    {
        var fired = 0;
        var cut = Make(p => p.Add(x => x.OnClick, () => fired++));
        cut.Find("button").Click();
        cut.Find("button").Click();
        Assert.Equal(1, fired);
    }

    [Fact]
    public void Disabled_has_no_countdown()
    {
        var fired = 0;
        var cut = RenderComponent<TimerButton>(p => p.Add(x => x.Label, "Continue").Add(x => x.Duration, 0).Add(x => x.Disabled, true).Add(x => x.OnClick, () => fired++));
        Assert.True(cut.Find("button").HasAttribute("disabled"));
        Thread.Sleep(400);
        Assert.Equal(0, fired);
    }
}
