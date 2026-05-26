using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class BulgariaEdinenGrazhdanskiNomerViewTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<BulgariaEdinenGrazhdanskiNomerView>(p => p.Add(x => x.Label, "Label"));
        var root = cut.Find(".bulgaria-edinen-grazhdanski-nomer-view");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<BulgariaEdinenGrazhdanskiNomerView>(p => p
            .Add(x => x.Label, "Label")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".bulgaria-edinen-grazhdanski-nomer-view");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<BulgariaEdinenGrazhdanskiNomerView>(p => p
            .Add(x => x.Label, "Label")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".bulgaria-edinen-grazhdanski-nomer-view");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }
}
