using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// The keys' default actions are cancelled in Autosuggest.razor.js (bUnit runs no JavaScript);
// tests/js/autosuggest.test.mjs tests it. The key logic is C# and tested here.
public class AutosuggestTests : TestContext
{
    private static readonly AutosuggestSuggestion[] Fruit =
    [
        new("apple", "Apple"),
        new("apricot", "Apricot"),
        new("avocado", "Avocado"),
    ];

    private readonly List<string> _selected = [];
    private readonly List<string> _typed = [];

    public AutosuggestTests()
    {
        var module = JSInterop.SetupModule(Autosuggest.ModulePath);
        module.SetupModule("attach", _ => true);
    }

    private IRenderedComponent<Autosuggest> Render(IReadOnlyList<AutosuggestSuggestion>? suggestions = null, string value = "") =>
        RenderComponent<Autosuggest>(p => p
            .Add(x => x.Label, "Fruit")
            .Add(x => x.Value, value)
            .Add(x => x.Suggestions, suggestions ?? Fruit)
            .Add(x => x.OnSelect, (string v) => _selected.Add(v))
            .Add(x => x.OnInput, (string v) => _typed.Add(v)));

    private static void Press(IRenderedComponent<Autosuggest> cut, string key) =>
        cut.Find("input").KeyDown(new KeyboardEventArgs { Key = key });

    private static int Active(IRenderedComponent<Autosuggest> cut)
    {
        var id = cut.Find("input").GetAttribute("aria-activedescendant");
        var options = cut.FindAll("[role=option]");
        for (var i = 0; i < options.Count; i++) if (options[i].Id == id) return i;
        return -1;
    }

    private static string? Expanded(IRenderedComponent<Autosuggest> cut) => cut.Find("input").GetAttribute("aria-expanded");

    [Fact]
    public void Renders_a_div_root_with_an_input_combobox_and_a_hidden_listbox()
    {
        var cut = RenderComponent<Autosuggest>(p => p
            .Add(x => x.Label, "Fruit")
            .Add(x => x.CssClass, "extra")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find("div.autosuggest");
        Assert.Contains("extra", root.GetAttribute("class"));
        Assert.Equal("value", root.GetAttribute("data-test"));
        var input = cut.Find("input");
        Assert.Equal("combobox", input.GetAttribute("role"));
        Assert.Equal("Fruit", input.GetAttribute("aria-label"));
        Assert.Equal("list", input.GetAttribute("aria-autocomplete"));
        Assert.Equal("false", input.GetAttribute("aria-expanded"));
        var list = cut.Find("[role=listbox]");
        Assert.Equal(list.Id, input.GetAttribute("aria-controls"));
        Assert.True(list.HasAttribute("hidden"));
    }

    [Fact]
    public void Typing_reports_the_query_and_opens_the_list()
    {
        var cut = Render();
        cut.Find("input").Input("ap");
        Assert.Equal(["ap"], _typed);
        Assert.Equal("true", Expanded(cut));
        Assert.False(cut.Find("[role=listbox]").HasAttribute("hidden"));
        var empty = Render([]);
        empty.Find("input").Input("zz");
        Assert.Equal("false", Expanded(empty));
    }

    [Fact]
    public void Arrow_keys_move_the_highlight_wrapping()
    {
        var cut = Render();
        Press(cut, "ArrowDown");
        Assert.Equal("true", Expanded(cut));
        Assert.Equal(0, Active(cut));
        Assert.Equal("true", cut.FindAll("[role=option]")[0].GetAttribute("aria-selected"));
        Press(cut, "ArrowDown");
        Assert.Equal(1, Active(cut));
        Press(cut, "ArrowUp");
        Press(cut, "ArrowUp");
        Assert.Equal(2, Active(cut));
        Press(cut, "ArrowDown");
        Assert.Equal(0, Active(cut));
    }

    [Fact]
    public void Home_and_End_jump_to_the_first_and_last_option()
    {
        var cut = Render();
        Press(cut, "ArrowDown");
        Press(cut, "End");
        Assert.Equal(2, Active(cut));
        Press(cut, "Home");
        Assert.Equal(0, Active(cut));
    }

    [Fact]
    public void Enter_chooses_the_highlighted_option_fills_the_input_and_closes()
    {
        var cut = Render();
        Press(cut, "ArrowDown");
        Press(cut, "ArrowDown");
        Press(cut, "Enter");
        Assert.Equal(["apricot"], _selected);
        Assert.Equal("apricot", cut.Find("input").GetAttribute("value"));
        Assert.Equal("false", Expanded(cut));
        Assert.False(cut.Find("input").HasAttribute("aria-activedescendant"));
    }

    [Fact]
    public void Escape_closes_without_choosing()
    {
        var cut = Render(value: "ap");
        Press(cut, "ArrowDown");
        Press(cut, "Escape");
        Assert.Equal("false", Expanded(cut));
        Assert.Empty(_selected);
        Assert.Equal("ap", cut.Find("input").GetAttribute("value"));
    }

    [Fact]
    public void Clicking_an_option_chooses_it_and_blur_closes_the_list()
    {
        var cut = Render();
        cut.Find("input").Input("a");
        cut.FindAll("[role=option]")[2].Click();
        Assert.Equal(["avocado"], _selected);
        cut.Find("input").Input("av");
        cut.Find("input").Blur();
        Assert.Equal("false", Expanded(cut));
    }
}
