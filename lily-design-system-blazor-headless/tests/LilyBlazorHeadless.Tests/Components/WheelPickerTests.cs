using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class WheelPickerTests : TestContext
{
    private static readonly WheelPickerOption[] Months =
    [
        new("1", "January"), new("2", "February"), new("3", "March"), new("4", "April", true), new("5", "May"),
    ];

    private IRenderedComponent<WheelPicker> Render(Action<ComponentParameterCollectionBuilder<WheelPicker>>? extra = null, string value = "2", List<string>? changes = null) =>
        RenderComponent<WheelPicker>(p =>
        {
            p.Add(x => x.Label, "Month").Add(x => x.Options, Months).Add(x => x.Value, value);
            p.Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => changes?.Add(v)));
            extra?.Invoke(p);
        });

    private static string? Selected(IRenderedComponent<WheelPicker> c) =>
        c.FindAll("[role=option]").FirstOrDefault(o => o.GetAttribute("aria-selected") == "true")?.TextContent;

    [Fact] public void Renders_div_with_base_class_first_then_consumer_class_and_a_vertical_listbox()
    {
        var c = Render(p => p.Add(x => x.CssClass, "mine"));
        Assert.Equal("wheel-picker mine", c.Find("div.wheel-picker").GetAttribute("class"));
        var list = c.Find(".wheel-picker-list");
        Assert.Equal("listbox", list.GetAttribute("role"));
        Assert.Equal("vertical", list.GetAttribute("aria-orientation"));
        Assert.Equal("Month", list.GetAttribute("aria-label"));
    }

    [Fact] public void Renders_one_option_per_entry_and_marks_only_the_selected_one()
    {
        var c = Render();
        Assert.Equal(5, c.FindAll("[role=option]").Count);
        Assert.Equal("February", Selected(c));
        Assert.Single(c.FindAll("[aria-selected=true]"));
    }

    [Fact] public void Points_aria_activedescendant_at_the_selected_option_and_is_focusable()
    {
        var c = Render();
        var list = c.Find(".wheel-picker-list");
        Assert.Equal("February", c.Find("#" + list.GetAttribute("aria-activedescendant")).TextContent);
        Assert.Equal("0", list.GetAttribute("tabindex"));
    }

    [Fact] public void Selects_nothing_and_has_no_activedescendant_for_an_unknown_value()
    {
        var c = Render(value: "");
        Assert.Null(Selected(c));
        Assert.Null(c.Find(".wheel-picker-list").GetAttribute("aria-activedescendant"));
    }

    [Fact] public void ArrowDown_selects_the_next_enabled_option_skipping_a_disabled_one_and_raises_ValueChanged_once()
    {
        var changes = new List<string>();
        var c = Render(value: "3", changes: changes);
        c.Find(".wheel-picker-list").KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
        Assert.Equal("May", Selected(c));
        Assert.Equal(["5"], changes);
    }

    [Fact] public void ArrowUp_Home_and_End_move_the_selection()
    {
        var c = Render();
        var list = c.Find(".wheel-picker-list");
        list.KeyDown(new KeyboardEventArgs { Key = "ArrowUp" });
        Assert.Equal("January", Selected(c));
        list.KeyDown(new KeyboardEventArgs { Key = "End" });
        Assert.Equal("May", Selected(c));
        list.KeyDown(new KeyboardEventArgs { Key = "Home" });
        Assert.Equal("January", Selected(c));
    }

    [Fact] public void Stops_at_the_ends_unless_Loop_is_set()
    {
        var plain = Render(value: "1");
        plain.Find(".wheel-picker-list").KeyDown(new KeyboardEventArgs { Key = "ArrowUp" });
        Assert.Equal("January", Selected(plain));
        var looped = Render(p => p.Add(x => x.Loop, true), value: "1");
        looped.Find(".wheel-picker-list").KeyDown(new KeyboardEventArgs { Key = "ArrowUp" });
        Assert.Equal("May", Selected(looped));
    }

    [Fact] public void PageDown_moves_by_PageSize()
    {
        var c = Render(p => p.Add(x => x.PageSize, 2), value: "1");
        c.Find(".wheel-picker-list").KeyDown(new KeyboardEventArgs { Key = "PageDown" });
        Assert.Equal("March", Selected(c));
    }

    [Fact] public void Type_ahead_selects_the_option_starting_with_the_typed_letter()
    {
        var c = Render(value: "1");
        c.Find(".wheel-picker-list").KeyDown(new KeyboardEventArgs { Key = "m" });
        Assert.Equal("March", Selected(c));
    }

    [Fact] public void Clicking_an_enabled_option_selects_it_and_a_disabled_one_does_nothing()
    {
        var changes = new List<string>();
        var c = Render(changes: changes);
        c.Find("[data-value='5']").Click();
        Assert.Equal("May", Selected(c));
        c.Find("[data-value='4']").Click();
        Assert.Equal("May", Selected(c));
        Assert.Equal(["5"], changes);
    }

    [Fact] public void Selecting_the_value_already_held_is_a_no_op()
    {
        var changes = new List<string>();
        var c = Render(value: "5", changes: changes);
        c.Find(".wheel-picker-list").KeyDown(new KeyboardEventArgs { Key = "End" });
        c.Find("[data-value='5']").Click();
        Assert.Empty(changes);
    }

    [Fact] public void Marks_disabled_options_with_aria_disabled()
    {
        var c = Render();
        Assert.Equal("true", c.Find("[data-value='4']").GetAttribute("aria-disabled"));
        Assert.Null(c.Find("[data-value='3']").GetAttribute("aria-disabled"));
    }

    [Fact] public void When_disabled_it_is_not_focusable_and_ignores_keys_and_clicks()
    {
        var changes = new List<string>();
        var c = Render(p => p.Add(x => x.Disabled, true), changes: changes);
        var list = c.Find(".wheel-picker-list");
        Assert.Equal("-1", list.GetAttribute("tabindex"));
        Assert.Equal("true", list.GetAttribute("aria-disabled"));
        list.KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
        c.Find("[data-value='5']").Click();
        Assert.Equal("February", Selected(c));
        Assert.Empty(changes);
    }

    [Fact] public void Renders_a_hidden_input_only_when_a_Name_is_given_carrying_the_value()
    {
        Assert.Empty(Render().FindAll("input"));
        var input = Render(p => p.Add(x => x.Name, "month")).Find("input[type=hidden]");
        Assert.Equal("month", input.GetAttribute("name"));
        Assert.Equal("2", input.GetAttribute("value"));
    }

    [Fact] public void Spreads_unmatched_attributes_on_the_root()
    {
        var el = Render(p => p.AddUnmatched("id", "c1").AddUnmatched("data-test", "x")).Find("div.wheel-picker");
        Assert.Equal("c1", el.Id);
        Assert.Equal("x", el.GetAttribute("data-test"));
    }

    [Fact] public void Keys_skip_disabled_options_and_match_the_shared_model()
    {
        Assert.Equal(4, WheelPickerKeys.NextIndex(Months, 2, "ArrowDown"));
        Assert.Equal(2, WheelPickerKeys.NextIndex(Months, 4, "ArrowUp"));
        Assert.Equal(-1, WheelPickerKeys.NextIndex([new WheelPickerOption("a", "a", true)], -1, "Home"));
        Assert.Equal(2, WheelPickerKeys.TypeaheadIndex(Months, 0, "Mar"));
        Assert.Equal(0, WheelPickerKeys.TypeaheadIndex([new WheelPickerOption("1", "École")], -1, "e"));
    }
}
