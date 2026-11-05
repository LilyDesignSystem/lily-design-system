using System.Reflection;
using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

/// <summary>Every value input can be bound with @bind-Value, and none of the rest are forgotten.</summary>
public class ValueBindingTests : TestContext
{
    /// <summary>Inputs with no bound value, and why. Everything else must bind.</summary>
    private static readonly Dictionary<string, string> NoBinding = new()
    {
        ["ButtonInput"] = "a button",
        ["SubmitInput"] = "a button",
        ["ResetInput"] = "a button",
        ["ImageInput"] = "a button",
        ["HiddenInput"] = "nothing edits it",
        ["FileInput"] = "the browser keeps the files",
        ["ImageFileInput"] = "the browser keeps the files",
        ["RadioInput"] = "its value is fixed, and a group chooses",
        ["ToolCallInput"] = "displays a tool's input",
        ["CheckboxInput"] = "binds Checked",
        ["DateTimeNowInput"] = "binds DateValue and TimeValue",
        ["TextInputWithSearch"] = "P23-T16 stage 4",
    };

    public static IEnumerable<object[]> InputTypes() => typeof(ValueInputBase).Assembly.GetTypes()
        .Where(t => t.IsPublic && !t.IsAbstract && t.Name.EndsWith("Input") && typeof(IComponent).IsAssignableFrom(t))
        .Where(t => !NoBinding.ContainsKey(t.Name))
        .Select(t => new object[] { t });

    public static IEnumerable<object[]> TextInputs() => typeof(ValueInputBase).Assembly.GetTypes()
        .Where(t => !t.IsAbstract && t.IsSubclassOf(typeof(ValueInputBase)))
        .Where(t => !new[] { "ColorInput", "DateInput", "DateTimeLocalInput", "MonthInput", "Select", "TextAreaInput", "ThemeSelect", "TimeInput", "WeekInput" }.Contains(t.Name))
        .Select(t => new object[] { t });

    [Theory]
    [MemberData(nameof(InputTypes))]
    public void Has_a_bindable_value(Type type)
    {
        var value = type.GetProperty("Value");
        Assert.NotNull(value);
        Assert.NotNull(value!.GetCustomAttribute<ParameterAttribute>());
        var changed = type.GetProperty("ValueChanged");
        Assert.NotNull(changed);
        Assert.True(changed!.PropertyType.IsGenericType);
        Assert.Equal(value.PropertyType, changed.PropertyType.GetGenericArguments()[0]);
    }

    [Theory]
    [MemberData(nameof(TextInputs))]
    public void Value_reaches_the_input_and_typing_reaches_ValueChanged(Type type)
    {
        string? seen = null;
        JSInterop.Mode = JSRuntimeMode.Loose;
        var cut = Render(b =>
        {
            b.OpenComponent(0, type);
            b.AddAttribute(1, "Label", "Name");
            b.AddAttribute(2, "Value", "before");
            b.AddAttribute(3, "ValueChanged", EventCallback.Factory.Create<string>(this, v => seen = v));
            b.CloseComponent();
        });
        var input = cut.Find("input");
        Assert.Equal("before", input.GetAttribute("value"));
        input.Input("after");
        Assert.Equal("after", seen);
    }

    [Fact]
    public void The_date_kinds_bind_too()
    {
        foreach (var (type, text) in new[]
        {
            (typeof(ColorInput), "#112233"), (typeof(DateInput), "2026-11-05"), (typeof(DateTimeLocalInput), "2026-11-05T10:00"),
            (typeof(MonthInput), "2026-11"), (typeof(TimeInput), "10:00"), (typeof(WeekInput), "2026-W45"),
        })
        {
            string? seen = null;
            var cut = Render(b =>
            {
                b.OpenComponent(0, type);
                b.AddAttribute(1, "ValueChanged", EventCallback.Factory.Create<string>(this, v => seen = v));
                b.CloseComponent();
            });
            cut.Find("input").Input(text);
            Assert.Equal(text, seen);
        }
    }

