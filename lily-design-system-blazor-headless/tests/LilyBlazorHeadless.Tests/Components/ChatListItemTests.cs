using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ChatListItemTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<ChatListItem>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".chat-list-item");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<ChatListItem>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".chat-list-item");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<ChatListItem>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".chat-list-item");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Current_sets_aria_current_only_when_true()
    {
        var plain = RenderComponent<ChatListItem>(p => p.AddChildContent("x"));
        Assert.False(plain.Find("li.chat-list-item").HasAttribute("aria-current"));
        var current = RenderComponent<ChatListItem>(p => p.Add(x => x.Current, true).AddChildContent("x"));
        Assert.Equal("true", current.Find("li.chat-list-item").GetAttribute("aria-current"));
    }
}
