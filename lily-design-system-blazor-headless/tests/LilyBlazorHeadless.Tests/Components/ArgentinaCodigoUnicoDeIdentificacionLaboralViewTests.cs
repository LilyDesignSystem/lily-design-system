using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ArgentinaCodigoUnicoDeIdentificacionLaboralViewTests : TestContext
{
    [Fact]
    public void Renders_as_span_with_kebab_base_class()
    {
        var cut = RenderComponent<ArgentinaCodigoUnicoDeIdentificacionLaboralView>(p => p.Add(x => x.Label, "Label"));
        var root = cut.Find(".argentina-codigo-unico-de-identificacion-laboral-view");
        Assert.Equal("span", root.TagName.ToLowerInvariant());
    }

    [Fact]
    public void Aria_label_is_set_from_Label()
    {
        var cut = RenderComponent<ArgentinaCodigoUnicoDeIdentificacionLaboralView>(p => p.Add(x => x.Label, "Label"));
        var root = cut.Find(".argentina-codigo-unico-de-identificacion-laboral-view");
        Assert.Equal("Label", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void Renders_child_content_as_text()
    {
        var cut = RenderComponent<ArgentinaCodigoUnicoDeIdentificacionLaboralView>(p => p
            .Add(x => x.Label, "Label")
            .AddChildContent("123456789"));
        var root = cut.Find(".argentina-codigo-unico-de-identificacion-laboral-view");
        Assert.Equal("123456789", root.TextContent);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<ArgentinaCodigoUnicoDeIdentificacionLaboralView>(p => p
            .Add(x => x.Label, "Label")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".argentina-codigo-unico-de-identificacion-laboral-view");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<ArgentinaCodigoUnicoDeIdentificacionLaboralView>(p => p
            .Add(x => x.Label, "Label")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".argentina-codigo-unico-de-identificacion-laboral-view");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }
}
