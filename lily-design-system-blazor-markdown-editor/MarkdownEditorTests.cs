// MarkdownEditor tests — one [Fact] per spec/index.md §6 clause.
//
// bUnit has no browser: the textarea's selection and the edited text travel over IJSRuntime
// "eval". The selection script is answered with a canned [start, end]; the apply script is
// recorded, and its argument is what the tests assert on.
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class MarkdownEditorTests : TestContext
{
    private static readonly Dictionary<string, string> AllLabels = new()
    {
        ["heading"] = "Heading",
        ["bold"] = "Bold",
        ["italic"] = "Italic",
        ["strikethrough"] = "Strikethrough",
        ["code"] = "Code",
        ["link"] = "Link",
        ["quote"] = "Quote",
        ["bulletList"] = "Bulleted list",
        ["numberedList"] = "Numbered list",
    };

    private IRenderedComponent<MarkdownEditor> Render(Action<ComponentParameterCollectionBuilder<MarkdownEditor>>? more = null, string value = "hello world", int[]? selection = null, Dictionary<string, string>? labels = null)
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        var sel = selection ?? new[] { 0, 5 };
        JSInterop.Setup<int[]?>("eval", s => s.Arguments.Count > 0 && ((string?)s.Arguments[0])!.Contains("selectionStart")).SetResult(sel);
        return RenderComponent<MarkdownEditor>(p =>
        {
            p.Add(c => c.Label, "Message")
             .Add(c => c.ToolbarLabel, "Formatting")
             .Add(c => c.Labels, labels ?? AllLabels)
             .Add(c => c.Value, value);
            more?.Invoke(p);
        });
    }

    private string? LastApplied() =>
        JSInterop.Invocations.Where(i => i.Identifier == "eval" && ((string)i.Arguments[0]!).Contains("insertText"))
            .Select(i => (string)i.Arguments[0]!).LastOrDefault();

    // ---- structure ----

    [Fact]
    public void Renders_a_toolbar_and_a_textarea_under_the_base_classes()
    {
        var cut = Render();
        Assert.NotNull(cut.Find("div.markdown-editor"));
        var bar = cut.Find("[role=toolbar]");
        Assert.Equal("Formatting", bar.GetAttribute("aria-label"));
        Assert.Contains("markdown-editor-toolbar", bar.GetAttribute("class"));
        var ta = cut.Find("textarea.markdown-editor-textarea");
        Assert.Equal("Message", ta.GetAttribute("aria-label"));
        Assert.Equal("hello world", ta.GetAttribute("value") ?? ta.TextContent);
    }

    [Fact]
    public void Renders_one_named_button_per_labelled_tool_in_order() =>
        Assert.Equal(AllLabels.Values, Render().FindAll("button").Select(b => b.GetAttribute("aria-label")));

    [Fact]
    public void Omits_a_tool_that_has_no_label() =>
        Assert.Single(Render(labels: new Dictionary<string, string> { ["bold"] = "Bold" }).FindAll("button"));

    [Fact]
    public void Honours_the_Tools_parameter_for_subset_and_order() =>
        Assert.Equal(new[] { "link", "bold" },
            Render(p => p.Add(c => c.Tools, new[] { "link", "bold" })).FindAll("button").Select(b => b.GetAttribute("data-tool")));

    [Fact]
    public void Every_button_is_type_button()
    {
        foreach (var b in Render().FindAll("button")) Assert.Equal("button", b.GetAttribute("type"));
    }

    [Fact]
    public void Icons_are_decorative_and_draw_one_path_each()
    {
        var cut = Render();
        foreach (var svg in cut.FindAll("svg")) Assert.Equal("true", svg.GetAttribute("aria-hidden"));
        Assert.Equal(9, cut.FindAll("svg path").Count);
    }

    [Fact]
    public void The_toolbar_controls_the_textarea()
    {
        var cut = Render();
        Assert.Equal(cut.Find("textarea").GetAttribute("id"), cut.Find("[role=toolbar]").GetAttribute("aria-controls"));
    }

    [Fact]
    public void Passes_Name_Rows_Placeholder_Required_through_to_the_textarea()
    {
        var ta = Render(p => p.Add(c => c.Name, "body").Add(c => c.Rows, 6).Add(c => c.Placeholder, "Type").Add(c => c.Required, true)).Find("textarea");
        Assert.Equal("body", ta.GetAttribute("name"));
        Assert.Equal("6", ta.GetAttribute("rows"));
        Assert.Equal("Type", ta.GetAttribute("placeholder"));
        Assert.True(ta.HasAttribute("required"));
    }

    [Fact]
    public void CssClass_and_unmatched_attributes_land_on_the_root()
    {
        var root = Render(p => p.Add(c => c.CssClass, "mine").AddUnmatched("data-x", "1")).Find(".markdown-editor");
        Assert.Equal("markdown-editor mine", root.GetAttribute("class"));
        Assert.Equal("1", root.GetAttribute("data-x"));
    }

    [Fact]
    public void Ships_no_English_of_its_own_no_labels_no_buttons() =>
        Assert.Empty(Render(labels: new Dictionary<string, string>()).FindAll("button"));

    [Fact]
    public void Exactly_one_button_holds_the_tab_stop()
    {
        var tabbable = Render().FindAll("button").Where(b => b.GetAttribute("tabindex") == "0").ToList();
        Assert.Single(tabbable);
        Assert.Equal("heading", tabbable[0].GetAttribute("data-tool"));
    }

    [Fact]
    public void Ids_are_unique_per_editor() =>
        Assert.NotEqual(Render().Find("textarea").GetAttribute("id"), Render().Find("textarea").GetAttribute("id"));

    // ---- tools ----

    [Fact]
    public async Task Bold_wraps_the_selection_applies_it_in_the_browser_and_reports_the_value()
    {
        string? reported = null;
        var cut = Render(p => p.Add(c => c.ValueChanged, EventCallback.Factory.Create<string>(this, v => reported = v)));
        await cut.Find("button[data-tool=bold]").ClickAsync(new MouseEventArgs());
        Assert.Equal("**hello** world", reported);
        var script = LastApplied()!;
        Assert.Contains("\"**hello** world\"", script);
        Assert.Contains("setSelectionRange(2, 7)", script);
    }

    [Fact]
    public async Task The_apply_script_asks_the_browser_to_keep_native_undo()
    {
        var cut = Render();
        await cut.Find("button[data-tool=italic]").ClickAsync(new MouseEventArgs());
        Assert.Contains("execCommand('insertText'", LastApplied());
    }

    [Fact]
    public async Task List_tools_prefix_the_selected_lines()
    {
        var cut = Render(value: "a\nb", selection: new[] { 0, 3 });
        await cut.Find("button[data-tool=numberedList]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"1. a\\n2. b\"", LastApplied());
    }

    [Fact]
    public async Task Link_selects_the_address_placeholder()
    {
        var cut = Render();
        await cut.Find("button[data-tool=link]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"[hello](https://) world\"", LastApplied());
        Assert.Contains("setSelectionRange(8, 16)", LastApplied());
    }

    [Fact]
    public async Task The_heading_level_is_a_parameter()
    {
        var cut = Render(p => p.Add(c => c.HeadingLevel, 3), selection: new[] { 0, 0 });
        await cut.Find("button[data-tool=heading]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"### hello world\"", LastApplied());
    }

    [Fact]
    public async Task Typing_updates_the_value_and_reports_it()
    {
        string? reported = null;
        var cut = Render(p => p.Add(c => c.ValueChanged, EventCallback.Factory.Create<string>(this, v => reported = v)), value: "");
        await cut.Find("textarea").InputAsync(new ChangeEventArgs { Value = "ab" });
        Assert.Equal("ab", reported);
    }

    [Fact]
    public async Task The_script_text_is_escaped_as_a_JavaScript_string()
    {
        var cut = Render(value: "say \"hi\"\n</script>", selection: new[] { 0, 0 });
        await cut.Find("button[data-tool=quote]").ClickAsync(new MouseEventArgs());
        var script = LastApplied()!;
        Assert.Contains("\\u0022hi\\u0022", script);
        Assert.DoesNotContain("</script>", script);
        Assert.Contains("\\n", script);
    }

    // ---- keyboard ----

    [Fact]
    public async Task Arrows_move_the_tab_stop_clamping_at_the_ends_and_Home_End_jump()
    {
        var cut = Render();
        string Stop() => cut.FindAll("button").Single(b => b.GetAttribute("tabindex") == "0").GetAttribute("data-tool")!;
        await cut.FindAll("button")[0].KeyDownAsync(new KeyboardEventArgs { Key = "ArrowRight" });
        Assert.Equal("bold", Stop());
        await cut.FindAll("button")[1].KeyDownAsync(new KeyboardEventArgs { Key = "ArrowLeft" });
        await cut.FindAll("button")[0].KeyDownAsync(new KeyboardEventArgs { Key = "ArrowLeft" });
        Assert.Equal("heading", Stop());
        await cut.FindAll("button")[0].KeyDownAsync(new KeyboardEventArgs { Key = "End" });
        Assert.Equal("numberedList", Stop());
        await cut.FindAll("button")[8].KeyDownAsync(new KeyboardEventArgs { Key = "Home" });
        Assert.Equal("heading", Stop());
    }

    // ---- disabled / readonly ----

    [Fact]
    public void Disabled_disables_the_textarea_and_every_button()
    {
        var cut = Render(p => p.Add(c => c.Disabled, true));
        Assert.True(cut.Find("textarea").HasAttribute("disabled"));
        foreach (var b in cut.FindAll("button")) Assert.True(b.HasAttribute("disabled"));
    }

    [Fact]
    public async Task ReadOnly_keeps_the_text_unchangeable_by_a_tool()
    {
        var cut = Render(p => p.Add(c => c.ReadOnly, true));
        await cut.Find("button[data-tool=bold]").ClickAsync(new MouseEventArgs());
        Assert.Null(LastApplied());
        Assert.Equal("true", cut.Find("button[data-tool=bold]").GetAttribute("aria-disabled"));
    }

    // ---- icon fragment ----

    [Fact]
    public void The_Icon_fragment_replaces_the_default_icons()
    {
        var cut = Render(p => p.Add(c => c.Icon, (RenderFragment<string>)(tool => b => b.AddMarkupContent(0, $"<span data-icon=\"{tool}\">x</span>"))));
        Assert.Empty(cut.FindAll("svg"));
        Assert.Equal(9, cut.FindAll("[data-icon]").Count);
    }
}
