// The bUnit twin of pattern-tester.ts: drives the same pattern-contracts.json through roles and ARIA state.
// bUnit has no browser focus, so "focus" steps are skipped here; every other expectation matches the DOM driver.
// Linked into a test project with <Compile Include>. Spec: spec/testing/index.md#pattern-testers.

using System;
using System.IO;
using System.Linq;
using System.Text.Json;
using AngleSharp.Dom;
using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace LilyDesignSystem.Blazor.Testing;

public static class PatternTester
{
    private static JsonElement Contracts()
    {
        for (var dir = new DirectoryInfo(AppContext.BaseDirectory); dir is not null; dir = dir.Parent)
        {
            var path = Path.Combine(dir.FullName, "shared", "pattern-contracts.json");
            if (File.Exists(path)) return JsonDocument.Parse(File.ReadAllText(path)).RootElement;
        }
        throw new FileNotFoundException("shared/pattern-contracts.json");
    }

    /// <summary><paramref name="open"/> opens the widget, for `combobox` and `dialog`, whose opening is the consumer's.</summary>
    public static void Run<T>(IRenderedComponent<T> cut, string pattern, string hook, Action? open = null) where T : IComponent
    {
        if (pattern == "autosuggest")
        {
            RunAutosuggest(cut, hook);
            return;
        }
        if (pattern == "grid")
        {
            RunGrid(cut, hook);
            return;
        }
        if (pattern is "combobox" or "dialog")
        {
            RunOverlay(cut, pattern, hook, open ?? throw new ArgumentNullException(nameof(open)));
            return;
        }
        IElement Button() => cut.Find($".{hook}-button");
        IElement? Popup()
        {
            var id = Button().GetAttribute("aria-controls");
            return string.IsNullOrEmpty(id) ? null : cut.FindAll($"[id='{id}']").FirstOrDefault();
        }
        IElement Part(string name) => name == "button"
            ? Button()
            : Popup() ?? throw new Exception($"{pattern}: no popup; aria-controls must name it");

        foreach (var step in Contracts().GetProperty(pattern).GetProperty("steps").EnumerateArray())
        {
            var name = step.GetProperty("name").GetString();
            void Fail(string message) => throw new Exception($"{pattern}, {hook}, \"{name}\": {message}");
            IElement[] Options() => Part("popup").QuerySelectorAll("[role='option']").ToArray();
            int At(JsonElement index) =>
                index.ValueKind == JsonValueKind.Number ? index.GetInt32() : Options().Length - 1;
            string On() => step.TryGetProperty("on", out var on) ? on.GetString()! : "button";

            if (step.TryGetProperty("click", out var click)) Part(click.GetString()!).Click();
            else if (step.TryGetProperty("press", out var press))
                Part(On()).KeyDown(new KeyboardEventArgs { Key = press.GetString()! });
            else if (step.TryGetProperty("pressFirstLetterOf", out var letterOf))
            {
                var label = Options()[letterOf.GetInt32()].TextContent.Trim();
                Part(On()).KeyDown(new KeyboardEventArgs { Key = label[..1].ToLowerInvariant() });
            }

            var expected = step.GetProperty("expect");
            if (expected.TryGetProperty("expanded", out var expanded))
            {
                var want = expanded.GetBoolean();
                var value = Button().GetAttribute("aria-expanded");
                if (value != (want ? "true" : "false")) Fail($"aria-expanded is {value}, not {want}");
                var hidden = Popup()?.HasAttribute("hidden") ?? true;
                if (hidden == want) Fail($"popup hidden is {hidden} while aria-expanded is {value}");
            }
            if (pattern == "picker-listbox")
            {
                if (Button().GetAttribute("aria-haspopup") != "listbox") Fail("the button lacks aria-haspopup=\"listbox\"");
                var list = Part("popup");
                if (list.GetAttribute("role") != "listbox") Fail("the popup lacks role=\"listbox\"");
                if (string.IsNullOrEmpty(list.GetAttribute("aria-label")) && string.IsNullOrEmpty(list.GetAttribute("aria-labelledby")))
                    Fail("the listbox has no name");
                var all = Options();
                if (all.Length < 3) Fail($"needs three options, found {all.Length}");
                foreach (var option in all)
                {
                    var value = option.GetAttribute("aria-selected");
                    if (value is not ("true" or "false")) Fail($"option \"{option.TextContent.Trim()}\" has aria-selected={value}");
                }
                if (expected.TryGetProperty("selected", out var selected))
                {
                    var found = all.Select((o, i) => (o, i)).Where(x => x.o.GetAttribute("aria-selected") == "true").Select(x => x.i).ToArray();
                    if (found.Length != 1 || found[0] != At(selected)) Fail($"selected option(s) [{string.Join(",", found)}], expected {At(selected)}");
                }
                if (expected.TryGetProperty("active", out var active))
                {
                    var target = all[At(active)];
                    var value = list.GetAttribute("aria-activedescendant");
                    if (string.IsNullOrEmpty(value) || value != target.Id) Fail($"aria-activedescendant is {value}, not {target.Id}");
                    var marked = all.Select((o, i) => (o, i)).Where(x => x.o.HasAttribute("data-active")).Select(x => x.i).ToArray();
                    if (marked.Length != 1 || marked[0] != At(active)) Fail($"data-active on [{string.Join(",", marked)}], expected {At(active)}");
                }
            }
        }
    }

