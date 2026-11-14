namespace LilyBlazorHeadless.Components;

/// <summary>One part of a medicine's name; tall man letters are marked by the consumer (spec/healthcare-ui item 3).</summary>
public record MedicationNameSegment(string Text, bool TallMan = false);

/// <summary>A CDS Hooks suggestion, rendered as a button by DecisionSupportCard.</summary>
public record DecisionSupportSuggestion(string Id, string Label, bool IsRecommended = false);

/// <summary>A link on a DecisionSupportCard.</summary>
public record DecisionSupportLink(string Label, string Href);

/// <summary>A reason a user can give for dismissing a DecisionSupportCard (CDS Hooks overrideReasons).</summary>
public record DecisionSupportOverrideReason(string Code, string Display);
