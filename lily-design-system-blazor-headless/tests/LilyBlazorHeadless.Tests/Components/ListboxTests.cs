using System.Collections.Generic;
using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ListboxTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".listbox");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".listbox");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".listbox");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void BaseCssClass_replaces_the_default_class_token_outright()
    {
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .Add(x => x.BaseCssClass, "theme-picker-list"));
        var root = cut.Find("ul");
        Assert.Equal("theme-picker-list", root.GetAttribute("class"));
    }

    [Fact]
    public void Default_navigation_is_inert_no_tabindex_or_activedescendant()
    {
        var cut = RenderComponent<Listbox>(p => p.AddChildContent("body"));
        var root = cut.Find(".listbox");
        Assert.Null(root.GetAttribute("tabindex"));
        Assert.Null(root.GetAttribute("aria-activedescendant"));
    }

    [Fact]
    public void ActiveDescendant_mode_sets_tabindex_and_aria_activedescendant()
    {
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .Add(x => x.Navigation, Listbox.ActiveDescendant)
            .Add(x => x.OptionCount, 3)
            .Add(x => x.OptionId, (int i) => $"opt-{i}")
            .Add(x => x.ActiveIndex, 1));
        var root = cut.Find(".listbox");
        Assert.Equal("-1", root.GetAttribute("tabindex"));
        Assert.Equal("opt-1", root.GetAttribute("aria-activedescendant"));
    }

    [Fact]
    public void ArrowDown_clamps_at_the_last_option_when_Clamp_is_set()
    {
        // Already at the last option: clamping keeps it there, so
        // SetActiveIndexAsync's own idempotence guard means
        // ActiveIndexChanged legitimately never fires — assert via the
        // component's own ActiveIndex property (still 2, not wrapped to 0),
        // not the changed callback.
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .Add(x => x.Navigation, Listbox.ActiveDescendant)
            .Add(x => x.Clamp, true)
            .Add(x => x.OptionCount, 3)
            .Add(x => x.OptionId, (int i) => $"opt-{i}")
            .Add(x => x.ActiveIndex, 2));
        cut.Find(".listbox").KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
        Assert.Equal(2, cut.Instance.ActiveIndex);
        Assert.Equal("opt-2", cut.Find(".listbox").GetAttribute("aria-activedescendant"));
    }

    [Fact]
    public void ArrowDown_wraps_when_Clamp_is_not_set()
    {
        var newIndex = -2;
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .Add(x => x.Navigation, Listbox.ActiveDescendant)
            .Add(x => x.OptionCount, 3)
            .Add(x => x.OptionId, (int i) => $"opt-{i}")
            .Add(x => x.ActiveIndex, 2)
            .Add(x => x.ActiveIndexChanged, EventCallback.Factory.Create<int>(this, i => newIndex = i)));
        cut.Find(".listbox").KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
        Assert.Equal(0, newIndex);
    }

    [Fact]
    public void Home_and_End_jump_to_the_first_and_last_option()
    {
        var indices = new List<int>();
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .Add(x => x.Navigation, Listbox.ActiveDescendant)
            .Add(x => x.OptionCount, 3)
            .Add(x => x.OptionId, (int i) => $"opt-{i}")
            .Add(x => x.ActiveIndex, 1)
            .Add(x => x.ActiveIndexChanged, EventCallback.Factory.Create<int>(this, i => indices.Add(i))));
        cut.Find(".listbox").KeyDown(new KeyboardEventArgs { Key = "End" });
        cut.Find(".listbox").KeyDown(new KeyboardEventArgs { Key = "Home" });
        Assert.Equal(new[] { 2, 0 }, indices);
    }

    [Fact]
    public void Enter_invokes_OnActivate_with_the_active_index()
    {
        var activated = -1;
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .Add(x => x.Navigation, Listbox.ActiveDescendant)
            .Add(x => x.OptionCount, 3)
            .Add(x => x.ActiveIndex, 1)
            .Add(x => x.OnActivate, EventCallback.Factory.Create<int>(this, i => activated = i)));
        cut.Find(".listbox").KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Equal(1, activated);
    }

    [Fact]
    public void Escape_invokes_OnEscape()
    {
        var escaped = false;
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .Add(x => x.Navigation, Listbox.ActiveDescendant)
            .Add(x => x.OnEscape, EventCallback.Factory.Create(this, () => escaped = true)));
        cut.Find(".listbox").KeyDown(new KeyboardEventArgs { Key = "Escape" });
        Assert.True(escaped);
    }

    [Fact]
    public void Tab_invokes_OnTabOut()
    {
        var tabbed = false;
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .Add(x => x.Navigation, Listbox.ActiveDescendant)
            .Add(x => x.OnTabOut, EventCallback.Factory.Create(this, () => tabbed = true)));
        cut.Find(".listbox").KeyDown(new KeyboardEventArgs { Key = "Tab" });
        Assert.True(tabbed);
    }

    [Fact]
    public void Typeahead_moves_to_the_next_option_starting_with_the_typed_character_only_when_enabled()
    {
        var newIndex = -2;
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .Add(x => x.Navigation, Listbox.ActiveDescendant)
            .Add(x => x.Typeahead, true)
            .Add(x => x.OptionCount, 2)
            .Add(x => x.OptionLabel, (int i) => i == 0 ? "Apple" : "Banana")
            .Add(x => x.ActiveIndex, 0)
            .Add(x => x.ActiveIndexChanged, EventCallback.Factory.Create<int>(this, i => newIndex = i)));
        cut.Find(".listbox").KeyDown(new KeyboardEventArgs { Key = "b" });
        Assert.Equal(1, newIndex);
    }

    [Fact]
    public void Typeahead_is_ignored_when_not_enabled()
    {
        var fired = false;
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .Add(x => x.Navigation, Listbox.ActiveDescendant)
            .Add(x => x.OptionCount, 2)
            .Add(x => x.OptionLabel, (int i) => i == 0 ? "Apple" : "Banana")
            .Add(x => x.ActiveIndex, 0)
            .Add(x => x.ActiveIndexChanged, EventCallback.Factory.Create<int>(this, _ => fired = true)));
        cut.Find(".listbox").KeyDown(new KeyboardEventArgs { Key = "b" });
        Assert.False(fired);
    }

    [Fact]
    public void PageDown_moves_by_PageSize_clamped()
    {
        var newIndex = -2;
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .Add(x => x.Navigation, Listbox.ActiveDescendant)
            .Add(x => x.Clamp, true)
            .Add(x => x.PageSize, 1)
            .Add(x => x.OptionCount, 3)
            .Add(x => x.ActiveIndex, 0)
            .Add(x => x.ActiveIndexChanged, EventCallback.Factory.Create<int>(this, i => newIndex = i)));
        cut.Find(".listbox").KeyDown(new KeyboardEventArgs { Key = "PageDown" });
        Assert.Equal(1, newIndex);
    }

    [Fact]
    public void Element_exposes_the_rendered_root_for_FocusAsync()
    {
        var cut = RenderComponent<Listbox>(p => p.AddChildContent("body"));
        Assert.False(string.IsNullOrEmpty(cut.Instance.Element.Id));
    }
}
