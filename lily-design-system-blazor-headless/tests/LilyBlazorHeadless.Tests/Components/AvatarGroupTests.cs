using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class AvatarGroupTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<AvatarGroup>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".avatar-group");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<AvatarGroup>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".avatar-group");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<AvatarGroup>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".avatar-group");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Says_how_many_avatars_it_does_not_show_last()
    {
        var cut = RenderComponent<AvatarGroup>(p => p.Add(x => x.Label, "Care team").Add(x => x.OverflowLabel, "and 12 more").AddChildContent("<span>A</span>"));
        var el = cut.Find(".avatar-group");
        Assert.Equal("avatar-group-overflow", el.LastElementChild?.ClassName);
        Assert.Equal("and 12 more", el.LastElementChild?.TextContent);
    }
}
