using AngleSharp.Dom;
using Microsoft.AspNetCore.Components;
using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class PinInputDivTests : TestContext
{
    private string? _value;

    private IRenderedComponent<PinInputDiv> Make(string value = "", int length = 4, bool disabled = false, Func<int, int, string>? digitLabel = null)
    {
        var cut = RenderComponent<PinInputDiv>(p => p
            .Add(x => x.Label, "PIN")
            .Add(x => x.Value, value)
            .Add(x => x.Length, length)
            .Add(x => x.Disabled, disabled)
            .Add(x => x.DigitLabel, digitLabel)
            .Add(x => x.ValueChanged, (string v) => _value = v));
        _ids = cut.FindAll("input").Select(i => i.GetAttribute("blazor:elementReference")).ToArray();
        Assert.All(_ids, id => Assert.False(string.IsNullOrEmpty(id)));
        return cut;
    }

    private static IReadOnlyList<IElement> Inputs(IRenderedComponent<PinInputDiv> cut) => cut.FindAll("input");

    // The input that the last FocusAsync call moved focus to. bUnit prints an element's reference id only on its first
    // render, so the ids are read once, right after rendering.
    private string?[] _ids = Array.Empty<string?>();

    private int Focused()
    {
        var calls = JSInterop.Invocations.Where(i => i.Identifier == "Blazor._internal.domWrapper.focus").ToList();
        Assert.NotEmpty(calls);
        var target = (ElementReference)calls.Last().Arguments[0]!;
        return Array.IndexOf(_ids, target.Id);
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = Make();
        Assert.NotNull(cut.Find(".pin-input-div"));
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<PinInputDiv>(p => p.Add(x => x.CssClass, "extra"));
        Assert.Contains("extra", cut.Find(".pin-input-div").GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<PinInputDiv>(p => p.AddUnmatched("data-test", "value"));
        Assert.Equal("value", cut.Find(".pin-input-div").GetAttribute("data-test"));
    }

    [Fact]
    public void Is_a_labelled_group_of_single_digit_numeric_inputs()
    {
        var cut = Make(length: 6);
        var group = cut.Find(".pin-input-div");
        Assert.Equal("group", group.GetAttribute("role"));
        Assert.Equal("PIN", group.GetAttribute("aria-label"));
        Assert.Equal(6, Inputs(cut).Count);
        foreach (var input in Inputs(cut))
        {
            Assert.Equal("numeric", input.GetAttribute("inputmode"));
            Assert.Equal("1", input.GetAttribute("maxlength"));
            Assert.Equal("PIN", input.GetAttribute("aria-label"));
        }
    }

    [Fact]
    public void DigitLabel_names_each_input()
    {
        var cut = Make(digitLabel: (n, of) => $"Digit {n} of {of}");
        Assert.Equal(new[] { "Digit 1 of 4", "Digit 2 of 4", "Digit 3 of 4", "Digit 4 of 4" }, Inputs(cut).Select(i => i.GetAttribute("aria-label")));
    }

    [Fact]
    public void The_initial_value_fills_the_inputs_and_non_digits_are_dropped()
    {
        var cut = Make("1a3");
        Assert.Equal(new[] { "1", "", "3", "" }, Inputs(cut).Select(i => i.GetAttribute("value") ?? ""));
    }

    [Fact]
    public void Disabled_disables_every_input()
    {
        var cut = Make(disabled: true);
        Assert.All(Inputs(cut), i => Assert.True(i.HasAttribute("disabled")));
    }

    [Fact]
    public void A_digit_fills_the_input_updates_the_value_and_moves_focus_on()
    {
        var cut = Make();
        Inputs(cut)[0].Input("7");
        Assert.Equal("7", _value);
        Assert.Equal(1, Focused());
        Inputs(cut)[1].Input("2");
        Assert.Equal("72", _value);
        Assert.Equal(2, Focused());
    }

    [Fact]
    public void A_digit_in_the_last_input_does_not_move_focus()
    {
        var cut = Make("123");
        Inputs(cut)[3].Input("4");
        Assert.Equal("1234", _value);
        Assert.Equal(0, JSInterop.Invocations.Count(i => i.Identifier == "Blazor._internal.domWrapper.focus"));
    }

    [Fact]
    public void A_non_digit_is_refused()
    {
        var cut = Make("5");
        Inputs(cut)[0].Input("x");
        cut.WaitForAssertion(() => Assert.Equal("5", Inputs(cut)[0].GetAttribute("value")));
        Assert.Null(_value);
        Assert.Equal(0, JSInterop.Invocations.Count(i => i.Identifier == "Blazor._internal.domWrapper.focus"));
    }

    [Fact]
    public void ArrowRight_and_ArrowLeft_move_between_the_inputs_and_stop_at_the_ends()
    {
        var cut = Make();
        Inputs(cut)[1].KeyDown(new KeyboardEventArgs { Key = "ArrowRight" });
        Assert.Equal(2, Focused());
        Inputs(cut)[2].KeyDown(new KeyboardEventArgs { Key = "ArrowLeft" });
        Assert.Equal(1, Focused());
        var before = JSInterop.Invocations.Count;
        Inputs(cut)[0].KeyDown(new KeyboardEventArgs { Key = "ArrowLeft" });
        Inputs(cut)[3].KeyDown(new KeyboardEventArgs { Key = "ArrowRight" });
        Assert.Equal(before, JSInterop.Invocations.Count);
    }

    [Fact]
    public void Backspace_clears_a_filled_input_in_place()
    {
        var cut = Make("123");
        Inputs(cut)[1].KeyDown(new KeyboardEventArgs { Key = "Backspace" });
        Assert.Equal("13", _value);
        Assert.Equal(new[] { "1", "", "3", "" }, Inputs(cut).Select(i => i.GetAttribute("value") ?? ""));
        Assert.Equal(0, JSInterop.Invocations.Count(i => i.Identifier == "Blazor._internal.domWrapper.focus"));
    }

    [Fact]
    public void Backspace_in_an_empty_input_moves_back_and_clears_the_previous_digit()
    {
        var cut = Make("12");
        Inputs(cut)[2].KeyDown(new KeyboardEventArgs { Key = "Backspace" });
        Assert.Equal(1, Focused());
        Assert.Equal("1", _value);
    }
}
