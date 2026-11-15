using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class EmojiCharacterRadioInputTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<EmojiCharacterRadioInput>(p => { });
        var root = cut.Find(".emoji-character-radio-input");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<EmojiCharacterRadioInput>(p => p
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".emoji-character-radio-input");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<EmojiCharacterRadioInput>(p => p
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".emoji-character-radio-input");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Names_itself_with_aria_label()
    {
        var cut = RenderComponent<EmojiCharacterRadioInput>(p => p.Add(x => x.Label, "Name"));
        Assert.Equal("Name", cut.Find("input.emoji-character-radio-input").GetAttribute("aria-label"));
    }

    [Fact]
    public void Exposes_its_value_in_data_value()
    {
        var cut = RenderComponent<EmojiCharacterRadioInput>(p => p.Add(x => x.Label, "A").Add(x => x.Value, "😀"));
        var root = cut.Find("input.emoji-character-radio-input");
        Assert.Equal("😀", root.GetAttribute("value"));
        Assert.Equal("😀", root.GetAttribute("data-value"));
    }
}
