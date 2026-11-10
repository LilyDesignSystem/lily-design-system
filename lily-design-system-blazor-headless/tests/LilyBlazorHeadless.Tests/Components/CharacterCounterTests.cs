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
        Assert.Equal("42 / 100", root.QuerySelector(".character-counter-text")!.TextContent);
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
        Assert.Equal("3 de 10", root.QuerySelector(".character-counter-text")!.TextContent);
        Assert.Equal("3 de 10", root.QuerySelector(".character-counter-status")!.TextContent);
    }

    [Fact]
    public void The_visible_count_is_hidden_and_the_status_is_named_and_not_on_the_root()
    {
        var root = RenderComponent<CharacterCounter>(p => p.Add(x => x.Count, 1).Add(x => x.Label, "Used")).Find(".character-counter");
        Assert.False(root.HasAttribute("role"));
        Assert.False(root.HasAttribute("aria-live"));
        Assert.Equal("true", root.QuerySelector(".character-counter-text")!.GetAttribute("aria-hidden"));
        var status = root.QuerySelector(".character-counter-status")!;
        Assert.Equal("status", status.GetAttribute("role"));
        Assert.Equal("Used", status.GetAttribute("aria-label"));
        Assert.Contains("screen-reader-span", status.ClassName);
    }

    [Fact]
    public void A_run_of_changes_is_announced_once_after_the_pause()
    {
        var cut = RenderComponent<CharacterCounter>(p => p.Add(x => x.Count, 0).Add(x => x.Max, 10).Add(x => x.AnnounceDelay, 200));
        foreach (var count in new[] { 1, 2, 3 })
            cut.SetParametersAndRender(p => p.Add(x => x.Count, count));
        Assert.Equal("3 / 10", cut.Find(".character-counter-text").TextContent);
        Assert.Equal("0 / 10", cut.Find(".character-counter-status").TextContent);
        cut.WaitForAssertion(() => Assert.Equal("3 / 10", cut.Find(".character-counter-status").TextContent), TimeSpan.FromSeconds(2));
    }
}
