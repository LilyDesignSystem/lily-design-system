namespace LilyDesignSystem.Maui.Core;

/// <summary>A record list's status: what it can say about the records it holds.</summary>
public enum RecordListStatus
{
    /// <summary>known: the entries are the records.</summary>
    Known,
    /// <summary>none-known: the source says there are none.</summary>
    NoneKnown,
    /// <summary>not-recorded</summary>
    NotRecorded,
    /// <summary>unavailable: the source could not be read.</summary>
    Unavailable,
    /// <summary>omitted</summary>
    Omitted,
    /// <summary>not-applicable</summary>
    NotApplicable,
}

/// <summary>A record's state: withheld (only its words are shown) or entered in error (struck through, with its words).</summary>
public enum RecordEntryState
{
    /// <summary>withheld</summary>
    Withheld,
    /// <summary>entered-in-error</summary>
    EnteredInError,
}

/// <summary>The FHIR AllergyIntolerance codes an item takes; each is shown only through its words.</summary>
public sealed record AllergyCodes(string? Severity = null, string? Criticality = null, string? ClinicalStatus = null, string? VerificationStatus = null);

/// <summary>The words for an allergy item, in the order they are shown and spoken; all the app's.</summary>
public sealed record AllergyWords(
    string Substance,
    string? Subject = null,
    string? Reaction = null,
    string? Severity = null,
    string? Criticality = null,
    string? ClinicalStatus = null,
    string? VerificationStatus = null,
    string? Type = null,
    string? Category = null,
    string? Updated = null);

/// <summary>
/// The rules of record-list, record-list-item and the allergy lists, the twins of Kotlin's RecordRules and AllergyRules. A list
/// is never blank; a withheld record shows only its state words; one entered in error keeps its content, struck through; neither
/// is removed. "None known" beside an entry is resolved by <see cref="RecordListState"/> (HC-C17).
/// </summary>
public static class RecordRules
{
    /// <summary>The status as the web writes it (<c>none-known</c>).</summary>
    public static string Key(RecordListStatus status) => status switch
    {
        RecordListStatus.NoneKnown => "none-known",
        RecordListStatus.NotRecorded => "not-recorded",
        RecordListStatus.NotApplicable => "not-applicable",
        _ => status.ToString().ToLowerInvariant(),
    };

    /// <summary>Entries are shown for known and for none known (where one is a conflict to see), never otherwise.</summary>
    public static bool ShowsEntries(RecordListStatus status) => status is RecordListStatus.Known or RecordListStatus.NoneKnown;

    /// <summary>Whether a record's content is shown: never for a withheld record.</summary>
    public static bool ShowsContent(RecordEntryState? state) => state != RecordEntryState.Withheld;

    /// <summary>Whether the content is struck through: a record entered in error.</summary>
    public static bool StrikesContent(RecordEntryState? state) => state == RecordEntryState.EnteredInError;

    /// <summary>An entry someone has withdrawn does not contradict "none known".</summary>
    public static bool IsWithdrawn(string? status, RecordEntryState? state) =>
        state == RecordEntryState.EnteredInError || status == "entered-in-error";

    /// <summary>An allergy refuted or entered in error does not contradict "none known".</summary>
    public static bool IsWithdrawn(AllergyCodes? codes) =>
        codes?.VerificationStatus is "refuted" or "entered-in-error";

    /// <summary>The list's warnings: a status label is required, and a conflict needs the app's words for it.</summary>
    public static IReadOnlyList<string> ListWarnings(string list, string? statusLabel, RecordListStatus status, string? conflictLabel, bool entries)
    {
        var warnings = new List<string>();
        if (string.IsNullOrEmpty(statusLabel)) warnings.Add($"{list}: a StatusLabel is required, so the list is never blank");
        if (status == RecordListStatus.NoneKnown && entries && !ClinicalFormat.HasWords(conflictLabel))
            warnings.Add($"{list}: it says none are known and holds an entry; give a ConflictLabel, your words for that");
        return warnings;
    }

    /// <summary>An item's warnings: a status code or entry state needs its words.</summary>
    public static IReadOnlyList<string> ItemWarnings(string? status, string? statusLabel, RecordEntryState? state, string? stateLabel)
    {
        var warnings = new List<string>();
        if (!string.IsNullOrEmpty(status) && string.IsNullOrEmpty(statusLabel))
            warnings.Add($"RecordListItem: status {status} needs a StatusLabel, or it is shown as a code or a colour");
        if (state is not null && string.IsNullOrEmpty(stateLabel))
            warnings.Add($"RecordListItem: entry state {state} needs an EntryStateLabel");
        return warnings;
    }

    /// <summary>A warning for each allergy code given without its words.</summary>
    public static IReadOnlyList<string> AllergyWarnings(AllergyCodes codes, AllergyWords words) =>
        new (string Name, string? Code, string? Label)[]
        {
            ("severity", codes.Severity, words.Severity),
            ("criticality", codes.Criticality, words.Criticality),
            ("clinicalStatus", codes.ClinicalStatus, words.ClinicalStatus),
            ("verificationStatus", codes.VerificationStatus, words.VerificationStatus),
        }
        .Where(c => c.Code is not null && string.IsNullOrEmpty(c.Label))
        .Select(c => $"AllergyRecordListItem: {c.Name} {c.Code} needs its words, or it is shown as a code or a colour")
        .ToList();

    /// <summary>Everything an allergy item says, in order; whose record it is first. Lily adds no words.</summary>
    public static string AllergySpoken(AllergyWords w) =>
        LilySemantics.Spoken(w.Subject, w.Substance, w.Reaction, w.Severity, w.Criticality, w.ClinicalStatus,
            w.VerificationStatus, w.Type, w.Category, w.Updated) ?? w.Substance;

    /// <summary>What the list shows and is called, from the Blazor-shared state (HC-C17).</summary>
    public static (string? Name, string? Item, bool Conflict) Shown(
        RecordListStatus status, string statusLabel, string? conflictLabel, string? label, bool entries)
    {
        var state = RecordListState.Of(Key(status), statusLabel, conflictLabel, string.IsNullOrEmpty(label) ? null : label, entries);
        return (state.Name, state.ShowItem ? state.Words : null, state.Status == "conflict");
    }
}
