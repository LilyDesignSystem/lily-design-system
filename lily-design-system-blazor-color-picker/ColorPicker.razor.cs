using System.Globalization;
using System.Text.Json;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>Code-behind for <c>ColorPicker.razor</c>. Contract: <c>spec/index.md</c>.</summary>
public partial class ColorPicker : ComponentBase
{
    private static int _counter;
    private readonly string _id;
    private ElementReference[] _swatches = Array.Empty<ElementReference>();
    private string _hexDraft = "";
    private string _nameDraft = "";
    private bool _hexInvalid;
    private bool _nameInvalid;
    private string? _shownValue;
    private IReadOnlyList<string>? _recentParameter;
    private IReadOnlyList<string> _recent = Array.Empty<string>();

    public ColorPicker()
    {
        _id = $"color-picker-{Interlocked.Increment(ref _counter)}";
    }

    [Inject] private IJSRuntime JS { get; set; } = default!;

    /// <summary>Every visible and accessible word. Required: the helper ships no English.</summary>
    [Parameter, EditorRequired] public ColorPickerLabels Labels { get; set; } = default!;

    /// <summary>The chosen colour: "#rrggbb", "transparent", or "" for none. Two-way: <c>@bind-Value</c>.</summary>
    [Parameter] public string Value { get; set; } = "";
    [Parameter] public EventCallback<string> ValueChanged { get; set; }

    /// <summary>Recent choices, newest first, at most <see cref="MaxRecent"/>. Two-way: <c>@bind-Recent</c>.</summary>
    [Parameter] public IReadOnlyList<string> Recent { get; set; } = Array.Empty<string>();
    [Parameter] public EventCallback<IReadOnlyList<string>> RecentChanged { get; set; }

    /// <summary>How many recent colours to keep. Default 10.</summary>
    [Parameter] public int MaxRecent { get; set; } = 10;

    /// <summary>The palette's colours, row by row. Default <see cref="Colors.DefaultPalette"/>: 8 rows of 10.</summary>
    [Parameter] public IReadOnlyList<string>? Palette { get; set; }

    /// <summary>Swatches per palette row. Default 10.</summary>
    [Parameter] public int Columns { get; set; } = 10;

    /// <summary>A swatch's accessible name. Default: its CSS colour name when it has one, else its hex value.</summary>
    [Parameter] public Func<string, string>? ColorLabel { get; set; }

    /// <summary>Form field name: renders a hidden input carrying the value.</summary>
    [Parameter] public string? Name { get; set; }

    /// <summary>Disables every control.</summary>
    [Parameter] public bool Disabled { get; set; }

    [Parameter] public string CssClass { get; set; } = "";
    [Parameter(CaptureUnmatchedValues = true)] public Dictionary<string, object>? AdditionalAttributes { get; set; }

    private static readonly IReadOnlyList<string> DefaultColors = Colors.DefaultPalette();

    private string RootClass => $"color-picker {CssClass}".Trim();
    private int ColumnCount => Math.Max(1, Columns);
    private IReadOnlyList<string> Colours => Palette ?? DefaultColors;

    private List<List<string>> Rows =>
        Colours.Select((c, i) => (c, i)).GroupBy(x => x.i / ColumnCount).Select(g => g.Select(x => x.c).ToList()).ToList();

    private string LabelOf(string color)
    {
        if (ColorLabel is not null) return ColorLabel(color);
        if (color == Colors.Transparent) return Labels.Transparent;
        return Colors.NameOfColor(color) ?? color;
    }

    internal sealed record Field(string Key, string Label, int Max);
    internal sealed record Model(string Id, string Label, IReadOnlyList<Field> Fields, IReadOnlyDictionary<string, double> Values, Func<IReadOnlyDictionary<string, double>, string> ToHex);

    private IReadOnlyList<Model> Models
    {
        get
        {
            var l = Labels;
            var hsl = Colors.HexToHsl(Value) ?? new Hsl(0, 0, 0);
            var hsb = Colors.HexToHsb(Value) ?? new Hsb(0, 0, 0);
            var rgb = Colors.HexToRgb(Value) ?? new Rgb(0, 0, 0);
            var cmyk = Colors.HexToCmyk(Value) ?? new Cmyk(0, 0, 0, 100);
            return
            [
                new("hsl", l.Hsl, [new("h", l.Hue, 360), new("s", l.Saturation, 100), new("l", l.Lightness, 100)],
                    new Dictionary<string, double> { ["h"] = hsl.H, ["s"] = hsl.S, ["l"] = hsl.L },
                    v => Colors.HslToHex(new Hsl(v["h"], v["s"], v["l"]))),
                new("hsb", l.Hsb, [new("h", l.Hue, 360), new("s", l.Saturation, 100), new("b", l.Brightness, 100)],
                    new Dictionary<string, double> { ["h"] = hsb.H, ["s"] = hsb.S, ["b"] = hsb.B },
                    v => Colors.HsbToHex(new Hsb(v["h"], v["s"], v["b"]))),
                new("rgb", l.Rgb, [new("r", l.Red, 255), new("g", l.Green, 255), new("b", l.Blue, 255)],
                    new Dictionary<string, double> { ["r"] = rgb.R, ["g"] = rgb.G, ["b"] = rgb.B },
                    v => Colors.RgbToHex(new Rgb(v["r"], v["g"], v["b"]))),
                new("cmyk", l.Cmyk, [new("c", l.Cyan, 100), new("m", l.Magenta, 100), new("y", l.Yellow, 100), new("k", l.Key, 100)],
                    new Dictionary<string, double> { ["c"] = cmyk.C, ["m"] = cmyk.M, ["y"] = cmyk.Y, ["k"] = cmyk.K },
                    v => Colors.CmykToHex(new Cmyk(v["c"], v["m"], v["y"], v["k"]))),
            ];
        }
    }

