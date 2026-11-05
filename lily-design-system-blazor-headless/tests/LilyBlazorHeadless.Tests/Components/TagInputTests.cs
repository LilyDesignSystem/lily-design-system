using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TagInputTests : TestContext
{
    public TagInputTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<TagInput> Make(Action<ComponentParameterCollectionBuilder<TagInput>>? more = null) =>
        RenderComponent<TagInput>(p =>
        {
            p
            .Add(x => x.Label, "Tags");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.tag-input"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.tag-input").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.tag-input").GetAttribute("data-test"));

    [Fact]
    public void The_group_and_the_field_are_named()
    {
        var cut = Make();
        Assert.Equal("group", cut.Find("div").GetAttribute("role"));
        Assert.Equal("Tags", cut.Find("div").GetAttribute("aria-label"));
        Assert.Equal("Tags", cut.Find("input.tag-input-field").GetAttribute("aria-label"));
    }

    [Fact]
    public void ChildContent_holds_the_tags()
    {
        var cut = Make(p => p.AddChildContent("<span class=\"tag\">one</span>"));
        Assert.NotNull(cut.Find("div.tag-input > span.tag"));
    }

    [Fact]
    public void The_module_attaches_to_the_field()
    {
        Make();
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "import" && (string?)i.Arguments[0] == TagInput.ModulePath);
    }

    [Fact]
    public async Task Adding_passes_the_text_and_clears_the_field()
    {
        string? added = null, value = null;
        var cut = Make(p => p
            .Add(x => x.Value, "one")
            .Add(x => x.ValueChanged, (string v) => value = v)
            .Add(x => x.OnAdd, (string v) => added = v));
        await cut.InvokeAsync(() => cut.Instance.OnTagAdd("one"));
        Assert.Equal("one", added);
        Assert.Equal("", value);
        Assert.Equal("", cut.Find("input").GetAttribute("value") ?? "");
    }

    [Fact]
    public void Disabled_reaches_the_field() =>
        Assert.True(Make(p => p.Add(x => x.Disabled, true)).Find("input").HasAttribute("disabled"));
}
