namespace LilyBlazorHeadless.Components;

/// <summary>One choice in a <see cref="WheelPicker"/>.</summary>
public sealed record WheelPickerOption(string Value, string Label, bool Disabled = false);
