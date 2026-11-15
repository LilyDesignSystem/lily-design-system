// ColorPicker tests — one or more [Fact] per spec/index.md rule.
//
// bUnit has no browser: the one listener the component installs (BuildKeysScript) travels over IJSRuntime "eval"
// and is recorded, not run; focus moves are recorded as FocusAsync invocations.
using System.Collections.Generic;
using System.Linq;
using AngleSharp.Dom;
using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class ColorPickerTests : TestContext
{
    private static readonly ColorPickerLabels Words = new()
    {
        Picker = "Text colour",
        Recent = "Recent colours",
        Palette = "Colours",
        Transparent = "Transparent",
        Custom = "Custom colour",
        Hex = "Hex",
        Name = "Colour name",
        Hue = "Hue",
        Saturation = "Saturation",
        Lightness = "Lightness",
        Brightness = "Brightness",
        Hsl = "HSL",
        Hsb = "HSB",
        Rgb = "RGB",
        Cmyk = "CMYK",
        Red = "Red",
        Green = "Green",
        Blue = "Blue",
        Cyan = "Cyan",
        Magenta = "Magenta",
        Yellow = "Yellow",
        Key = "Black",
        Invalid = "Not a colour",
    };

    private readonly List<string> _changes = new();
    private IReadOnlyList<string> _recent = new List<string>();

    private IRenderedComponent<ColorPicker> Render(Action<ComponentParameterCollectionBuilder<ColorPicker>>? more = null, string value = "")
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        return RenderComponent<ColorPicker>(p =>
        {
            p.Add(c => c.Labels, Words)
             .Add(c => c.Value, value)
             .Add(c => c.ValueChanged, (string v) => _changes.Add(v))
             .Add(c => c.RecentChanged, (IReadOnlyList<string> r) => _recent = r);
            more?.Invoke(p);
        });
    }

    private static IElement Root(IRenderedComponent<ColorPicker> cut) => cut.Find(".color-picker");
    private static IRefreshableElementCollection<IElement> PaletteRadios(IRenderedComponent<ColorPicker> cut) =>
        cut.FindAll(".color-picker-palette input[type=radio]");
    private static IElement Field(IRenderedComponent<ColorPicker> cut, string model, string key) =>
        cut.Find($".color-picker-{model}-{key}");

    [Fact]
    public void IsOneNamedGroupOfFourAreasSplitByTwoSeparators()
    {
        var cut = Render();
        var root = Root(cut);
        Assert.Equal("group", root.GetAttribute("role"));
        Assert.Equal("Text colour", root.GetAttribute("aria-label"));
        Assert.Equal("Recent colours", cut.Find(".color-picker-recent").GetAttribute("aria-label"));
        Assert.Equal("radiogroup", cut.Find(".color-picker-palette").GetAttribute("role"));
        Assert.Contains("Transparent", cut.Find("button.color-picker-transparent").TextContent);
        Assert.Equal("Custom colour", cut.Find(".color-picker-custom").GetAttribute("aria-label"));
        Assert.Equal(2, root.Children.Count(c => c.LocalName == "hr" && c.ClassList.Contains("color-picker-separator")));
    }

    [Fact]
    public void ThePaletteIsEightRowsOfTenRadiosPaintedByTheirCustomProperty()
    {
        var cut = Render();
        var rows = cut.FindAll(".color-picker-palette-row");
        Assert.Equal(8, rows.Count);
        Assert.All(rows, row => Assert.Equal(10, row.QuerySelectorAll("input[type=radio]").Length));
        var first = PaletteRadios(cut)[0];
        Assert.Equal("#000000", first.GetAttribute("data-color"));
        Assert.Equal("--color-picker-swatch: #000000", first.GetAttribute("style"));
        Assert.Equal("black", first.GetAttribute("aria-label"));
    }

    [Fact]
    public void ASwatchIsNamedByColorLabelElseItsCssNameElseItsHex()
    {
        var cut = Render(p => p.Add(c => c.Palette, new[] { "#ff0000", "#005eb8" }).Add(c => c.Columns, 2));
        var radios = PaletteRadios(cut);
        Assert.Equal("red", radios[0].GetAttribute("aria-label"));
        Assert.Equal("#005eb8", radios[1].GetAttribute("aria-label"));
        var named = Render(p => p.Add(c => c.Palette, new[] { "#ff0000" }).Add(c => c.ColorLabel, (Func<string, string>)(c => $"Colour {c}")));
        Assert.Equal("Colour #ff0000", PaletteRadios(named)[0].GetAttribute("aria-label"));
    }

    [Fact]
    public void ChoosingASwatchSetsTheValueAddsItToRecentAndCallsValueChangedOnce()
    {
        var cut = Render();
        var color = PaletteRadios(cut)[12].GetAttribute("value")!;
        PaletteRadios(cut)[12].Change(true);
        Assert.Equal(new[] { color }, _changes);
        Assert.Equal(color, Root(cut).GetAttribute("data-value"));
        var recent = cut.FindAll(".color-picker-recent input[type=radio]");
        Assert.Equal(new[] { color }, recent.Select(r => r.GetAttribute("value")));
        Assert.True(recent[0].HasAttribute("checked"));
        Assert.Equal(new[] { color }, _recent);
    }

    [Fact]
    public void RecentKeepsTheNewestFirstAndAtMostMaxRecent()
    {
        var cut = Render(p => p.Add(c => c.MaxRecent, 3));
        string ValueAt(int i) => PaletteRadios(cut)[i].GetAttribute("value")!;
        var (c11, c12, c13) = (ValueAt(11), ValueAt(12), ValueAt(13));
        foreach (var i in new[] { 10, 11, 12, 13, 11 }) PaletteRadios(cut)[i].Change(true);
        Assert.Equal(new[] { c11, c13, c12 }, _recent);
        Assert.Equal(new[] { c11, c13, c12 }, cut.FindAll(".color-picker-recent input").Select(r => r.GetAttribute("value")));
    }

    [Fact]
    public void ArrowDownAndArrowUpMoveAWholeRow()
    {
        var cut = Render();
        var colours = Colors.DefaultPalette();
        PaletteRadios(cut)[3].KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
        Assert.Equal(colours[13], _changes.Last());
        PaletteRadios(cut)[13].KeyDown(new KeyboardEventArgs { Key = "ArrowUp" });
        Assert.Equal(colours[3], _changes.Last());
        // From the top row, ArrowUp goes nowhere; Left and Right stay the browser's.
        PaletteRadios(cut)[3].KeyDown(new KeyboardEventArgs { Key = "ArrowUp" });
        PaletteRadios(cut)[3].KeyDown(new KeyboardEventArgs { Key = "ArrowRight" });
        Assert.Equal(2, _changes.Count);
        Assert.Equal(2, JSInterop.Invocations.Count(i => i.Identifier == "Blazor._internal.domWrapper.focus"));
    }

    [Fact]
    public void InstallsTheKeyListenerOnceAfterTheFirstRender()
    {
        var cut = Render();
        var scripts = JSInterop.Invocations.Where(i => i.Identifier == "eval").Select(i => (string)i.Arguments[0]!).ToList();
        Assert.Single(scripts);
        Assert.Contains(Root(cut).GetAttribute("id")!, scripts[0]);
        Assert.Contains("'ArrowDown'", scripts[0]);
        Assert.Contains("'Enter'", scripts[0]);
    }

    [Fact]
    public void TransparentChoosesTransparentAndSaysSoWithAriaPressed()
    {
        var cut = Render();
        Assert.Equal("false", cut.Find("button.color-picker-transparent").GetAttribute("aria-pressed"));
        cut.Find("button.color-picker-transparent").Click();
        Assert.Equal("true", cut.Find("button.color-picker-transparent").GetAttribute("aria-pressed"));
        Assert.Equal("transparent", Root(cut).GetAttribute("data-value"));
        Assert.Equal("true", cut.Find(".color-picker-transparent-icon").GetAttribute("aria-hidden"));
    }

    [Fact]
    public void AHexValueIsEnteredOnEnterAndAWrongOneIsMarkedInvalid()
    {
        var cut = Render();
        cut.Find(".color-picker-hex").Input("#zz");
        cut.Find(".color-picker-hex").KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Equal("true", cut.Find(".color-picker-hex").GetAttribute("aria-invalid"));
        Assert.Equal("Not a colour", cut.Find(".color-picker-invalid").TextContent);
        Assert.Empty(_changes);
        cut.Find(".color-picker-hex").Input("#005EB8");
        cut.Find(".color-picker-hex").KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Equal(new[] { "#005eb8" }, _changes);
        Assert.False(cut.Find(".color-picker-hex").HasAttribute("aria-invalid"));
        Assert.Equal("#005eb8", cut.Find(".color-picker-hex").GetAttribute("value"));
    }

    [Fact]
    public void ACssColourNameIsEnteredOfferedFromADatalistOfAll148()
    {
        var cut = Render();
        var list = cut.Find(".color-picker-name").GetAttribute("list")!;
        Assert.Equal(148, cut.Find($"datalist[id='{list}']").QuerySelectorAll("option").Length);
        cut.Find(".color-picker-name").Change("Tomato");
        Assert.Equal(new[] { "#ff6347" }, _changes);
        Assert.Equal("#ff6347", cut.Find(".color-picker-hex").GetAttribute("value"));
    }

    [Fact]
    public void TheEntryAreaHasFourModelGroupsEachShowingTheCurrentValue()
    {
        var cut = Render(value: "#ff0000");
        Assert.Equal(new[] { "HSL", "HSB", "RGB", "CMYK" }, cut.FindAll(".color-picker-custom legend").Select(l => l.TextContent));
        string V(string m, string k) => Field(cut, m, k).GetAttribute("value")!;
        Assert.Equal(new[] { "0", "100", "50" }, new[] { V("hsl", "h"), V("hsl", "s"), V("hsl", "l") });
        Assert.Equal(new[] { "0", "100", "100" }, new[] { V("hsb", "h"), V("hsb", "s"), V("hsb", "b") });
        Assert.Equal(new[] { "255", "0", "0" }, new[] { V("rgb", "r"), V("rgb", "g"), V("rgb", "b") });
        Assert.Equal(new[] { "0", "100", "100", "0" }, new[] { V("cmyk", "c"), V("cmyk", "m"), V("cmyk", "y"), V("cmyk", "k") });
        var hue = Field(cut, "hsl", "h");
        Assert.Equal("Hue", cut.Find($"label[for='{hue.Id}']").TextContent);
    }

    [Fact]
    public void EachModelsFieldsChangeTheValue()
    {
        var cut = Render(value: "#ff0000");
        Field(cut, "hsl", "h").Change("120");
        Assert.Equal("#00ff00", _changes.Last());
        Field(cut, "hsb", "b").Change("50");
        Assert.Equal("#008000", _changes.Last());
        Field(cut, "rgb", "b").Change("255");
        Assert.Equal("#0080ff", _changes.Last());
        Field(cut, "cmyk", "k").Change("100");
        Assert.Equal("#000000", _changes.Last());
    }

    [Fact]
    public void WithANameAHiddenInputCarriesTheValue()
    {
        var cut = Render(p => p.Add(c => c.Name, "colour"), value: "#ff0000");
        var hidden = cut.Find("input[type=hidden]");
        Assert.Equal("colour", hidden.GetAttribute("name"));
        Assert.Equal("#ff0000", hidden.GetAttribute("value"));
    }

    [Fact]
    public void DisabledDisablesEveryControl()
    {
        var cut = Render(p => p.Add(c => c.Disabled, true));
        Assert.True(cut.Find("button.color-picker-transparent").HasAttribute("disabled"));
        Assert.True(cut.Find(".color-picker-hex").HasAttribute("disabled"));
        Assert.True(cut.Find(".color-picker-palette").HasAttribute("disabled"));
    }

    [Fact]
    public void PassesOtherAttributesToTheRootAndAddsTheConsumersClass()
    {
        var cut = Render(p => p.Add(c => c.CssClass, "mine").AddUnmatched("data-testid", "cp"));
        Assert.Contains("mine", Root(cut).ClassList);
        Assert.Equal("cp", Root(cut).GetAttribute("data-testid"));
    }
}
