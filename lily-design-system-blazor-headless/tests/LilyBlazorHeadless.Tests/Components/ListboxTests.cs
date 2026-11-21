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

    [Fact]
    public void ArrowUp_PageUp_and_PageDown_move_by_one_and_by_a_page()
    {
        var indices = new List<int>();
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .Add(x => x.Navigation, Listbox.ActiveDescendant)
            .Add(x => x.Clamp, true)
            .Add(x => x.OptionCount, 6)
            .Add(x => x.PageSize, 2)
            .Add(x => x.OptionId, (int i) => $"opt-{i}")
            .Add(x => x.ActiveIndex, 3)
            .Add(x => x.ActiveIndexChanged, EventCallback.Factory.Create<int>(this, i => indices.Add(i))));
        var box = cut.Find(".listbox");
        box.KeyDown(new KeyboardEventArgs { Key = "ArrowUp" });
        cut.SetParametersAndRender(p => p.Add(x => x.ActiveIndex, indices[^1]));
        cut.Find(".listbox").KeyDown(new KeyboardEventArgs { Key = "PageDown" });
        cut.SetParametersAndRender(p => p.Add(x => x.ActiveIndex, indices[^1]));
        cut.Find(".listbox").KeyDown(new KeyboardEventArgs { Key = "PageUp" });
        Assert.Equal(new[] { 2, 4, 2 }, indices);
    }

    [Fact]
    public void Typeahead_with_no_match_leaves_the_active_option()
    {
        var changes = 0;
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .Add(x => x.Navigation, Listbox.ActiveDescendant)
            .Add(x => x.Typeahead, true)
            .Add(x => x.OptionCount, 2)
            .Add(x => x.OptionLabel, (int i) => i == 0 ? "Apple" : "Banana")
            .Add(x => x.ActiveIndex, 0)
            .Add(x => x.ActiveIndexChanged, EventCallback.Factory.Create<int>(this, _ => changes++)));
        cut.Find(".listbox").KeyDown(new KeyboardEventArgs { Key = "z" });
        Assert.Equal(0, changes);
    }

    // Option groups (tasks.md P40-T4): the groups are the consumer's markup; the listbox counts options by index across
    // them, so the arrows cross from one group to the next and type-ahead searches every group.
    private const string GroupedMarkup =
        "<div role=\"group\" aria-labelledby=\"g-common\"><div role=\"presentation\" id=\"g-common\">Common</div>" +
        "<div role=\"option\" id=\"o-0\">Apple</div><div role=\"option\" id=\"o-1\">Avocado</div></div>" +
        "<div role=\"group\" aria-labelledby=\"g-lab\"><div role=\"presentation\" id=\"g-lab\">Lab</div>" +
        "<div role=\"option\" id=\"o-2\">Banana</div><div role=\"option\" id=\"o-3\">Cherry</div></div>";
    private static readonly string[] GroupedLabels = { "Apple", "Avocado", "Banana", "Cherry" };

    [Fact]
    public void Option_groups_ArrowDown_crosses_into_the_next_group()
    {
        var newIndex = -2;
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent(GroupedMarkup)
            .Add(x => x.Navigation, Listbox.ActiveDescendant)
            .Add(x => x.OptionCount, 4)
            .Add(x => x.OptionId, (int i) => $"o-{i}")
            .Add(x => x.ActiveIndex, 1)
            .Add(x => x.ActiveIndexChanged, EventCallback.Factory.Create<int>(this, i => newIndex = i)));
        Assert.Equal(2, cut.FindAll("[role='group']").Count);
        Assert.Equal(4, cut.FindAll("[role='option']").Count);
        Assert.Equal("o-1", cut.Find(".listbox").GetAttribute("aria-activedescendant"));
        cut.Find(".listbox").KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
        Assert.Equal(2, newIndex);
    }

    [Fact]
    public void Option_groups_typeahead_searches_every_group()
    {
        var newIndex = -2;
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent(GroupedMarkup)
            .Add(x => x.Navigation, Listbox.ActiveDescendant)
            .Add(x => x.Typeahead, true)
            .Add(x => x.OptionCount, 4)
            .Add(x => x.OptionLabel, (int i) => GroupedLabels[i])
            .Add(x => x.ActiveIndex, 0)
            .Add(x => x.ActiveIndexChanged, EventCallback.Factory.Create<int>(this, i => newIndex = i)));
        cut.Find(".listbox").KeyDown(new KeyboardEventArgs { Key = "c" });
        Assert.Equal(3, newIndex);
    }

    private static readonly string[] Fruit = { "Apple", "Banana", "Blueberry", "Cherry" };

    private (IRenderedComponent<Listbox> cut, List<int> moves) Typeahead(int active = 0, int count = 4)
    {
        var moves = new List<int>();
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .Add(x => x.Navigation, Listbox.ActiveDescendant)
            .Add(x => x.Typeahead, true)
            .Add(x => x.OptionCount, count)
            .Add(x => x.OptionLabel, (int i) => Fruit[i])
            .Add(x => x.ActiveIndex, active)
            .Add(x => x.ActiveIndexChanged, EventCallback.Factory.Create<int>(this, i => moves.Add(i))));
        return (cut, moves);
    }

    [Fact]
    public void Typeahead_repeating_one_letter_cycles_through_the_options_that_start_with_it()
    {
        var (cut, moves) = Typeahead();
        var root = cut.Find(".listbox");
        root.KeyDown(new KeyboardEventArgs { Key = "b" });
        root.KeyDown(new KeyboardEventArgs { Key = "b" });
        root.KeyDown(new KeyboardEventArgs { Key = "b" });
        Assert.Equal(new[] { 1, 2, 1 }, moves);
    }

    [Fact]
    public void Typeahead_a_longer_prefix_finds_the_option_it_starts()
    {
        var (cut, moves) = Typeahead();
        var root = cut.Find(".listbox");
        root.KeyDown(new KeyboardEventArgs { Key = "b" });
        root.KeyDown(new KeyboardEventArgs { Key = "l" });
        Assert.Equal(new[] { 1, 2 }, moves);
    }

    [Fact]
    public void With_no_options_the_keys_and_typeahead_move_nothing()
    {
        var (cut, moves) = Typeahead(active: -1, count: 0);
        var root = cut.Find(".listbox");
        foreach (var key in new[] { "ArrowDown", "ArrowUp", "Home", "a" })
            root.KeyDown(new KeyboardEventArgs { Key = key });
        Assert.Empty(moves);
        Assert.Equal(-1, cut.Instance.ActiveIndex);
    }

    [Fact]
    public void In_roving_focus_mode_the_component_leaves_the_keys_to_the_options()
    {
        var moves = new List<int>();
        var cut = RenderComponent<Listbox>(p => p
            .AddChildContent("body")
            .Add(x => x.OptionCount, 3)
            .Add(x => x.ActiveIndex, 0)
            .Add(x => x.ActiveIndexChanged, EventCallback.Factory.Create<int>(this, i => moves.Add(i))));
        cut.Find(".listbox").KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
        Assert.Empty(moves);
    }
}
