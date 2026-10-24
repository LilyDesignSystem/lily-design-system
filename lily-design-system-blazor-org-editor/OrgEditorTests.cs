// OrgEditor tests — one [Fact] per spec/index.md §6 clause.
//
// bUnit has no browser: the textarea's selection and the edited text travel over IJSRuntime
// "eval". The selection script is answered with a canned [start, end]; the apply script is
// recorded, and its argument is what the tests assert on.
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class OrgEditorTests : TestContext
{
    private static readonly Dictionary<string, string> AllLabels = new()
    {
        ["heading"] = "Heading",
        ["promote"] = "Promote",
        ["demote"] = "Demote",
        ["todo"] = "Task",
        ["priority"] = "Priority",
        ["scheduled"] = "Scheduled",
        ["deadline"] = "Deadline",
        ["timestamp"] = "Timestamp",
        ["bold"] = "Bold",
        ["italic"] = "Italic",
        ["underline"] = "Underline",
        ["strikethrough"] = "Strikethrough",
        ["code"] = "Code",
        ["verbatim"] = "Verbatim",
        ["link"] = "Link",
        ["bulletList"] = "Bulleted list",
        ["numberedList"] = "Numbered list",
        ["checkbox"] = "Checkbox",
        ["quote"] = "Quote",
        ["sourceBlock"] = "Source block",
        ["property"] = "Property",
        ["drawer"] = "Drawer",
        ["contact"] = "Contact",
    };

    private IRenderedComponent<OrgEditor> Render(Action<ComponentParameterCollectionBuilder<OrgEditor>>? more = null, string value = "hello world", int[]? selection = null, Dictionary<string, string>? labels = null)
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        var sel = selection ?? new[] { 0, 5 };
        JSInterop.Setup<int[]?>("eval", s => s.Arguments.Count > 0 && ((string?)s.Arguments[0])!.Contains("selectionStart")).SetResult(sel);
        return RenderComponent<OrgEditor>(p =>
        {
            p.Add(c => c.Label, "Notes")
             .Add(c => c.ToolbarLabel, "Formatting")
             .Add(c => c.Labels, labels ?? AllLabels)
             .Add(c => c.Value, value)
             .Add(c => c.Today, "2026-10-24");
            more?.Invoke(p);
        });
    }

    private string? LastApplied() =>
        JSInterop.Invocations.Where(i => i.Identifier == "eval" && ((string)i.Arguments[0]!).Contains("insertText"))
            .Select(i => (string)i.Arguments[0]!).LastOrDefault();

    private static string EscapeForScript(string text) => JsonSerializer.Serialize(text).Trim('"');

    // ---- structure ----

    [Fact]
    public void Renders_a_toolbar_and_a_textarea_under_the_base_classes()
    {
        var cut = Render();
        Assert.NotNull(cut.Find("div.org-editor"));
        var bar = cut.Find("[role=toolbar]");
        Assert.Equal("Formatting", bar.GetAttribute("aria-label"));
        Assert.Contains("org-editor-toolbar", bar.GetAttribute("class"));
        Assert.Equal("Notes", cut.Find("textarea.org-editor-textarea").GetAttribute("aria-label"));
    }

    [Fact]
    public void Renders_one_named_button_per_labelled_tool_in_the_default_order()
    {
        var cut = Render();
        Assert.Equal(OrgFormat.ToolIds, cut.FindAll("button").Select(b => b.GetAttribute("data-tool")));
        Assert.Equal(OrgFormat.ToolIds.Select(t => AllLabels[t]), cut.FindAll("button").Select(b => b.GetAttribute("aria-label")));
    }

    [Fact]
    public void Every_button_carries_its_group()
    {
        foreach (var b in Render().FindAll("button")) Assert.Equal(OrgFormat.ToolGroups[b.GetAttribute("data-tool")!], b.GetAttribute("data-group"));
    }

    [Fact]
    public void Omits_a_tool_that_has_no_label() =>
        Assert.Single(Render(labels: new Dictionary<string, string> { ["todo"] = "Task" }).FindAll("button"));

    [Fact]
    public void Honours_the_Tools_parameter_for_subset_and_order() =>
        Assert.Equal(new[] { "contact", "todo" },
            Render(p => p.Add(c => c.Tools, new[] { "contact", "todo" })).FindAll("button").Select(b => b.GetAttribute("data-tool")));

    [Fact]
    public void Every_button_is_type_button_and_exactly_one_holds_the_tab_stop()
    {
        var cut = Render();
        foreach (var b in cut.FindAll("button")) Assert.Equal("button", b.GetAttribute("type"));
        var tabbable = cut.FindAll("button").Where(b => b.GetAttribute("tabindex") == "0").ToList();
        Assert.Single(tabbable);
        Assert.Equal("heading", tabbable[0].GetAttribute("data-tool"));
    }

    [Fact]
    public void Icons_are_decorative_and_draw_one_path_each()
    {
        var cut = Render();
        foreach (var svg in cut.FindAll("svg")) Assert.Equal("true", svg.GetAttribute("aria-hidden"));
        Assert.Equal(OrgFormat.ToolIds.Count, cut.FindAll("svg path").Count);
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
        var root = Render(p => p.Add(c => c.CssClass, "mine").AddUnmatched("data-x", "1")).Find(".org-editor");
        Assert.Equal("org-editor mine", root.GetAttribute("class"));
        Assert.Equal("1", root.GetAttribute("data-x"));
    }

    [Fact]
    public void Ships_no_English_of_its_own_no_labels_no_buttons() =>
        Assert.Empty(Render(labels: new Dictionary<string, string>()).FindAll("button"));

    [Fact]
    public void Ids_are_unique_per_editor() =>
        Assert.NotEqual(Render().Find("textarea").GetAttribute("id"), Render().Find("textarea").GetAttribute("id"));

    // ---- tools (the cases every port shares) ----

    [Fact]
    public async Task Bold_Wraps_The_Selection_In_Org_S_Single_Asterisks()
    {
        var cut = Render(null, value: "hello world", selection: new[] { 0, 5 });
        await cut.Find("button[data-tool=bold]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("*hello* world") + "\"", LastApplied());
        Assert.Contains("setSelectionRange(1, 6)", LastApplied());
    }

    [Fact]
    public async Task Italic_Uses_Slashes()
    {
        var cut = Render(null, value: "hello world", selection: new[] { 0, 5 });
        await cut.Find("button[data-tool=italic]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("/hello/ world") + "\"", LastApplied());
    }

    [Fact]
    public async Task Underline_Uses_Underscores()
    {
        var cut = Render(null, value: "hello world", selection: new[] { 0, 5 });
        await cut.Find("button[data-tool=underline]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("_hello_ world") + "\"", LastApplied());
    }

    [Fact]
    public async Task Strikethrough_Uses_Plus_Signs()
    {
        var cut = Render(null, value: "hello world", selection: new[] { 0, 5 });
        await cut.Find("button[data-tool=strikethrough]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("+hello+ world") + "\"", LastApplied());
    }

    [Fact]
    public async Task Code_Uses_Tildes()
    {
        var cut = Render(null, value: "hello world", selection: new[] { 0, 5 });
        await cut.Find("button[data-tool=code]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("~hello~ world") + "\"", LastApplied());
    }

    [Fact]
    public async Task Verbatim_Uses_Equals_Signs()
    {
        var cut = Render(null, value: "hello world", selection: new[] { 0, 5 });
        await cut.Find("button[data-tool=verbatim]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("=hello= world") + "\"", LastApplied());
    }

    [Fact]
    public async Task Link_Writes_An_Org_Link_And_Selects_The_Address()
    {
        var cut = Render(null, value: "hello world", selection: new[] { 0, 5 });
        await cut.Find("button[data-tool=link]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("[[https://][hello]] world") + "\"", LastApplied());
        Assert.Contains("setSelectionRange(2, 10)", LastApplied());
    }

    [Fact]
    public async Task Heading_Uses_The_Headinglevel()
    {
        var cut = Render(p => p.Add(c => c.HeadingLevel, 2), value: "hello world", selection: new[] { 0, 0 });
        await cut.Find("button[data-tool=heading]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("** hello world") + "\"", LastApplied());
    }

    [Fact]
    public async Task Demote_Adds_A_Star()
    {
        var cut = Render(null, value: "* a", selection: new[] { 0, 3 });
        await cut.Find("button[data-tool=demote]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("** a") + "\"", LastApplied());
    }

    [Fact]
    public async Task Demote_Then_Promote_Returns_To_The_Start()
    {
        var cut = Render(null, value: "* a", selection: new[] { 0, 3 });
        await cut.Find("button[data-tool=demote]").ClickAsync(new MouseEventArgs());
        await cut.Find("button[data-tool=promote]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("* a") + "\"", LastApplied());
    }

    [Fact]
    public async Task Task_Makes_Todo()
    {
        var cut = Render(null, value: "* Ship", selection: new[] { 0, 0 });
        await cut.Find("button[data-tool=todo]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("* TODO Ship") + "\"", LastApplied());
    }

    [Fact]
    public async Task Task_Again_Makes_Done()
    {
        var cut = Render(null, value: "* Ship", selection: new[] { 0, 0 });
        await cut.Find("button[data-tool=todo]").ClickAsync(new MouseEventArgs());
        await cut.Find("button[data-tool=todo]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("* DONE Ship") + "\"", LastApplied());
    }

    [Fact]
    public async Task Task_A_Third_Time_Clears_It()
    {
        var cut = Render(null, value: "* Ship", selection: new[] { 0, 0 });
        await cut.Find("button[data-tool=todo]").ClickAsync(new MouseEventArgs());
        await cut.Find("button[data-tool=todo]").ClickAsync(new MouseEventArgs());
        await cut.Find("button[data-tool=todo]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("* Ship") + "\"", LastApplied());
    }

    [Fact]
    public async Task The_Keywords_Are_An_Option()
    {
        var cut = Render(p => p.Add(c => c.TodoKeywords, new[] { "NEXT", "DONE" }), value: "* Ship", selection: new[] { 0, 0 });
        await cut.Find("button[data-tool=todo]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("* NEXT Ship") + "\"", LastApplied());
    }

    [Fact]
    public async Task Priority_Writes___A()
    {
        var cut = Render(null, value: "* Ship", selection: new[] { 0, 0 });
        await cut.Find("button[data-tool=priority]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("* [#A] Ship") + "\"", LastApplied());
    }

    [Fact]
    public async Task Scheduled_Writes_A_Planning_Line_And_Selects_The_Date()
    {
        var cut = Render(null, value: "* Ship\nbody", selection: new[] { 0, 0 });
        await cut.Find("button[data-tool=scheduled]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("* Ship\nSCHEDULED: <2026-10-24 Sat>\nbody") + "\"", LastApplied());
        Assert.Contains("setSelectionRange(19, 33)", LastApplied());
    }

    [Fact]
    public async Task Scheduled_Again_Removes_It()
    {
        var cut = Render(null, value: "* Ship\nbody", selection: new[] { 0, 0 });
        await cut.Find("button[data-tool=scheduled]").ClickAsync(new MouseEventArgs());
        await cut.Find("button[data-tool=scheduled]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("* Ship\nbody") + "\"", LastApplied());
    }

    [Fact]
    public async Task Deadline_Writes_Deadline()
    {
        var cut = Render(null, value: "* Ship", selection: new[] { 0, 0 });
        await cut.Find("button[data-tool=deadline]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("* Ship\nDEADLINE: <2026-10-24 Sat>") + "\"", LastApplied());
    }

    [Fact]
    public async Task Timestamp_Inserts_At_The_Caret()
    {
        var cut = Render(null, value: "due ", selection: new[] { 4, 4 });
        await cut.Find("button[data-tool=timestamp]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("due <2026-10-24 Sat>") + "\"", LastApplied());
    }

    [Fact]
    public async Task Bullet_List_Prefixes_The_Lines()
    {
        var cut = Render(null, value: "a\nb", selection: new[] { 0, 3 });
        await cut.Find("button[data-tool=bulletList]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("- a\n- b") + "\"", LastApplied());
    }

    [Fact]
    public async Task Numbered_List_Counts_From_1()
    {
        var cut = Render(null, value: "a\nb", selection: new[] { 0, 3 });
        await cut.Find("button[data-tool=numberedList]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("1. a\n2. b") + "\"", LastApplied());
    }

    [Fact]
    public async Task Quote_Wraps_The_Lines_In_An_Org_Block()
    {
        var cut = Render(null, value: "x", selection: new[] { 0, 1 });
        await cut.Find("button[data-tool=quote]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("#+BEGIN_QUOTE\nx\n#+END_QUOTE") + "\"", LastApplied());
        Assert.Contains("setSelectionRange(14, 15)", LastApplied());
    }

    [Fact]
    public async Task Source_Block_Wraps_The_Lines()
    {
        var cut = Render(null, value: "x = 1", selection: new[] { 0, 5 });
        await cut.Find("button[data-tool=sourceBlock]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("#+BEGIN_SRC\nx = 1\n#+END_SRC") + "\"", LastApplied());
    }

    [Fact]
    public async Task Property_Adds_A_Drawer_With_The_Key__And_The_Key_Is_An_Option()
    {
        var cut = Render(p => p.Add(c => c.PropertyKey, "CUSTOM_ID"), value: "* Ship", selection: new[] { 0, 0 });
        await cut.Find("button[data-tool=property]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("* Ship\n:PROPERTIES:\n:CUSTOM_ID: \n:END:") + "\"", LastApplied());
    }

    [Fact]
    public async Task Drawer_Wraps_The_Lines__And_The_Name_Is_An_Option()
    {
        var cut = Render(p => p.Add(c => c.DrawerName, "NOTES"), value: "note", selection: new[] { 0, 4 });
        await cut.Find("button[data-tool=drawer]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript(":NOTES:\nnote\n:END:") + "\"", LastApplied());
    }

    [Fact]
    public async Task Contact_Makes_An_Org_Contacts_Entry_From_The_Selected_Name()
    {
        var cut = Render(null, value: "Ada Lovelace", selection: new[] { 0, 12 });
        await cut.Find("button[data-tool=contact]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("* Ada Lovelace\n:PROPERTIES:\n:EMAIL: \n:PHONE: \n:ADDRESS: \n:BIRTHDAY: \n:END:") + "\"", LastApplied());
    }

    [Fact]
    public async Task The_Contact_Properties_Are_An_Option()
    {
        var cut = Render(p => p.Add(c => c.ContactProperties, new[] { "NICKNAME" }), value: "Ada", selection: new[] { 0, 3 });
        await cut.Find("button[data-tool=contact]").ClickAsync(new MouseEventArgs());
        Assert.Contains("\"" + EscapeForScript("* Ada\n:PROPERTIES:\n:NICKNAME: \n:END:") + "\"", LastApplied());
    }

    [Fact]
    public async Task A_Tool_With_Nothing_To_Do_Leaves_The_Text_Alone()
    {
        var cut = Render(null, value: "plain", selection: new[] { 0, 0 });
        await cut.Find("button[data-tool=scheduled]").ClickAsync(new MouseEventArgs());
        Assert.Null(LastApplied()); // nothing to do: the browser is not asked to change anything
    }

    [Fact]
    public async Task A_tool_that_changed_the_text_reports_the_value_and_one_with_nothing_to_do_does_not()
    {
        var reported = new List<string>();
        var cut = Render(p => p.Add(c => c.ValueChanged, EventCallback.Factory.Create<string>(this, v => reported.Add(v))), value: "plain", selection: new[] { 0, 0 });
        await cut.Find("button[data-tool=scheduled]").ClickAsync(new MouseEventArgs());
        Assert.Empty(reported);
        Assert.Null(LastApplied());
        await cut.Find("button[data-tool=bold]").ClickAsync(new MouseEventArgs());
        Assert.Equal("**plain", reported.Last());
    }

    [Fact]
    public async Task The_apply_script_asks_the_browser_to_keep_native_undo()
    {
        var cut = Render();
        await cut.Find("button[data-tool=italic]").ClickAsync(new MouseEventArgs());
        Assert.Contains("execCommand('insertText'", LastApplied());
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
    public async Task Without_Today_the_date_is_the_local_date()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.Setup<int[]?>("eval", s => ((string?)s.Arguments[0])!.Contains("selectionStart")).SetResult(new[] { 0, 0 });
        var cut = RenderComponent<OrgEditor>(p => p.Add(c => c.Label, "N").Add(c => c.ToolbarLabel, "F").Add(c => c.Labels, AllLabels).Add(c => c.Value, "x"));
        await cut.Find("button[data-tool=timestamp]").ClickAsync(new MouseEventArgs());
        Assert.Matches(@"<\d{4}-\d{2}-\d{2} (Sun|Mon|Tue|Wed|Thu|Fri|Sat)>x", LastApplied()!.Replace("\\u003C", "<").Replace("\\u003E", ">"));
    }

    [Fact]
    public async Task The_script_text_is_escaped_as_a_JavaScript_string()
    {
        var cut = Render(value: "say \"hi\"\n</script>", selection: new[] { 0, 0 });
        await cut.Find("button[data-tool=quote]").ClickAsync(new MouseEventArgs());
        var script = LastApplied()!;
        Assert.Contains("\\u0022hi\\u0022", script);
        Assert.DoesNotContain("</script>", script);
    }

    // ---- keyboard ----

    [Fact]
    public async Task Arrows_move_the_tab_stop_clamping_at_the_ends_and_Home_End_jump()
    {
        var cut = Render();
        string Stop() => cut.FindAll("button").Single(b => b.GetAttribute("tabindex") == "0").GetAttribute("data-tool")!;
        var last = cut.FindAll("button").Count - 1;
        await cut.FindAll("button")[0].KeyDownAsync(new KeyboardEventArgs { Key = "ArrowRight" });
        Assert.Equal("promote", Stop());
        await cut.FindAll("button")[1].KeyDownAsync(new KeyboardEventArgs { Key = "ArrowLeft" });
        await cut.FindAll("button")[0].KeyDownAsync(new KeyboardEventArgs { Key = "ArrowLeft" });
        Assert.Equal("heading", Stop());
        await cut.FindAll("button")[0].KeyDownAsync(new KeyboardEventArgs { Key = "End" });
        Assert.Equal("contact", Stop());
        await cut.FindAll("button")[last].KeyDownAsync(new KeyboardEventArgs { Key = "Home" });
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
        Assert.Equal(OrgFormat.ToolIds.Count, cut.FindAll("[data-icon]").Count);
    }
}
