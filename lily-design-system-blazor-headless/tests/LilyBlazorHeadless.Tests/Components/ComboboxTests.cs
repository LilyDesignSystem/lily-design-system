using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ComboboxTests : TestContext
{
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
    public void Listbox_is_absent_when_closed_and_present_when_open()
    {
        var closed = RenderComponent<Combobox>(p => p
            .Add(x => x.Open, false)
            .AddChildContent("<div role=\"option\">A</div>"));
        Assert.Empty(closed.FindAll("[role=listbox]"));

        var open = RenderComponent<Combobox>(p => p
            .Add(x => x.Open, true)
            .AddChildContent("<div role=\"option\">A</div>"));
        var listbox = open.Find("[role=listbox]");
        Assert.NotNull(listbox);
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
}
