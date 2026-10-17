// The filter model: a tree of rules and groups over typed fields, and everything that can be done with it that needs no
// browser — editing it immutably, validating it, and writing it out as JSON, SQL, MongoDB, OData or a predicate. Pure.
//
// Ported from the canonical Svelte package's filter-model.ts (shared/filter-model.ts). Plain data and no English: operator
// names are the stable ids below, and what they are called on screen is the consumer's (FilterLabels.OperatorName). No
// default locale: dates are ISO yyyy-MM-dd strings, numbers are numbers (double).

using System.Globalization;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>What a field holds.</summary>
public enum FilterFieldType
{
    Text,
    Number,
    Date,
    Select,
    Boolean,
}

/// <summary>The operator ids. Strings, so they are the same in every language port and in saved JSON.</summary>
public static class FilterOperators
{
    public const string Contains = "contains";
    public const string NotContains = "not-contains";
    public const string Equals = "equals";
    public const string NotEquals = "not-equals";
    public const string StartsWith = "starts-with";
    public const string EndsWith = "ends-with";
    public const string Gt = "gt";
    public const string Gte = "gte";
    public const string Lt = "lt";
    public const string Lte = "lte";
    public const string Between = "between";
    public const string NotBetween = "not-between";
    public const string In = "in";
    public const string NotIn = "not-in";
    public const string IsEmpty = "is-empty";
    public const string IsNotEmpty = "is-not-empty";
    public const string IsTrue = "is-true";
    public const string IsFalse = "is-false";

    /// <summary>Every operator id, so an app can check that its operator names cover them all in each language.</summary>
    public static readonly IReadOnlyList<string> All = new[]
    {
        Contains, NotContains, Equals, NotEquals, StartsWith, EndsWith, Gt, Gte, Lt, Lte, Between, NotBetween, In, NotIn, IsEmpty, IsNotEmpty, IsTrue, IsFalse,
    };
}

/// <summary>A choice of a <c>Select</c> field.</summary>
public sealed record FilterOption(string Id, string Label);

/// <summary>A field the user can filter on.</summary>
public sealed record FilterField
{
    /// <summary>The key in the rows a predicate reads, and the key in JSON output.</summary>
    public required string Id { get; init; }

    /// <summary>Visible name.</summary>
    public required string Label { get; init; }

    /// <summary>Default <c>Text</c>.</summary>
    public FilterFieldType Type { get; init; } = FilterFieldType.Text;

    /// <summary><c>Select</c>: the choices (<c>in</c> / <c>equals</c> match the option ids).</summary>
    public IReadOnlyList<FilterOption>? Options { get; init; }

    /// <summary>The column name in SQL, MongoDB and OData output. Defaults to <c>Id</c>. SQL accepts only plain identifiers (letters, digits, <c>_</c>, dots).</summary>
    public string? Column { get; init; }

    /// <summary>Restrict the operators offered (in this order). Defaults to the type's own.</summary>
    public IReadOnlyList<string>? Operators { get; init; }
}

/// <summary>A rule or a group.</summary>
public abstract record FilterNode(string Id);

/// <summary>One condition. <c>Value</c> is text, a number (double), an ISO date, an option id, or option ids (<c>IReadOnlyList&lt;string&gt;</c>) for <c>in</c> / <c>not-in</c>.</summary>
public sealed record FilterRule(string Id, string Field, string Operator, object? Value = null, object? Value2 = null) : FilterNode(Id);

/// <summary>A group of rules and groups joined by <c>and</c> / <c>or</c>; <c>Not</c> negates the whole group.</summary>
public sealed record FilterGroup(string Id, string Combinator, bool Not, IReadOnlyList<FilterNode> Children) : FilterNode(Id);

/// <summary>Why a rule cannot be applied.</summary>
public enum RuleIssue
{
    UnknownField,
    UnknownOperator,
    MissingValue,
    InvalidValue,
    RangeOrder,
    UnknownOption,
}

/// <summary>Thrown by <see cref="FilterModel.ToSql"/> for a column that is not a plain identifier.</summary>
public sealed class FilterException : Exception
{
    public FilterException(string message) : base(message) { }
}

/// <summary>SQL dialects: identifier quoting, placeholder style, case-insensitive matching and boolean literals.</summary>
public enum SqlDialect
{
    Ansi,
    Postgres,
    MySql,
    Sqlite,
    MsSql,
}

/// <summary>The formats <see cref="FilterModel.FormatFilter"/> writes.</summary>
public enum FilterOutputFormat
{
    Json,
    Sql,
    Mongo,
    OData,
}

