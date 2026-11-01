namespace LilyBlazorHeadless.Components;

/// <summary>One suggestion in an <see cref="Autosuggest"/>: <c>Value</c> fills the input, <c>Label</c> is shown.</summary>
public sealed record AutosuggestSuggestion(string Value, string Label);
