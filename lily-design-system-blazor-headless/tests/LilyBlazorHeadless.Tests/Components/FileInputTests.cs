using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class FileInputTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<FileInput>(p => { });
        var root = cut.Find(".file-input");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<FileInput>(p => p
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".file-input");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<FileInput>(p => p
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".file-input");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }
}
