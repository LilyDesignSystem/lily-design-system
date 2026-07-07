using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ImageCropperTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<ImageCropper>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".image-cropper");
        Assert.NotNull(root);
    }

    [Fact]
    public void Renders_with_application_role()
    {
        var cut = RenderComponent<ImageCropper>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".image-cropper");
        Assert.Equal("application", root.GetAttribute("role"));
    }

    [Fact]
    public void AriaLabel_reflects_Label()
    {
        var cut = RenderComponent<ImageCropper>(p => p
            .AddChildContent("body")
            .Add(x => x.Label, "Crop avatar"));
        var root = cut.Find(".image-cropper");
        Assert.Equal("Crop avatar", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<ImageCropper>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".image-cropper");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<ImageCropper>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".image-cropper");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }
}