    // `prevented` is Autosuggest.razor.js's, proved in tests/js; the input's own value is C# state, read from the attribute.
    private static void RunAutosuggest<T>(IRenderedComponent<T> cut, string hook) where T : IComponent
    {
        var labels = Contracts().GetProperty("autosuggest").GetProperty("fixture").GetProperty("suggestions")
            .EnumerateArray().Select(s => s.GetProperty("value").GetString()).ToArray();
        foreach (var step in Contracts().GetProperty("autosuggest").GetProperty("steps").EnumerateArray())
        {
            var name = step.GetProperty("name").GetString();
            void Fail(string message) => throw new Exception($"autosuggest, {hook}, \"{name}\": {message}");
            if (step.TryGetProperty("press", out var press))
                cut.Find("[role='combobox']").KeyDown(new KeyboardEventArgs { Key = press.GetString()!, AltKey = step.TryGetProperty("alt", out _) });

            var input = cut.Find("[role='combobox']");
            var expected = step.GetProperty("expect");
            var expanded = input.GetAttribute("aria-expanded");
            if (expanded != (expected.GetProperty("expanded").GetBoolean() ? "true" : "false")) Fail($"aria-expanded is {expanded}");
            var descendant = input.GetAttribute("aria-activedescendant");
            if (expected.TryGetProperty("active", out var active))
            {
                var options = cut.FindAll("[role='option']");
                var want = options[active.ValueKind == JsonValueKind.Number ? active.GetInt32() : options.Count - 1];
                if (string.IsNullOrEmpty(descendant) || descendant != want.Id) Fail($"aria-activedescendant is {descendant}, not {want.Id}");
                if (want.GetAttribute("aria-selected") != "true") Fail("the active option lacks aria-selected=\"true\"");
            }
            else if (!string.IsNullOrEmpty(descendant)) Fail($"aria-activedescendant is {descendant}");
            if (expected.TryGetProperty("value", out var chosen) && input.GetAttribute("value") != labels[chosen.GetInt32()])
                Fail($"the input holds \"{input.GetAttribute("value")}\"");
        }
    }