/// <summary>A SQL condition and its parameters.</summary>
public sealed record SqlResult(string Sql, IReadOnlyList<object?> Params);

/// <summary>The arity of an operator: how many values it takes. <c>Many</c> is a list.</summary>
public enum ValueArity
{
    None,
    One,
    Two,
    Many,
}

public static class FilterModel
{
    // ---------------------------------------------------------------------
    // Operators
    // ---------------------------------------------------------------------

    private static readonly IReadOnlyDictionary<FilterFieldType, string[]> OperatorsByType = new Dictionary<FilterFieldType, string[]>
    {
        [FilterFieldType.Text] = new[] { "contains", "not-contains", "equals", "not-equals", "starts-with", "ends-with", "is-empty", "is-not-empty" },
        [FilterFieldType.Number] = new[] { "equals", "not-equals", "gt", "gte", "lt", "lte", "between", "not-between", "is-empty", "is-not-empty" },
        [FilterFieldType.Date] = new[] { "equals", "not-equals", "gt", "gte", "lt", "lte", "between", "not-between", "is-empty", "is-not-empty" },
        [FilterFieldType.Select] = new[] { "equals", "not-equals", "in", "not-in", "is-empty", "is-not-empty" },
        [FilterFieldType.Boolean] = new[] { "is-true", "is-false", "is-empty", "is-not-empty" },
    };

    /// <summary>The operators a field offers, in order.</summary>
    public static IReadOnlyList<string> OperatorsFor(FilterField? field)
        => field?.Operators is { Count: > 0 } custom ? custom : OperatorsByType[field?.Type ?? FilterFieldType.Text];

    /// <summary>How many values an operator takes: none, one, two (a range) or a list.</summary>
    public static ValueArity ArityOf(string op) => op switch
    {
        "is-empty" or "is-not-empty" or "is-true" or "is-false" => ValueArity.None,
        "between" or "not-between" => ValueArity.Two,
        "in" or "not-in" => ValueArity.Many,
        _ => ValueArity.One,
    };

    // ---------------------------------------------------------------------
    // Building and editing (immutable)
    // ---------------------------------------------------------------------

    private static int _counter;

    /// <summary>A node id, unique in this process's lifetime.</summary>
    public static string NewId(string prefix = "n") => prefix + Interlocked.Increment(ref _counter).ToString(CultureInfo.InvariantCulture);

    /// <summary>A new rule on <paramref name="fieldId"/> (or the first field) with that field's first operator.</summary>
    public static FilterRule CreateRule(IReadOnlyList<FilterField> fields, string? fieldId = null)
    {
        var field = fields.FirstOrDefault(f => f.Id == fieldId) ?? fields.FirstOrDefault();
        return new FilterRule(NewId("r"), field?.Id ?? "", OperatorsFor(field).FirstOrDefault() ?? "contains");
    }

    public static FilterGroup CreateGroup(string combinator = "and", IReadOnlyList<FilterNode>? children = null)
        => new(NewId("g"), combinator, false, children ?? Array.Empty<FilterNode>());

    /// <summary>A fresh empty filter.</summary>
    public static FilterGroup EmptyFilter() => CreateGroup("and");

    /// <summary>Replace the node with <paramref name="id"/> by <c>change(node)</c> (return null to delete it). The rest of the tree is shared, not copied.</summary>
    public static FilterGroup UpdateNode(FilterGroup root, string id, Func<FilterNode, FilterNode?> change)
    {
        if (root.Id == id) return change(root) is FilterGroup g ? g : root;
        var changed = false;
        var children = new List<FilterNode>();
        foreach (var child in root.Children)
        {
            if (child.Id == id)
            {
                changed = true;
                if (change(child) is { } next) children.Add(next);
            }
            else if (child is FilterGroup inner)
            {
                var next = UpdateNode(inner, id, change);
                if (!ReferenceEquals(next, inner)) changed = true;
                children.Add(next);
            }
            else children.Add(child);
        }
        return changed ? root with { Children = children } : root;
    }

    public static FilterGroup RemoveNode(FilterGroup root, string id) => UpdateNode(root, id, _ => null);

    /// <summary>Add <paramref name="node"/> at the end of the group <paramref name="parentId"/> (the root when it is not found).</summary>
    public static FilterGroup AddNode(FilterGroup root, string parentId, FilterNode node)
        => UpdateNode(root, parentId, n => n is FilterGroup g ? g with { Children = g.Children.Append(node).ToList() } : n);

