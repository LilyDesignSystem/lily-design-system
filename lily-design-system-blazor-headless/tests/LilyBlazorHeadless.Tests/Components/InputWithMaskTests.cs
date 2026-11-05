using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class InputWithMaskTests : TestContext
{
    public InputWithMaskTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<InputWithMask> Make(Action<ComponentParameterCollectionBuilder<InputWithMask>>? more = null) =>
        RenderComponent<InputWithMask>(p =>
        {
            p.Add(x => x.Label, "Phone").Add(x => x.Mask, "___-____");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.input-with-mask"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.input-with-mask").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.input-with-mask").GetAttribute("data-test"));

    [Fact]
    public void Shows_the_mask_hidden_from_assistive_technology()
    {
        var cut = Make();
        Assert.Equal("___-____", cut.Find("div").GetAttribute("data-mask"));
        var display = cut.Find(".input-with-mask-display");
        Assert.Equal("___-____", display.TextContent);
        Assert.Equal("true", display.GetAttribute("aria-hidden"));
    }

    [Fact]
    public void Binds_a_value()
    {
        string? seen = null;
        var cut = Make(p => p.Add(x => x.ValueChanged, (string v) => seen = v));
        Assert.Equal("Phone", cut.Find("input.input-with-mask-control").GetAttribute("aria-label"));
        cut.Find("input").Input("555");
        Assert.Equal("555", seen);
    }
}
