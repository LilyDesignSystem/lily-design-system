// Typed fields for the kanban board, Gantt chart and calendar: a field is a DataGridColumn read from a record's
// Values, so a Type fills in display, edit and export defaults exactly as it does in the data grid (see CellTypes.cs
// in LilyDesignSystem.Blazor.DataGrid). These are the framework-free pieces (resolve, read, format, draft, parse,
// validate, export); each component adds only its own markup and state. Plain data, no English, no default locale:
// with no Locale a value shows as stored.
//
// Ported from the canonical Svelte package's typed-fields.ts.

using System.Globalization;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>What committing a draft does: refused as invalid for the field's type, or accepted.</summary>
internal sealed record FieldEditOutcome(bool Invalid, object? Value = null, object? Previous = null, bool Changed = false, string Text = "");

internal static class TypedFields
{
    private static readonly HashSet<DataGridCellType> EditableTypes = new()
    {
        DataGridCellType.None, DataGridCellType.Text, DataGridCellType.Number, DataGridCellType.Link,
        DataGridCellType.Date, DataGridCellType.Time, DataGridCellType.Select, DataGridCellType.Radio,
    };

    /// <summary>The fields with type defaults (format, compare, export value) resolved. Call once per <c>Fields</c> / <c>Locale</c> change, never per record or keystroke.</summary>
    internal static IReadOnlyList<DataGridColumn> Resolve(IReadOnlyList<DataGridColumn>? fields, string? locale)
        => (fields ?? Array.Empty<DataGridColumn>()).Select(f => CellTypes.Resolve(f, locale, Array.Empty<DataGridRow>())).ToList();

    /// <summary>Whether the field's type has an editor here and the field opted in (the host still decides whether editing is on).</summary>
    internal static bool IsEditable(DataGridColumn f) => f.Editable && EditableTypes.Contains(f.Type);

    /// <summary>The editor control: text, number, date, time, or select (a radio field edits through a select).</summary>
    internal static DataGridEditor EditorOf(DataGridColumn f)
    {
        if (f.Editor != DataGridEditor.Default) return f.Editor == DataGridEditor.Radio ? DataGridEditor.Select : f.Editor;
        return f.Type switch
        {
            DataGridCellType.Number => DataGridEditor.Number,
            DataGridCellType.Date => DataGridEditor.Date,
            DataGridCellType.Time => DataGridEditor.Time,
            DataGridCellType.Select or DataGridCellType.Radio => DataGridEditor.Select,
            _ => DataGridEditor.Text,
        };
    }

    internal static object? Value(DataGridColumn f, DataGridRow? values)
    {
        var row = values ?? new DataGridRow();
        if (f.Accessor is not null) return f.Accessor(row);
        return row.TryGetValue(f.Id, out var v) ? v : null;
    }

    private static string Invariant(object value) => value switch
    {
        double d => d.ToString("R", CultureInfo.InvariantCulture),
        float x => x.ToString("R", CultureInfo.InvariantCulture),
        IFormattable fmt => fmt.ToString(null, CultureInfo.InvariantCulture),
        _ => value.ToString() ?? "",
    };

    /// <summary>The text a value shows as; empty when there is no value.</summary>
    internal static string Text(DataGridColumn f, DataGridRow? values)
    {
        var value = Value(f, values);
        if (value is null or "") return "";
        return f.Format is not null ? f.Format(value, values ?? new DataGridRow()) : Invariant(value);
    }

    /// <summary>The text an editor starts with.</summary>
    internal static string Draft(DataGridColumn f, DataGridRow? values)
    {
        var value = Value(f, values);
        if (value is null) return "";
        if (f.Type == DataGridCellType.Link) return CellTypes.LinkParts(value)?.Href ?? "";
        return Invariant(value);
    }

    /// <summary>The value an editor's draft stands for.</summary>
    internal static object? Parse(DataGridColumn f, string draft, DataGridRow? values)
    {
        if (f.Parse is not null) return f.Parse(draft, values ?? new DataGridRow());
        var kind = EditorOf(f);
        if (kind == DataGridEditor.Number)
        {
            if (draft.Trim().Length == 0) return null;
            return double.TryParse(draft, NumberStyles.Float, CultureInfo.InvariantCulture, out var n) ? n : double.NaN;
        }
        if (kind is DataGridEditor.Date or DataGridEditor.Time or DataGridEditor.Select) return draft.Length == 0 ? null : draft;
        return draft;
    }

    private static double? AsNumber(object? v) => v switch
    {
        double d when double.IsFinite(d) => d,
        float f when float.IsFinite(f) => f,
        int i => i,
        long l => l,
        short s => s,
        byte b => b,
        decimal m => (double)m,
        uint u => u,
        ulong ul => ul,
        _ => null,
    };

    /// <summary>Two values are the same edit when they are equal; numbers compare by value.</summary>
    internal static bool SameValue(object? a, object? b)
    {
        if (a is null || b is null) return a is null && b is null;
        if (AsNumber(a) is { } x && AsNumber(b) is { } y) return x == y;
        return Equals(a, b);
    }

    internal static FieldEditOutcome Evaluate(DataGridColumn f, DataGridRow? values, string draft)
    {
        var value = Parse(f, draft, values);
        if (CellTypes.IsInvalidForType(f, value) || f.Validate?.Invoke(value, values ?? new DataGridRow()) is not null) return new FieldEditOutcome(true);
        var previous = Value(f, values);
        return new FieldEditOutcome(false, value, previous, !SameValue(value, previous), value is null ? "" : Invariant(value));
    }

    /// <summary>One field for an export: typed values stay numbers, booleans and dates; everything else is the text shown.</summary>
    internal static object? ExportCell(DataGridColumn f, DataGridRow? values)
    {
        if (f.ExportValue is not null) return f.ExportValue(values ?? new DataGridRow());
        var value = Value(f, values);
        if (value is null) return null;
        if (value is double or float or int or long or decimal or bool or DateOnly or DateTime) return value;
        return Text(f, values);
    }

    /// <summary>The fields an export includes.</summary>
    internal static IReadOnlyList<DataGridColumn> Exportable(IReadOnlyList<DataGridColumn> fields) => fields.Where(f => f.Exportable).ToList();

    /// <summary>Which field a Tab / Shift+Tab from <paramref name="fieldId"/> moves to: the next (previous) editable field, or null past the end.</summary>
    internal static DataGridColumn? Neighbour(IReadOnlyList<DataGridColumn> editable, string fieldId, bool backwards)
    {
        var at = -1;
        for (var i = 0; i < editable.Count; i++) if (editable[i].Id == fieldId) { at = i; break; }
        var next = at + (backwards ? -1 : 1);
        return next >= 0 && next < editable.Count ? editable[next] : null;
    }
}