    /// <summary>A rule with another field: its operator resets to that field's first when the old one does not apply, and its values clear.</summary>
    public static FilterRule ChangeField(FilterRule rule, IReadOnlyList<FilterField> fields, string fieldId)
    {
        var operators = OperatorsFor(fields.FirstOrDefault(f => f.Id == fieldId));
        return rule with { Field = fieldId, Operator = operators.Contains(rule.Operator) ? rule.Operator : operators.FirstOrDefault() ?? rule.Operator, Value = null, Value2 = null };
    }

    /// <summary>A rule with another operator: values it no longer needs are dropped, and a list is kept only for <c>in</c>.</summary>
    public static FilterRule ChangeOperator(FilterRule rule, string op)
    {
        var arity = ArityOf(op);
        var wasMany = ArityOf(rule.Operator) == ValueArity.Many;
        return rule with
        {
            Operator = op,
            Value = arity == ValueArity.None ? null : arity == ValueArity.Many ? (wasMany ? rule.Value : null) : wasMany ? null : rule.Value,
            Value2 = arity == ValueArity.Two ? rule.Value2 : null,
        };
    }

    /// <summary>Every rule in the tree, depth first.</summary>
    public static IReadOnlyList<FilterRule> RulesOf(FilterGroup group)
        => group.Children.SelectMany(c => c is FilterRule r ? new[] { r } : RulesOf((FilterGroup)c)).ToList();

    // ---------------------------------------------------------------------
    // Validation
    // ---------------------------------------------------------------------

    private static readonly Regex IsoDate = new(@"^(\d{4})-(\d{2})-(\d{2})$", RegexOptions.Compiled);

    /// <summary>A real calendar date written yyyy-MM-dd.</summary>
    public static bool IsIsoDate(object? value)
    {
        if (value is not string s) return false;
        var m = IsoDate.Match(s);
        if (!m.Success) return false;
        var (y, mo, d) = (int.Parse(m.Groups[1].Value), int.Parse(m.Groups[2].Value), int.Parse(m.Groups[3].Value));
        if (y < 1 || mo < 1 || mo > 12 || d < 1) return false;
        return d <= DateTime.DaysInMonth(y, mo);
    }

    private static bool TryNumber(object? v, out double number)
    {
        switch (v)
        {
            case double d: number = d; return double.IsFinite(d);
            case float f: number = f; return float.IsFinite(f);
            case int or long or short or byte or decimal: number = Convert.ToDouble(v, CultureInfo.InvariantCulture); return true;
            default: number = double.NaN; return false;
        }
    }

    private static IReadOnlyList<string>? AsList(object? v)
        => v switch
        {
            IReadOnlyList<string> l => l,
            IEnumerable<string> e => e.ToList(),
            _ => null,
        };

    /// <summary>Why a rule cannot be applied, or null when it can. An incomplete rule is a normal state while the user is still typing.</summary>
    public static RuleIssue? RuleIssueOf(FilterRule rule, IReadOnlyList<FilterField> fields)
    {
        var field = fields.FirstOrDefault(f => f.Id == rule.Field);
        if (field is null) return RuleIssue.UnknownField;
        if (!OperatorsFor(field).Contains(rule.Operator)) return RuleIssue.UnknownOperator;
        var arity = ArityOf(rule.Operator);
        if (arity == ValueArity.None) return null;

        RuleIssue? Check(object? v)
        {
            if (v is null || v is string { Length: 0 }) return RuleIssue.MissingValue;
            return field.Type switch
            {
                FilterFieldType.Number => TryNumber(v, out _) ? null : RuleIssue.InvalidValue,
                FilterFieldType.Date => IsIsoDate(v) ? null : RuleIssue.InvalidValue,
                FilterFieldType.Select => v is string id && (field.Options ?? Array.Empty<FilterOption>()).Any(o => o.Id == id) ? null : RuleIssue.UnknownOption,
                _ => v is string ? null : RuleIssue.InvalidValue,
            };
        }

        if (arity == ValueArity.Many)
        {
            if (AsList(rule.Value) is not { Count: > 0 } list) return RuleIssue.MissingValue;
            foreach (var v in list)
                if (Check(v) is { } issue) return issue;
            return null;
        }
        if (Check(rule.Value) is { } first) return first;
        if (arity == ValueArity.Two)
        {
            if (Check(rule.Value2) is { } second) return second;
            if (field.Type == FilterFieldType.Number)
            {
                TryNumber(rule.Value, out var a);
                TryNumber(rule.Value2, out var b);
                if (a > b) return RuleIssue.RangeOrder;
            }
            else if (string.CompareOrdinal(Convert.ToString(rule.Value, CultureInfo.InvariantCulture), Convert.ToString(rule.Value2, CultureInfo.InvariantCulture)) > 0) return RuleIssue.RangeOrder;
        }
        return null;
    }

