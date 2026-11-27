using System.Text.Json;
using LilyDesignSystem.Maui.Core;

namespace LilyDesignSystem.Maui.Tests;

// shared/vectors/form-parts.json against the C# port (tasks.md P62-T3): every case, including those that must throw.
public class FormPartsVectorTests
{
    private static int Whole(JsonElement e, string reason)
    {
        var n = e.GetDouble();
        if (Math.Truncate(n) != n) throw new FormPartsException(reason, "not whole");
        return (int)n;
    }

    private static double? Number(JsonElement e) => e.ValueKind == JsonValueKind.Null ? null : e.GetDouble();

    private static object? Call(string fn, JsonElement args) => fn switch
    {
        "datePartsShown" => FormParts.DatePartsShown(args[0].GetString()!),
        "dateSequence" => FormParts.DateSequence(args[0].GetString()!, args[1].GetString()!),
        "splitDateValue" => FormParts.SplitDateValue(args[0].GetString()!, args[1].GetString()!) is var p
            ? new Dictionary<string, string> { ["year"] = p.Year, ["month"] = p.Month, ["day"] = p.Day }
            : null,
        "joinDateParts" => FormParts.JoinDateParts(
            new DateParts(args[0].GetProperty("year").GetString()!, args[0].GetProperty("month").GetString()!, args[0].GetProperty("day").GetString()!),
            args[1].GetString()!),
        "isCalendarDate" => FormParts.IsCalendarDate(args[0].GetString()!),
        "quantityProblem" => FormParts.QuantityProblem(args[0].GetString()!, Number(args[1]), Number(args[2])),
        "canAddItem" => FormParts.CanAddItem(
            Whole(args[0], "count"), args[1].ValueKind == JsonValueKind.Null ? null : Whole(args[1], "limit")),
        "canRemoveItem" => FormParts.CanRemoveItem(Whole(args[0], "count"), Whole(args[1], "limit")),
        "stepStatus" => FormParts.StepStatus(Whole(args[0], "index"), Whole(args[1], "index")),
        _ => throw new InvalidOperationException($"unknown vector function {fn}"),
    };

    [Fact]
    public void EveryCaseAgreesWithTheTypeScript()
    {
        var path = Path.Combine(AppContext.BaseDirectory, "vectors", "form-parts.json");
        using var doc = JsonDocument.Parse(File.ReadAllText(path));
        var count = 0;
        foreach (var c in doc.RootElement.GetProperty("cases").EnumerateArray())
        {
            var fn = c.GetProperty("fn").GetString()!;
            var args = c.GetProperty("args");
            var label = $"{fn}({args})";
            if (c.TryGetProperty("throws", out var reason))
            {
                var error = Assert.Throws<FormPartsException>(() => Call(fn, args));
                Assert.True(error.Reason == reason.GetString(), $"{label} threw {error.Reason}, expected {reason}");
            }
            else
            {
                var expected = JsonSerializer.Serialize(c.GetProperty("expected"));
                var got = JsonSerializer.Serialize(Call(fn, args));
                Assert.True(expected == got, $"{label}: got {got}, expected {expected}");
            }
            count++;
        }
        Assert.True(count > 40);
    }
}