    protected override void OnParametersSet()
    {
        if (_swatches.Length != Colours.Count) _swatches = new ElementReference[Colours.Count];
        // The recent row is the component's own, so it keeps growing without @bind-Recent; a new list from the
        // parent replaces it.
        if (!ReferenceEquals(_recentParameter, Recent))
        {
            _recentParameter = Recent;
            _recent = Recent ?? Array.Empty<string>();
        }
        // The entry fields show the current value; a field being typed in keeps its draft until it is committed.
        if (_shownValue != Value)
        {
            _shownValue = Value;
            ResetDrafts();
        }
    }

    private void ResetDrafts()
    {
        _hexDraft = Value == Colors.Transparent ? "" : Value ?? "";
        _nameDraft = Colors.NameOfColor(Value) ?? "";
        _hexInvalid = false;
        _nameInvalid = false;
    }

    /// <summary>
    /// The one listener the component installs: it stops the browser's own ArrowUp / ArrowDown on a palette radio,
    /// and Enter in the hex and name fields, which Blazor cannot prevent per key.
    /// </summary>
    internal static string BuildKeysScript(string id) =>
        "(() => { const root = document.getElementById(" + JsonSerializer.Serialize(id) + ");" +
        " if (!root || root.dataset.lilyKeys) return; root.dataset.lilyKeys = '';" +
        " root.addEventListener('keydown', (e) => { const t = e.target;" +
        " if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && t.type === 'radio' && t.closest('.color-picker-palette')) e.preventDefault();" +
        " else if (e.key === 'Enter' && t.matches('.color-picker-hex, .color-picker-name')) e.preventDefault(); }); })()";

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender) return;
        try { await JS.InvokeVoidAsync("eval", BuildKeysScript(_id)); }
        catch (Exception ex) when (ex is JSException or InvalidOperationException or JSDisconnectedException) { }
    }

    private async Task ChooseAsync(string color)
    {
        if (Disabled || color == Value) return;
        Value = color;
        _shownValue = color;
        ResetDrafts();
        _recent = Colors.PushRecent(_recent, color, MaxRecent);
        await ValueChanged.InvokeAsync(color);
        await RecentChanged.InvokeAsync(_recent);
    }

    private async Task CommitHexAsync(string? raw)
    {
        var text = raw ?? "";
        _hexDraft = text;
        var hex = Colors.NormalizeHex(text);
        if (hex is not null) await ChooseAsync(hex);
        _hexInvalid = text.Trim() != "" && hex is null;
    }

    private async Task CommitNameAsync(string? raw)
    {
        var text = (raw ?? "").Trim().ToLowerInvariant();
        _nameDraft = raw ?? "";
        var hex = Colors.CssNamedColors.TryGetValue(text, out var h) ? h : null;
        if (hex is not null) await ChooseAsync(hex);
        _nameInvalid = text != "" && hex is null;
    }

    private Task OnHexKeyDownAsync(KeyboardEventArgs e) => e.Key == "Enter" ? CommitHexAsync(_hexDraft) : Task.CompletedTask;
    private Task OnNameKeyDownAsync(KeyboardEventArgs e) => e.Key == "Enter" ? CommitNameAsync(_nameDraft) : Task.CompletedTask;

    private async Task CommitModelAsync(Model model, string key, string? raw)
    {
        if (!double.TryParse(raw, NumberStyles.Float, CultureInfo.InvariantCulture, out var n) || !double.IsFinite(n)) return;
        var values = new Dictionary<string, double>(model.Values) { [key] = n };
        await ChooseAsync(model.ToHex(values));
    }

    // Native radios move one swatch with Left and Right; Up and Down move a whole row, as the grid looks.
    private async Task OnPaletteKeyDownAsync(KeyboardEventArgs e, int index)
    {
        if (e.Key is not ("ArrowUp" or "ArrowDown")) return;
        var to = index + (e.Key == "ArrowDown" ? ColumnCount : -ColumnCount);
        if (to < 0 || to >= Colours.Count) return;
        await ChooseAsync(Colours[to]);
        try { await _swatches[to].FocusAsync(preventScroll: true); }
        catch (Exception ex) when (ex is JSException or InvalidOperationException or JSDisconnectedException) { }
    }
}