    /// <summary>The id the JSON and the saved form use for an issue: <c>unknown-field</c>, <c>missing-value</c>, ….</summary>
    public static string IssueId(RuleIssue issue) => issue switch
    {
        RuleIssue.UnknownField => "unknown-field",
        RuleIssue.UnknownOperator => "unknown-operator",
        RuleIssue.MissingValue => "missing-value",
        RuleIssue.InvalidValue => "invalid-value",
        RuleIssue.RangeOrder => "range-order",
        _ => "unknown-option",
    };

    /// <summary>The tree an output is made from: rules with an issue, and groups left empty by that, are dropped. Null when nothing is left.</summary>
    public static FilterGroup? Normalise(FilterGroup group, IReadOnlyList<FilterField> fields)
    {
        var children = new List<FilterNode>();
        foreach (var child in group.Children)
        {
            if (child is FilterRule rule)
            {
                if (RuleIssueOf(rule, fields) is null) children.Add(rule);
            }
            else if (Normalise((FilterGroup)child, fields) is { } inner) children.Add(inner);
        }
        return children.Count > 0 ? group with { Children = children } : null;
    }

    // ---------------------------------------------------------------------
    // Predicate (filter rows in memory)
    // ---------------------------------------------------------------------

    private static string AsText(object? v) => v switch
    {
        null => "",
        bool b => b ? "true" : "false",
        string s => s,
        IFormattable f => f.ToString(null, CultureInfo.InvariantCulture),
        _ => v.ToString() ?? "",
    };

    private static bool IsBlank(object? v) => v is null or "" || (v is System.Collections.ICollection { Count: 0 });

    private static double NumberOf(object? v)
        => TryNumber(v, out var d) ? d : v is string s && double.TryParse(s, NumberStyles.Float, CultureInfo.InvariantCulture, out var parsed) ? parsed : double.NaN;

    private static bool RuleMatches(FilterRule rule, FilterField field, IReadOnlyDictionary<string, object?> row)
    {
        row.TryGetValue(field.Id, out var raw);
        var type = field.Type;
        var (op, value, value2) = (rule.Operator, rule.Value, rule.Value2);
        switch (op)
        {
            case "is-empty": return IsBlank(raw);
            case "is-not-empty": return !IsBlank(raw);
            case "is-true": return raw is true;
            case "is-false": return raw is false;
            case "contains": return SearchText.Fold(AsText(raw)).Contains(SearchText.Fold(AsText(value)), StringComparison.Ordinal);
            case "not-contains": return !SearchText.Fold(AsText(raw)).Contains(SearchText.Fold(AsText(value)), StringComparison.Ordinal);
            case "starts-with": return SearchText.Fold(AsText(raw)).StartsWith(SearchText.Fold(AsText(value)), StringComparison.Ordinal);
            case "ends-with": return SearchText.Fold(AsText(raw)).EndsWith(SearchText.Fold(AsText(value)), StringComparison.Ordinal);
            case "in": return AsList(value) is { } inList && inList.Any(v => AsText(raw) == v);
            case "not-in": return !(AsList(value) is { } notInList && notInList.Any(v => AsText(raw) == v));
        }
        // Comparisons: numbers numerically, dates and everything else as text (ISO dates sort as text).
        if (type == FilterFieldType.Number)
        {
            var left = NumberOf(raw);
            var (a, b) = (NumberOf(value), NumberOf(value2));
            if (IsBlank(raw) || double.IsNaN(left)) return op is "not-equals" or "not-between";
            return op switch
            {
                "equals" => left == a,
                "not-equals" => left != a,
                "gt" => left > a,
                "gte" => left >= a,
                "lt" => left < a,
                "lte" => left <= a,
                "between" => left >= a && left <= b,
                "not-between" => left < a || left > b,
                _ => false,
            };
        }
        var l = AsText(raw);
        var (ta, tb) = (AsText(value), AsText(value2));
        if (IsBlank(raw)) return op is "not-equals" or "not-between";
        int Cmp(string x, string y) => string.CompareOrdinal(x, y);
        return op switch
        {
            "equals" => type == FilterFieldType.Text ? SearchText.Fold(l) == SearchText.Fold(ta) : l == ta,
            "not-equals" => type == FilterFieldType.Text ? SearchText.Fold(l) != SearchText.Fold(ta) : l != ta,
            "gt" => Cmp(l, ta) > 0,
            "gte" => Cmp(l, ta) >= 0,
            "lt" => Cmp(l, ta) < 0,
            "lte" => Cmp(l, ta) <= 0,
            "between" => Cmp(l, ta) >= 0 && Cmp(l, tb) <= 0,
            "not-between" => Cmp(l, ta) < 0 || Cmp(l, tb) > 0,
            _ => false,
        };
    }

