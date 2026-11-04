using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ComboboxTests : TestContext
{
    public ComboboxTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Combobox>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".combobox");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Combobox>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".combobox");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Combobox>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".combobox");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Renders_a_real_text_input_with_combobox_role()
    {
        var cut = RenderComponent<Combobox>(p => p
            .Add(x => x.Label, "Search")
            .AddChildContent("body"));
        var input = cut.Find("input");
        Assert.Equal("combobox", input.GetAttribute("role"));
        Assert.Equal("Search", input.GetAttribute("aria-label"));
        Assert.Equal("list", input.GetAttribute("aria-autocomplete"));
    }

    [Fact]
    public void Input_value_reflects_the_Value_parameter()
    {
        var cut = RenderComponent<Combobox>(p => p
            .Add(x => x.Value, "car")
            .AddChildContent("body"));
        Assert.Equal("car", cut.Find("input").GetAttribute("value"));
    }

    [Fact]
    public void Typing_invokes_ValueChanged()
    {
        string? changed = null;
        var cut = RenderComponent<Combobox>(p => p
            .Add(x => x.Value, "")
            .Add(x => x.ValueChanged, v => changed = v)
            .AddChildContent("body"));
        cut.Find("input").Input("cardio");
        Assert.Equal("cardio", changed);
    }

    [Fact]
    public void Listbox_is_a_manual_popover_that_follows_the_Open_state()
    {
        var closed = RenderComponent<Combobox>(p => p
            .Add(x => x.Open, false)
            .AddChildContent("<div role=\"option\">A</div>"));
        Assert.Equal("manual", closed.Find("[role=listbox]").GetAttribute("popover"));
        Assert.Equal("false", closed.Find("input").GetAttribute("aria-expanded"));

        var open = RenderComponent<Combobox>(p => p
            .Add(x => x.Open, true)
            .AddChildContent("<div role=\"option\">A</div>"));
        Assert.Equal("manual", open.Find("[role=listbox]").GetAttribute("popover"));
        Assert.Equal("true", open.Find("input").GetAttribute("aria-expanded"));
    }

    [Fact]
    public void Input_aria_controls_references_the_listbox_id()
    {
        var cut = RenderComponent<Combobox>(p => p
            .Add(x => x.Open, true)
            .AddChildContent("body"));
        var input = cut.Find("input");
        var listbox = cut.Find("[role=listbox]");
        Assert.Equal(listbox.GetAttribute("id"), input.GetAttribute("aria-controls"));
    }

    [Fact]
    public void Escape_closes_the_dropdown_via_OpenChanged()
    {
        bool? changed = null;
        var cut = RenderComponent<Combobox>(p => p
            .Add(x => x.Open, true)
            .Add(x => x.OpenChanged, v => changed = v)
            .AddChildContent("body"));
        cut.Find("input").KeyDown(new KeyboardEventArgs { Key = "Escape" });
        Assert.False(changed);
    }

    [Fact]
    public async Task Module_opening_and_choosing_reach_the_parameters()
    {
        bool? opened = null;
        string? value = null;
        string? selected = null;
        var cut = RenderComponent<Combobox>(p => p
            .Add(x => x.Label, "Fruit")
            .Add(x => x.OpenChanged, v => opened = v)
            .Add(x => x.ValueChanged, v => value = v)
            .Add(x => x.OnSelect, v => selected = v)
            .AddChildContent("body"));
        await cut.InvokeAsync(() => cut.Instance.OnComboboxOpen(true));
        Assert.True(opened);
        Assert.Equal("true", cut.Find("input").GetAttribute("aria-expanded"));
        await cut.InvokeAsync(() => cut.Instance.OnComboboxChoose("Apple"));
        Assert.Equal("Apple", value);
        Assert.Equal("Apple", selected);
        Assert.Equal("Apple", cut.Find("input").GetAttribute("value"));
    }
}