    [Theory]
    [InlineData("10:15:00", "10:15")]
    [InlineData("10:00:00", "10:00")]
    [InlineData("10:00", "10:00")]
    [InlineData("10:15:30", "10:15:30")]
    public void Time_inputs_drop_the_seconds_Blazor_adds(string sent, string expected)
    {
        string? time = null, picker = null;
        RenderComponent<TimeInput>(p => p.Add(x => x.ValueChanged, (string v) => time = v)).Find("input").Input(sent);
        RenderComponent<TimePickerInput>(p => p.Add(x => x.ValueChanged, (string v) => picker = v)).Find("input").Input(sent);
        Assert.Equal(expected, time);
        Assert.Equal(expected, picker);
    }

    [Theory]
    [InlineData("2026-11-05T10:15:00", "2026-11-05T10:15")]
    [InlineData("2026-11-05T10:15:30", "2026-11-05T10:15:30")]
    public void DateTimeLocalInput_drops_them_too(string sent, string expected)
    {
        string? seen = null;
        RenderComponent<DateTimeLocalInput>(p => p.Add(x => x.ValueChanged, (string v) => seen = v)).Find("input").Input(sent);
        Assert.Equal(expected, seen);
    }

    [Fact]
    public void TextAreaInput_binds()
    {
        string? seen = null;
        var cut = RenderComponent<TextAreaInput>(p => p
            .Add(x => x.Value, "before")
            .Add(x => x.ValueChanged, (string v) => seen = v));
        var box = cut.Find("textarea");
        Assert.Equal("before", box.GetAttribute("value"));
        box.Input("after");
        Assert.Equal("after", seen);
    }

    [Fact]
    public void Numbers_bind()
    {
        double? number = null, money = null, range = null, angle = null;
        RenderComponent<NumberInput>(p => p.Add(x => x.ValueChanged, (double? v) => number = v)).Find("input").Change("4.5");
        RenderComponent<CurrencyInput>(p => p.Add(x => x.ValueChanged, (double? v) => money = v)).Find("input").Change("12.25");
        RenderComponent<RangeInput>(p => p.Add(x => x.ValueChanged, (double v) => range = v)).Find("input").Input("30");
        RenderComponent<AngleSliderRangeInput>(p => p.Add(x => x.ValueChanged, (double v) => angle = v)).Find("input").Input("90");
        Assert.Equal(4.5, number);
        Assert.Equal(12.25, money);
        Assert.Equal(30, range);
        Assert.Equal(90, angle);
    }

    [Fact]
    public void An_empty_number_is_no_number()
    {
        double? seen = 1;
        RenderComponent<NumberInput>(p => p.Add(x => x.Value, 1).Add(x => x.ValueChanged, (double? v) => seen = v))
            .Find("input").Change("");
        Assert.Null(seen);
    }

    [Fact]
    public void The_angle_slider_is_a_range_that_says_its_angle()
    {
        var input = RenderComponent<AngleSliderRangeInput>(p => p.Add(x => x.Value, 90)).Find("input");
        Assert.Equal("range", input.GetAttribute("type"));
        Assert.Equal("360", input.GetAttribute("max"));
        Assert.Null(input.GetAttribute("role"));
        Assert.Equal("90°", input.GetAttribute("aria-valuetext"));
    }

    [Fact]
    public void Checkbox_binds_Checked()
    {
        bool? seen = null;
        var cut = RenderComponent<CheckboxInput>(p => p
            .Add(x => x.Checked, true)
            .Add(x => x.CheckedChanged, (bool v) => seen = v));
        var box = cut.Find("input");
        Assert.True(box.HasAttribute("checked"));
        box.Change(false);
        Assert.False(seen);
    }

    [Fact]
    public void ImageFileInput_is_a_file_input()
    {
        Assert.Equal("file", RenderComponent<ImageFileInput>().Find("input").GetAttribute("type"));
    }
}