    /// <summary>A function that says whether a row (a record by field id) passes. An empty filter passes every row.</summary>
    public static Func<IReadOnlyDictionary<string, object?>, bool> ToPredicate(FilterGroup group, IReadOnlyList<FilterField> fields)
    {
        if (Normalise(group, fields) is not { } tree) return _ => true;
        var byId = fields.ToDictionary(f => f.Id);
        bool Test(FilterNode node, IReadOnlyDictionary<string, object?> row)
        {
            if (node is FilterRule rule) return RuleMatches(rule, byId[rule.Field], row);
            var g = (FilterGroup)node;
            var results = g.Children.Select(c => Test(c, row));
            var ok = g.Combinator == "and" ? results.All(x => x) : results.Any(x => x);
            return g.Not ? !ok : ok;
        }
        return row => Test(tree, row);
    }

    // ---------------------------------------------------------------------
    // JSON
    // ---------------------------------------------------------------------

    internal static JsonNode? ToNode(object? value) => value switch
    {
        null => null,
        string s => JsonValue.Create(s),
        bool b => JsonValue.Create(b),
        double d => JsonValue.Create(d),
        int i => JsonValue.Create(i),
        long l => JsonValue.Create(l),
        decimal m => JsonValue.Create(m),
        JsonNode n => n.DeepClone(),
        IEnumerable<string> list => new JsonArray(list.Select(x => (JsonNode?)JsonValue.Create(x)).ToArray()),
        _ => JsonValue.Create(Convert.ToString(value, CultureInfo.InvariantCulture)),
    };

    /// <summary>The filter as plain, id-free JSON that <see cref="FromJson"/> reads back. Incomplete rules are left out. Null when nothing is left.</summary>
    public static JsonObject? ToJson(FilterGroup group, IReadOnlyList<FilterField> fields)
    {
        if (Normalise(group, fields) is not { } tree) return null;
        JsonObject Write(FilterGroup g)
        {
            var o = new JsonObject { ["combinator"] = g.Combinator };
            if (g.Not) o["not"] = true;
            o["rules"] = new JsonArray(g.Children.Select(c =>
            {
                if (c is FilterGroup inner) return (JsonNode?)Write(inner);
                var r = (FilterRule)c;
                var rule = new JsonObject { ["field"] = r.Field, ["operator"] = r.Operator };
                var arity = ArityOf(r.Operator);
                if (arity != ValueArity.None) rule["value"] = ToNode(r.Value);
                if (arity == ValueArity.Two) rule["value2"] = ToNode(r.Value2);
                return rule;
            }).ToArray());
            return o;
        }
        return Write(tree);
    }

    private static object? FromNode(JsonNode? node)
    {
        if (node is null) return null;
        if (node is JsonArray array) return array.Select(x => FromNode(x)?.ToString() ?? "").ToList();
        if (node is JsonValue v)
        {
            if (v.TryGetValue<string>(out var s)) return s;
            if (v.TryGetValue<bool>(out var b)) return b;
            if (v.TryGetValue<double>(out var d)) return d;
        }
        return null;
    }