    // No focus here, so a step proves where the one tab stop went.
    private static void RunGrid<T>(IRenderedComponent<T> cut, string hook) where T : IComponent
    {
        var first = true;
        foreach (var step in Contracts().GetProperty("grid").GetProperty("steps").EnumerateArray())
        {
            var name = step.GetProperty("name").GetString();
            void Fail(string message) => throw new Exception($"grid, {hook}, \"{name}\": {message}");
            if (!first && step.TryGetProperty("press", out var press))
                cut.Find("[role='grid']").KeyDown(new KeyboardEventArgs
                {
                    Key = press.GetString()!,
                    CtrlKey = step.TryGetProperty("ctrl", out _),
                });
            first = false;

            var rows = cut.FindAll("[role='grid'] tr").Select(row => row.QuerySelectorAll("th, td").ToArray()).ToArray();
            var want = step.GetProperty("expect").GetProperty("cell");
            var wantRow = want[0];
            var wantCol = want[1];
            var cells = rows[wantRow.ValueKind == JsonValueKind.Number ? wantRow.GetInt32() : rows.Length - 1];
            var cell = cells[wantCol.ValueKind == JsonValueKind.Number ? wantCol.GetInt32() : cells.Length - 1];
            var stops = rows.SelectMany(row => row).Where(c => c.GetAttribute("tabindex") == "0").ToArray();
            if (stops.Length != 1 || stops[0] != cell) Fail($"{stops.Length} tab stop(s), and the cell must be the one");
        }
    }

    // bUnit has no browser, so `prevented`, `pressHandled`, focus, showModal and the popover's shown state are the DOM
    // driver's. A Blazor handler cannot read defaultPrevented either: see spec/testing/index.md#pattern-testers.
    private static void RunOverlay<T>(IRenderedComponent<T> cut, string pattern, string hook, Action open) where T : IComponent
    {
        foreach (var step in Contracts().GetProperty(pattern).GetProperty("steps").EnumerateArray())
        {
            // From here on the combobox's keys are Combobox.razor.js's: tests/js/combobox.pattern.test.mjs runs them.
            if (pattern == "combobox" && step.TryGetProperty("alt", out _)) break;
            var name = step.GetProperty("name").GetString();
            void Fail(string message) => throw new Exception($"{pattern}, {hook}, \"{name}\": {message}");
            if (step.TryGetProperty("pressHandled", out _)) continue;
            if (step.TryGetProperty("open", out _)) open();
            else if (step.TryGetProperty("press", out var press))
                cut.Find(pattern == "combobox" ? "[role='combobox']" : "dialog")
                    .KeyDown(new KeyboardEventArgs { Key = press.GetString()! });
            else if (step.TryGetProperty("cancel", out _))
                cut.Find("dialog").TriggerEvent("oncancel", EventArgs.Empty);

            var expected = step.GetProperty("expect");
            if (pattern == "combobox")
            {
                var input = cut.Find("[role='combobox']");
                if (input.GetAttribute("aria-autocomplete") != "list") Fail("the input lacks aria-autocomplete=\"list\"");
                if (string.IsNullOrEmpty(input.GetAttribute("aria-label"))) Fail("the input has no name");
                var list = cut.Find($"[id='{input.GetAttribute("aria-controls")}']");
                if (list.GetAttribute("role") != "listbox") Fail("the popup lacks role=\"listbox\"");
                if (string.IsNullOrEmpty(list.GetAttribute("aria-label"))) Fail("the listbox has no name");
                var value = input.GetAttribute("aria-expanded");
                if (value != (expected.GetProperty("expanded").GetBoolean() ? "true" : "false")) Fail($"aria-expanded is {value}");
            }
            else
            {
                var dialog = cut.FindAll("dialog").FirstOrDefault();
                if ((dialog is not null) != expected.GetProperty("open").GetBoolean()) Fail($"dialog rendered is {dialog is not null}");
                if (expected.TryGetProperty("modal", out _))
                {
                    if (dialog!.GetAttribute("aria-modal") != "true") Fail("it lacks aria-modal=\"true\"");
                    if (string.IsNullOrEmpty(dialog.GetAttribute("aria-label"))) Fail("it has no name");
                }
            }
        }
    }
}
