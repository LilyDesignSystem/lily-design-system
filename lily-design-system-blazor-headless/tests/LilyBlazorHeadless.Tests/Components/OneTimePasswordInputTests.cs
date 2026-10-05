using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class OneTimePasswordInputTests : TestContext
{
    private IRenderedComponent<OneTimePasswordInput> Render(Action<ComponentParameterCollectionBuilder<OneTimePasswordInput>>? extra = null, int length = 6)
        => RenderComponent<OneTimePasswordInput>(p =>
        {
            p.Add(x => x.Label, "Verification code").Add(x => x.Length, length);
            extra?.Invoke(p);
        });

    [Fact]
    public void Renders_one_native_text_input_with_base_class()
    {
        var root = Render().Find("input");
        Assert.Equal("text", root.GetAttribute("type"));
        Assert.StartsWith("one-time-password-input", root.GetAttribute("class"));
        Assert.Single(Render().FindAll("input"));
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var root = Render(p => p.Add(x => x.CssClass, "extra")).Find("input");
        Assert.Equal("one-time-password-input extra", root.GetAttribute("class"));
    }

    [Fact]
    public void Has_aria_label_from_label()
        => Assert.Equal("Verification code", Render().Find("input").GetAttribute("aria-label"));

    [Fact]
    public void Is_autofill_ready_with_numeric_keypad()
    {
        var root = Render().Find("input");
        Assert.Equal("one-time-code", root.GetAttribute("autocomplete"));
        Assert.Equal("numeric", root.GetAttribute("inputmode"));
    }

    [Fact]
    public void Maxlength_and_data_length_follow_length()
    {
        var root = Render(length: 8).Find("input");
        Assert.Equal("8", root.GetAttribute("maxlength"));
        Assert.Equal("8", root.GetAttribute("data-length"));
    }

    [Fact]
    public void Default_pattern_is_digits_and_overridable()
    {
        Assert.Equal("[0-9]*", Render().Find("input").GetAttribute("pattern"));
        Assert.Equal("[A-Z0-9]*", Render(p => p.Add(x => x.Pattern, "[A-Z0-9]*")).Find("input").GetAttribute("pattern"));
    }

    [Fact]
    public void InputMode_is_overridable()
        => Assert.Equal("text", Render(p => p.Add(x => x.InputMode, "text")).Find("input").GetAttribute("inputmode"));

    [Fact]
    public void Disables_spellcheck_and_autocapitalize()
    {
        var root = Render().Find("input");
        Assert.Equal("false", root.GetAttribute("spellcheck"));
        Assert.Equal("off", root.GetAttribute("autocapitalize"));
    }

    [Fact]
    public void Initial_value_is_shown()
        => Assert.Equal("123", Render(p => p.Add(x => x.Value, "123")).Find("input").GetAttribute("value"));

    [Fact]
    public void Input_event_updates_value_and_raises_ValueChanged()
    {
        string? seen = null;
        var cut = Render(p => p.Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => seen = v)));
        cut.Find("input").Input("482913");
        Assert.Equal("482913", seen);
        Assert.Equal("482913", cut.Instance.Value);
    }

    [Fact]
    public void Supports_name_required_and_disabled()
    {
        var root = Render(p => p.Add(x => x.Name, "otp").Add(x => x.Required, true).Add(x => x.Disabled, true)).Find("input");
        Assert.Equal("otp", root.GetAttribute("name"));
        Assert.True(root.HasAttribute("required"));
        Assert.True(root.HasAttribute("disabled"));
    }

    [Fact]
    public void Omits_required_and_disabled_by_default()
    {
        var root = Render().Find("input");
        Assert.False(root.HasAttribute("required"));
        Assert.False(root.HasAttribute("disabled"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
        => Assert.Equal("value", Render(p => p.AddUnmatched("data-test", "value")).Find("input").GetAttribute("data-test"));
}
