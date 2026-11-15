// Colors tests — the C# colour model against what the canonical shared/colors.ts computes
// (tests/colors-parity.json, written by `node tests/write-colors-parity.mjs`).
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class ColorsTests
{
    private static readonly JsonElement Parity =
        JsonDocument.Parse(File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "colors-parity.json"))).RootElement;

    [Fact]
    public void TheCssNamesAreTheTypeScriptModulesInTheSameOrder()
    {
        var names = Parity.GetProperty("names").EnumerateArray().Select(n => n.GetString()!).ToList();
        Assert.Equal(148, Colors.CssNames.Count);
        Assert.Equal(names, Colors.CssNames);
    }

    [Fact]
    public void TheDefaultPaletteIsTheTypeScriptModules()
    {
        var palette = Parity.GetProperty("palette").EnumerateArray().Select(n => n.GetString()!).ToList();
        Assert.Equal(80, Colors.DefaultPalette().Count);
        Assert.Equal(palette, Colors.DefaultPalette());
    }

    [Fact]
    public void EveryConversionAgreesWithTheTypeScriptModule()
    {
        static double N(JsonElement o, string k) => o.GetProperty(k).GetDouble();
        foreach (var c in Parity.GetProperty("colors").EnumerateArray())
        {
            var hex = c.GetProperty("hex").GetString()!;
            var name = c.GetProperty("name");
            Assert.Equal(name.ValueKind == JsonValueKind.Null ? null : name.GetString(), Colors.NameOfColor(hex));
            var hsl = c.GetProperty("hsl");
            Assert.Equal(new Hsl(N(hsl, "h"), N(hsl, "s"), N(hsl, "l")), Colors.HexToHsl(hex));
            var hsb = c.GetProperty("hsb");
            Assert.Equal(new Hsb(N(hsb, "h"), N(hsb, "s"), N(hsb, "b")), Colors.HexToHsb(hex));
            var cmyk = c.GetProperty("cmyk");
            Assert.Equal(new Cmyk(N(cmyk, "c"), N(cmyk, "m"), N(cmyk, "y"), N(cmyk, "k")), Colors.HexToCmyk(hex));
            Assert.Equal(c.GetProperty("fromHsl").GetString(), Colors.HslToHex(Colors.HexToHsl(hex)!.Value));
            Assert.Equal(c.GetProperty("fromHsb").GetString(), Colors.HsbToHex(Colors.HexToHsb(hex)!.Value));
            Assert.Equal(c.GetProperty("fromCmyk").GetString(), Colors.CmykToHex(Colors.HexToCmyk(hex)!.Value));
        }
    }

    [Theory]
    [InlineData("#ABC", "#aabbcc")]
    [InlineData("005EB8", "#005eb8")]
    [InlineData(" #00ff00 ", "#00ff00")]
    [InlineData("#zz", null)]
    [InlineData("", null)]
    public void NormalizeHexReadsThreeOrSixDigits(string input, string? expected) =>
        Assert.Equal(expected, Colors.NormalizeHex(input));

    [Fact]
    public void PushRecentPutsTheColourFirstWithoutRepeats() =>
        Assert.Equal(new[] { "#b", "#a", "#c" }, Colors.PushRecent(new[] { "#a", "#b", "#c", "#d" }, "#b", 3));
}