    /// <summary>Read <see cref="ToJson"/> output back into a tree with fresh ids. Anything that is not a valid rule for <paramref name="fields"/> is reported, not guessed at.</summary>
    public static (FilterGroup Group, IReadOnlyList<string> Errors) FromJson(JsonNode? json, IReadOnlyList<FilterField> fields)
    {
        var errors = new List<string>();
        FilterNode? Read(JsonNode? node, string path)
        {
            if (node is not JsonObject o)
            {
                errors.Add($"{path}: not an object");
                return null;
            }
            if (o["rules"] is JsonArray rules)
            {
                var c = o["combinator"]?.GetValueKind() == JsonValueKind.String ? o["combinator"]!.GetValue<string>() : null;
                var combinator = c == "or" ? "or" : c == "and" || o["combinator"] is null ? "and" : null;
                if (combinator is null)
                {
                    errors.Add($"{path}: unknown combinator");
                    return null;
                }
                var children = rules.Select((r, i) => Read(r, $"{path}.rules[{i}]")).OfType<FilterNode>().ToList();
                return CreateGroup(combinator, children) with { Not = o["not"] is JsonValue nv && nv.TryGetValue<bool>(out var not) && not };
            }
            if (o["field"] is JsonValue f && f.TryGetValue<string>(out var field) && o["operator"] is JsonValue p && p.TryGetValue<string>(out var op))
            {
                var rule = new FilterRule(NewId("r"), field, op, FromNode(o["value"]), FromNode(o["value2"]));
                if (RuleIssueOf(rule, fields) is { } issue)
                {
                    errors.Add($"{path}: {IssueId(issue)}");
                    return null;
                }
                return rule;
            }
            errors.Add($"{path}: neither a rule nor a group");
            return null;
        }
        var root = Read(json, "$");
        if (root is FilterGroup group) return (group, errors);
        return (root is not null ? CreateGroup("and", new[] { root }) : EmptyFilter(), errors);
    }

    // ---------------------------------------------------------------------
    // SQL
    // ---------------------------------------------------------------------

    private static readonly Regex Identifier = new(@"^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$", RegexOptions.Compiled);

    private static string QuoteIdentifier(string name, SqlDialect dialect)
    {
        if (!Identifier.IsMatch(name)) throw new FilterException($"not a plain SQL identifier: {JsonSerializer.Serialize(name)}");
        var (open, close) = dialect switch { SqlDialect.MySql => ("`", "`"), SqlDialect.MsSql => ("[", "]"), _ => ("\"", "\"") };
        return string.Join(".", name.Split('.').Select(part => open + part + close));
    }

    private static string EscapeLike(string text) => Regex.Replace(text, @"[\\%_]", m => "\\" + m.Value);

    private static string SqlLiteral(object? value) => value switch
    {
        null => "NULL",
        double d => d.ToString("R", CultureInfo.InvariantCulture),
        int or long or decimal or float => Convert.ToString(value, CultureInfo.InvariantCulture)!,
        bool b => b ? "1" : "0",
        _ => "'" + AsText(value).Replace("'", "''") + "'",
    };

    /// <summary>
    /// The filter as the condition of a SQL <c>WHERE</c> clause (without the word) and its parameters. Values are always parameters unless
    /// <paramref name="inline"/>; column names come only from the declared fields and must be plain identifiers; <c>LIKE</c> text is escaped.
    /// An empty filter is an empty condition with no parameters.
    /// </summary>
    public static SqlResult ToSql(FilterGroup group, IReadOnlyList<FilterField> fields, SqlDialect dialect = SqlDialect.Ansi, bool inline = false)
    {
        if (Normalise(group, fields) is not { } tree) return new SqlResult("", Array.Empty<object?>());
        var byId = fields.ToDictionary(f => f.Id);
        var parameters = new List<object?>();
        string Bind(object? value)
        {
            if (inline) return SqlLiteral(value);
            parameters.Add(value is bool b && dialect is SqlDialect.MsSql or SqlDialect.Sqlite ? (b ? 1 : 0) : value);
            return dialect == SqlDialect.Postgres ? "$" + parameters.Count : dialect == SqlDialect.MsSql ? "@p" + parameters.Count : "?";
        }
        // MySQL reads a backslash in a string literal as an escape itself, so its ESCAPE character is written twice.
        var escapeClause = dialect == SqlDialect.MySql ? "ESCAPE '\\\\'" : "ESCAPE '\\'";
        string Like(string column, string pattern, bool negate)
        {
            if (dialect == SqlDialect.Postgres) return $"{column} {(negate ? "NOT ILIKE" : "ILIKE")} {Bind(pattern)} {escapeClause}";
            return $"LOWER({column}) {(negate ? "NOT LIKE" : "LIKE")} LOWER({Bind(pattern)}) {escapeClause}";
        }
        string Rule(FilterRule r)
        {
            var field = byId[r.Field];
            var column = QuoteIdentifier(field.Column ?? field.Id, dialect);
            var text = field.Type == FilterFieldType.Text;
            var v = r.Value;
            string List() => string.Join(", ", (AsList(v) ?? Array.Empty<string>()).Select(x => Bind(x)));
            return r.Operator switch
            {
                "contains" => Like(column, $"%{EscapeLike(AsText(v))}%", false),
                "not-contains" => Like(column, $"%{EscapeLike(AsText(v))}%", true),
                "starts-with" => Like(column, $"{EscapeLike(AsText(v))}%", false),
                "ends-with" => Like(column, $"%{EscapeLike(AsText(v))}", false),
                "equals" => text ? $"LOWER({column}) = LOWER({Bind(v)})" : $"{column} = {Bind(v)}",
                "not-equals" => text ? $"LOWER({column}) <> LOWER({Bind(v)})" : $"{column} <> {Bind(v)}",
                "gt" => $"{column} > {Bind(v)}",
                "gte" => $"{column} >= {Bind(v)}",
                "lt" => $"{column} < {Bind(v)}",
                "lte" => $"{column} <= {Bind(v)}",
                "between" => $"{column} BETWEEN {Bind(v)} AND {Bind(r.Value2)}",
                "not-between" => $"{column} NOT BETWEEN {Bind(v)} AND {Bind(r.Value2)}",
                "in" => $"{column} IN ({List()})",
                "not-in" => $"{column} NOT IN ({List()})",
                "is-empty" => text ? $"({column} IS NULL OR {column} = '')" : $"{column} IS NULL",
                "is-not-empty" => text ? $"({column} IS NOT NULL AND {column} <> '')" : $"{column} IS NOT NULL",
                "is-true" => $"{column} = {Bind(true)}",
                "is-false" => $"{column} = {Bind(false)}",
                _ => throw new FilterException($"unknown operator: {r.Operator}"),
            };
        }
        string Write(FilterGroup g, bool top)
        {
            var parts = g.Children.Select(c => c is FilterRule r ? Rule(r) : Write((FilterGroup)c, false)).ToList();
            var joined = string.Join(g.Combinator == "and" ? " AND " : " OR ", parts);
            if (g.Not) return $"NOT ({joined})";
            return parts.Count > 1 && !top ? $"({joined})" : joined;
        }
        var sql = Write(tree, true);
        return new SqlResult(sql, parameters);
    }

