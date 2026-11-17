namespace LilyBlazorHeadless.Components;

/// <summary>A unit QuantityInputDiv offers, in the consumer's words, with its own limits for the number.</summary>
public record QuantityUnit(string Value, string Label, decimal? Min = null, decimal? Max = null, decimal? Step = null);
