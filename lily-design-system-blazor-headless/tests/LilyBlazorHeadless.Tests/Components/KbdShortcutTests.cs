using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class KbdShortcutTests : TestContext
{
    private IRenderedComponent<KbdShortcut> Render(string[] keys, Action<ComponentParameterCollectionBuilder<KbdShortcut>>? extra = null)
        => RenderComponent<KbdShortcut>(p =>
        {
            p.Add(x => x.Keys, keys);
            extra?.Invoke(p);
        });

    [Fact]
    public void Root_is_a_kbd_with_the_kbd_shortcut_class()
    {
        var root = Render(new[] { "Ctrl", "K" }).Find(".kbd-shortcut");
        Assert.Equal("KBD", root.TagName);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
        => Assert.Equal("kbd-shortcut extra", Render(new[] { "K" }, p => p.Add(x => x.CssClass, "extra")).Find("kbd").GetAttribute("class"));

    [Fact]
    public void Renders_one_inner_kbd_per_key_in_order()
    {
        var keys = Render(new[] { "Ctrl", "Shift", "K" }).FindAll(".kbd-shortcut-key");
        Assert.Equal(new[] { "Ctrl", "Shift", "K" }, keys.Select(k => k.TextContent).ToArray());
        Assert.All(keys, k => Assert.Equal("KBD", k.TagName));
    }

    [Fact]
    public void Separators_go_between_keys_only_default_plus()
    {
        var seps = Render(new[] { "Ctrl", "Shift", "K" }).FindAll(".kbd-shortcut-separator");
        Assert.Equal(2, seps.Count);
        Assert.All(seps, s => Assert.Equal("+", s.TextContent));
    }

    [Fact]
    public void Separator_is_configurable()
    {
        var seps = Render(new[] { "G", "H" }, p => p.Add(x => x.Separator, "then")).FindAll(".kbd-shortcut-separator");
        Assert.Equal("then", seps.Single().TextContent);
    }

    [Fact]
    public void Separators_are_aria_hidden()
        => Assert.All(Render(new[] { "Ctrl", "K" }).FindAll(".kbd-shortcut-separator"), s => Assert.Equal("true", s.GetAttribute("aria-hidden")));

    [Fact]
    public void Single_key_renders_no_separator()
        => Assert.Empty(Render(new[] { "Esc" }).FindAll(".kbd-shortcut-separator"));

    [Fact]
    public void Label_becomes_aria_label_and_is_absent_otherwise()
    {
        Assert.Equal("Control K", Render(new[] { "Ctrl", "K" }, p => p.Add(x => x.Label, "Control K")).Find(".kbd-shortcut").GetAttribute("aria-label"));
        Assert.Null(Render(new[] { "Ctrl", "K" }).Find(".kbd-shortcut").GetAttribute("aria-label"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
        => Assert.Equal("value", Render(new[] { "K" }, p => p.AddUnmatched("data-test", "value")).Find(".kbd-shortcut").GetAttribute("data-test"));
}
