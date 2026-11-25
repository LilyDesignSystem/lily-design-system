namespace LilyBlazorHeadless.Components;

/// <summary>
/// What a record list says about itself, and whether that can be true (HC-C17, shared/record-list-state.ts). "None known" beside an
/// entry is a contradiction, and either half may be the wrong one: the entry stays, the words go, and the app's own words for the
/// conflict take their place.
/// </summary>
internal readonly record struct RecordListState(string? Status, string? Name, bool ShowItem, string? Words)
{
    public static RecordListState Of(string? status, string? statusLabel, string? conflictLabel, string? label, bool entries)
    {
        var conflict = status == "none-known" && entries;
        var words = !conflict ? statusLabel : ClinicalFormat.HasWords(conflictLabel) ? conflictLabel : null;
        return new RecordListState(
            conflict ? "conflict" : status,
            // A label that only repeats the status is the status, so it goes with it.
            label is null || (conflict && label == statusLabel) ? words : label,
            status != "known" && !(conflict && words is null),
            words);
    }
}

/// <summary>The entries of one record list. Each Lily item tells its list whether it counts; a bare li cannot.</summary>
internal sealed class RecordListEntries(Func<Task> changed)
{
    private readonly HashSet<object> items = [];

    public bool Any => items.Count > 0;

    public void Set(object item, bool counts)
    {
        var before = Any;
        if (counts) items.Add(item);
        else items.Remove(item);
        if (before != Any) _ = changed();
    }
}
