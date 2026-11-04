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

    public static void Run<T>(IRenderedComponent<T> cut, string pattern, string hook) where T : IComponent
    {
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
}
