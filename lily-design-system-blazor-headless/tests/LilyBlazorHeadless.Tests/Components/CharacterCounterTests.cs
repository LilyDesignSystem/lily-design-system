using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class CharacterCounterTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<CharacterCounter>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".character-counter");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<CharacterCounter>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".character-counter");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<CharacterCounter>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".character-counter");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Shows_the_numbers_alone_and_renders_the_count_state_as_Svelte_does()
    {
        var root = RenderComponent<CharacterCounter>(p => p.Add(x => x.Count, 42).Add(x => x.Max, 100)).Find(".character-counter");
        Assert.Equal("42 / 100", root.TextContent.Trim());
        Assert.Equal("42", root.GetAttribute("data-count"));
        Assert.Equal("100", root.GetAttribute("data-max"));
        Assert.Equal("58", root.GetAttribute("data-remaining"));
        Assert.False(root.HasAttribute("data-over-limit"));
    }

    [Fact]
    public void Marks_data_over_limit_past_the_maximum()
    {
        var root = RenderComponent<CharacterCounter>(p => p.Add(x => x.Count, 120).Add(x => x.Max, 100)).Find(".character-counter");
        Assert.True(root.HasAttribute("data-over-limit"));
        Assert.Equal("-20", root.GetAttribute("data-remaining"));
    }

    [Fact]
    public void The_consumers_words_replace_the_numbers()
    {
        var root = RenderComponent<CharacterCounter>(p => p.Add(x => x.Count, 3).Add(x => x.Max, 10).AddChildContent("3 de 10")).Find(".character-counter");
        Assert.Equal("3 de 10", root.TextContent.Trim());
    }
}
