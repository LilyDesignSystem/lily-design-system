using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class BarcodeImageTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<BarcodeImage>(p => p
            .Add(x => x.Src, "https://example.com/barcode-image.png")
            .Add(x => x.Alt, "Order 123"));
        var root = cut.Find(".barcode-image");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<BarcodeImage>(p => p
            .Add(x => x.Src, "https://example.com/barcode-image.png")
            .Add(x => x.Alt, "Order 123")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".barcode-image");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<BarcodeImage>(p => p
            .Add(x => x.Src, "https://example.com/barcode-image.png")
            .Add(x => x.Alt, "Order 123")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".barcode-image");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Src_and_Alt_are_set_on_img()
    {
        var cut = RenderComponent<BarcodeImage>(p => p
            .Add(x => x.Src, "https://example.com/barcode-image.png")
            .Add(x => x.Alt, "Order 123"));
        var root = cut.Find(".barcode-image");
        Assert.Equal("https://example.com/barcode-image.png", root.GetAttribute("src"));
        Assert.Equal("Order 123", root.GetAttribute("alt"));
    }
}
