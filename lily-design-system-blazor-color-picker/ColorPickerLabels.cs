namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>Every visible and accessible word of a <see cref="ColorPicker"/>. Required: the helper ships no English.</summary>
public sealed record ColorPickerLabels
{
    /// <summary>The whole control's accessible name.</summary>
    public required string Picker { get; init; }
    /// <summary>The recent colours row.</summary>
    public required string Recent { get; init; }
    /// <summary>The palette of swatches.</summary>
    public required string Palette { get; init; }
    /// <summary>The Transparent button's visible text.</summary>
    public required string Transparent { get; init; }
    /// <summary>The group of entry fields.</summary>
    public required string Custom { get; init; }
    /// <summary>The hex field, for example "Hex".</summary>
    public required string Hex { get; init; }
    /// <summary>The CSS (X11) colour-name field.</summary>
    public required string Name { get; init; }
    /// <summary>The four colour models' group names, for example "HSL", "HSB", "RGB" and "CMYK".</summary>
    public required string Hsl { get; init; }
    public required string Hsb { get; init; }
    public required string Rgb { get; init; }
    public required string Cmyk { get; init; }
    /// <summary>Field names: hue (0 to 360, in HSL and HSB), saturation (both), lightness (HSL), brightness (HSB).</summary>
    public required string Hue { get; init; }
    public required string Saturation { get; init; }
    public required string Lightness { get; init; }
    public required string Brightness { get; init; }
    /// <summary>RGB fields, 0 to 255.</summary>
    public required string Red { get; init; }
    public required string Green { get; init; }
    public required string Blue { get; init; }
    /// <summary>CMYK fields, 0 to 100: cyan, magenta, yellow and key (black).</summary>
    public required string Cyan { get; init; }
    public required string Magenta { get; init; }
    public required string Yellow { get; init; }
    public required string Key { get; init; }
    /// <summary>Shown beside a hex or name field that holds no colour. Without it the field is only marked aria-invalid.</summary>
    public string? Invalid { get; init; }
}
