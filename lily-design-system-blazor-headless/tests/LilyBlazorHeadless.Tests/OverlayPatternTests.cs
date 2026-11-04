using Bunit;
using LilyBlazorHeadless.Components;
using LilyDesignSystem.Blazor.Testing;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests;

public class OverlayPatternTests : TestContext
{
    private void Run<T>(string pattern, string hook) where T : IComponent
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        var cut = RenderComponent<T>(ComponentParameter.CreateParameter("Label", "Name"));
        PatternTester.Run(cut, pattern, hook, () =>
            cut.SetParametersAndRender(ComponentParameter.CreateParameter("Open", true)));
    }

    [Fact]
    public void Autosuggest_meets_the_autosuggest_contract()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        var suggestions = new[] { "Apple", "Banana", "Cherry" }.Select(s => new AutosuggestSuggestion(s, s)).ToArray();
        var cut = RenderComponent<Autosuggest>(p => p.Add(x => x.Label, "Fruit").Add(x => x.Suggestions, suggestions));
        PatternTester.Run(cut, "autosuggest", "autosuggest");
    }

    [Fact]
    public void TreeListItem_toggle_flips_and_reports_expanded()
    {
        bool? reported = null;
        var cut = RenderComponent<TreeListItem>(p => p
            .Add(x => x.Label, "Branch")
            .Add(x => x.Expanded, false)
            .Add(x => x.ExpandedChanged, (bool value) => reported = value));
        cut.Find("li").TriggerEvent("ontoggle", System.EventArgs.Empty);
        Assert.Equal("true", cut.Find("li").GetAttribute("aria-expanded"));
        Assert.True(reported);
    }

    [Fact]
    public void TreeListItem_leaf_has_no_aria_expanded()
    {
        var cut = RenderComponent<TreeListItem>(p => p.Add(x => x.Label, "Leaf"));
        Assert.False(cut.Find("li").HasAttribute("aria-expanded"));
    }

    [Fact] public void Combobox_meets_the_combobox_contract() => Run<Combobox>("combobox", "combobox");
    [Fact] public void Dialog_meets_the_dialog_contract() => Run<Dialog>("dialog", "dialog");
    [Fact] public void Drawer_meets_the_dialog_contract() => Run<Drawer>("dialog", "drawer");
    [Fact] public void FileDialog_meets_the_dialog_contract() => Run<FileDialog>("dialog", "file-dialog");
    [Fact] public void Sheet_meets_the_dialog_contract() => Run<Sheet>("dialog", "sheet");
    [Fact] public void SlideOutDrawer_meets_the_dialog_contract() => Run<SlideOutDrawer>("dialog", "slide-out-drawer");
}
