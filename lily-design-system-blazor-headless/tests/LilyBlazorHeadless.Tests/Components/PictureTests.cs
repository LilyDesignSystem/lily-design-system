using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class PictureTests : TestContext
{
    private const string Parts = "<source srcset=\"wide.webp\" media=\"(min-width: 800px)\" type=\"image/webp\"><img src=\"small.jpg\" alt=\"A lily\" width=\"320\" height=\"200\">";

    private IRenderedComponent<Picture> Render(Action<Bunit.ComponentParameterCollectionBuilder<Picture>>? extra = null) =>
        RenderComponent<Picture>(p => { p.AddChildContent(Parts); extra?.Invoke(p); });

    [Fact] public void Renders_picture_with_base_class() => Assert.NotNull(Render().Find("picture.picture"));

    [Fact] public void Consumer_class_follows_base_class() =>
        Assert.Equal("picture mine", Render(p => p.Add(x => x.CssClass, "mine")).Find(".picture").GetAttribute("class"));

    [Fact] public void Renders_source_and_img_keeping_the_consumers_alt()
    {
        var cut = Render();
        Assert.Equal("(min-width: 800px)", cut.Find("picture source").GetAttribute("media"));
        Assert.Equal("A lily", cut.Find("picture img").GetAttribute("alt"));
    }

    [Fact] public void Adds_no_text_of_its_own() =>
        Assert.Equal("", RenderComponent<Picture>().Find(".picture").TextContent);

    [Fact] public void Spreads_rest_props() => Assert.Equal("x1", Render(p => p.AddUnmatched("id", "x1")).Find(".picture").Id);
}