    // ---------------------------------------------------------------------
    // MongoDB
    // ---------------------------------------------------------------------

    private static string EscapeRegex(string text) => Regex.Replace(text, @"[.*+?^${}()|\[\]\\]", m => "\\" + m.Value);

    /// <summary>The filter as a MongoDB query document. An empty filter is <c>{}</c>. A negated text match is <c>{ $not: { $regex, $options } }</c> (JSON has no regex literal).</summary>
    public static JsonObject ToMongo(FilterGroup group, IReadOnlyList<FilterField> fields)
    {
        if (Normalise(group, fields) is not { } tree) return new JsonObject();
        var byId = fields.ToDictionary(f => f.Id);
        JsonObject Obj(string key, JsonNode? value) => new() { [key] = value };
        JsonObject Regex(string source) => new() { ["$regex"] = source, ["$options"] = "i" };
        JsonObject Rule(FilterRule r)
        {
            var field = byId[r.Field];
            var key = field.Column ?? field.Id;
            var text = field.Type == FilterFieldType.Text;
            var v = r.Value;
            return r.Operator switch
            {
                "contains" => Obj(key, Regex(EscapeRegex(AsText(v)))),
                "not-contains" => Obj(key, Obj("$not", Regex(EscapeRegex(AsText(v))))),
                "starts-with" => Obj(key, Regex("^" + EscapeRegex(AsText(v)))),
                "ends-with" => Obj(key, Regex(EscapeRegex(AsText(v)) + "$")),
                "equals" => Obj(key, ToNode(v)),
                "not-equals" => Obj(key, Obj("$ne", ToNode(v))),
                "gt" => Obj(key, Obj("$gt", ToNode(v))),
                "gte" => Obj(key, Obj("$gte", ToNode(v))),
                "lt" => Obj(key, Obj("$lt", ToNode(v))),
                "lte" => Obj(key, Obj("$lte", ToNode(v))),
                "between" => Obj(key, new JsonObject { ["$gte"] = ToNode(v), ["$lte"] = ToNode(r.Value2) }),
                "not-between" => Obj("$or", new JsonArray(Obj(key, Obj("$lt", ToNode(v))), Obj(key, Obj("$gt", ToNode(r.Value2))))),
                "in" => Obj(key, Obj("$in", ToNode(v))),
                "not-in" => Obj(key, Obj("$nin", ToNode(v))),
                "is-empty" => text ? Obj("$or", new JsonArray(Obj(key, null), Obj(key, ""))) : Obj(key, null),
                "is-not-empty" => text ? Obj("$and", new JsonArray(Obj(key, Obj("$ne", null)), Obj(key, Obj("$ne", "")))) : Obj(key, Obj("$ne", null)),
                "is-true" => Obj(key, true),
                "is-false" => Obj(key, false),
                _ => throw new FilterException($"unknown operator: {r.Operator}"),
            };
        }
        JsonObject Write(FilterGroup g)
        {
            var parts = g.Children.Select(c => c is FilterRule r ? Rule(r) : Write((FilterGroup)c)).ToList();
            var body = parts.Count == 1 ? parts[0] : Obj(g.Combinator == "and" ? "$and" : "$or", new JsonArray(parts.Select(p => (JsonNode?)p).ToArray()));
            return g.Not ? Obj("$nor", new JsonArray(body)) : body;
        }
        return Write(tree);
    }

