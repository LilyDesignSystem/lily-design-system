using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class MeasurementInstanceInputTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<MeasurementInstanceInput>(p => { });
        var root = cut.Find(".measurement-instance-input");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<MeasurementInstanceInput>(p => p
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".measurement-instance-input");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<MeasurementInstanceInput>(p => p
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".measurement-instance-input");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }
}
