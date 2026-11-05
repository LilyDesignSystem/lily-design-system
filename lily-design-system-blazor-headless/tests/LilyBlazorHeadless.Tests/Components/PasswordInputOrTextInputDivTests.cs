using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class PasswordInputOrTextInputDivTests : TestContext
{
    public PasswordInputOrTextInputDivTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<PasswordInputOrTextInputDiv> Make(Action<ComponentParameterCollectionBuilder<PasswordInputOrTextInputDiv>>? more = null) =>
        RenderComponent<PasswordInputOrTextInputDiv>(p =>
        {
            p.Add(x => x.Label, "Password").Add(x => x.ToggleLabel, "Show");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.password-input-or-text-input-div"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.password-input-or-text-input-div").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.password-input-or-text-input-div").GetAttribute("data-test"));

    [Fact]
    public void The_toggle_shows_and_hides_the_text()
    {
        var cut = Make();
        Assert.Equal("password", cut.Find("input").GetAttribute("type"));
        Assert.Equal("current-password", cut.Find("input").GetAttribute("autocomplete"));
        Assert.Equal("false", cut.Find("button").GetAttribute("aria-pressed"));
        cut.Find("button").Click();
        Assert.Equal("text", cut.Find("input").GetAttribute("type"));
        Assert.Equal("true", cut.Find("button").GetAttribute("aria-pressed"));
    }

    [Fact]
    public void ShowToggle_hides_the_button() => Assert.Empty(Make(p => p.Add(x => x.ShowToggle, false)).FindAll("button"));
}