    // ---------------------------------------------------------------------
    // OData
    // ---------------------------------------------------------------------

    private static string ODataString(object? v) => "'" + AsText(v).Replace("'", "''") + "'";

    /// <summary>The filter as an OData <c>$filter</c> expression. An empty filter is the empty string.</summary>
    public static string ToOData(FilterGroup group, IReadOnlyList<FilterField> fields)
    {
        if (Normalise(group, fields) is not { } tree) return "";
        var byId = fields.ToDictionary(f => f.Id);
        string Rule(FilterRule r)
        {
            var field = byId[r.Field];
            var name = field.Column ?? field.Id;
            var type = field.Type;
            string Lit(object? v) => type is FilterFieldType.Number or FilterFieldType.Date ? AsText(v) : ODataString(v);
            var v = r.Value;
            string List() => string.Join(",", (AsList(v) ?? Array.Empty<string>()).Select(x => Lit(x)));
            return r.Operator switch
            {
                "contains" => $"contains(tolower({name}),tolower({ODataString(v)}))",
                "not-contains" => $"not contains(tolower({name}),tolower({ODataString(v)}))",
                "starts-with" => $"startswith(tolower({name}),tolower({ODataString(v)}))",
                "ends-with" => $"endswith(tolower({name}),tolower({ODataString(v)}))",
                "equals" => $"{name} eq {Lit(v)}",
                "not-equals" => $"{name} ne {Lit(v)}",
                "gt" => $"{name} gt {Lit(v)}",
                "gte" => $"{name} ge {Lit(v)}",
                "lt" => $"{name} lt {Lit(v)}",
                "lte" => $"{name} le {Lit(v)}",
                "between" => $"({name} ge {Lit(v)} and {name} le {Lit(r.Value2)})",
                "not-between" => $"({name} lt {Lit(v)} or {name} gt {Lit(r.Value2)})",
                "in" => $"{name} in ({List()})",
                "not-in" => $"not ({name} in ({List()}))",
                "is-empty" => type == FilterFieldType.Text ? $"({name} eq null or {name} eq '')" : $"{name} eq null",
                "is-not-empty" => type == FilterFieldType.Text ? $"({name} ne null and {name} ne '')" : $"{name} ne null",
                "is-true" => $"{name} eq true",
                "is-false" => $"{name} eq false",
                _ => throw new FilterException($"unknown operator: {r.Operator}"),
            };
        }
        string Write(FilterGroup g, bool top)
        {
            var parts = g.Children.Select(c => c is FilterRule r ? Rule(r) : Write((FilterGroup)c, false)).ToList();
            var joined = string.Join(g.Combinator == "and" ? " and " : " or ", parts);
            if (g.Not) return $"not ({joined})";
            return parts.Count > 1 && !top ? $"({joined})" : joined;
        }
        return Write(tree, true);
    }

    // ---------------------------------------------------------------------
    // One call for display
    // ---------------------------------------------------------------------

    private static readonly JsonSerializerOptions Pretty = new() { WriteIndented = true, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping };

    /// <summary>The filter as text in <paramref name="format"/>, for showing or copying. SQL shows its values inline (display only).</summary>
    public static string FormatFilter(FilterGroup group, IReadOnlyList<FilterField> fields, FilterOutputFormat format, SqlDialect dialect = SqlDialect.Ansi)
        => format switch
        {
            FilterOutputFormat.Json => (ToJson(group, fields) is { } json ? json.ToJsonString(Pretty) : "null"),
            FilterOutputFormat.Sql => ToSql(group, fields, dialect, inline: true).Sql,
            FilterOutputFormat.Mongo => ToMongo(group, fields).ToJsonString(Pretty),
            _ => ToOData(group, fields),
        };
}
