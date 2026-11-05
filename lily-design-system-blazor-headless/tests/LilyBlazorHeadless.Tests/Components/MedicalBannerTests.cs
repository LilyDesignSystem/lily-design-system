using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class MedicalBannerTests : TestContext
{
    public MedicalBannerTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<MedicalBanner> Make(Action<ComponentParameterCollectionBuilder<MedicalBanner>>? more = null) =>
        RenderComponent<MedicalBanner>(p =>
        {
            p.Add(x => x.Label, "Notice");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.medical-banner"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.medical-banner").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.medical-banner").GetAttribute("data-test"));

    [Fact]
    public void Is_a_polite_region_with_its_type()
    {
        var root = Make(p => p.Add(x => x.Type, "warning")).Find("div");
        Assert.Equal("region", root.GetAttribute("role"));
        Assert.Equal("polite", root.GetAttribute("aria-live"));
        Assert.Equal("warning", root.GetAttribute("data-type"));
    }

    [Fact]
    public void Type_defaults_to_info() => Assert.Equal("info", Make().Find("div").GetAttribute("data-type"));

    [Fact]
    public void There_is_no_button_unless_dismissible() => Assert.Empty(Make().FindAll("button"));

    [Fact]
    public void Dismissing_removes_it_for_good_and_reports()
    {
        var closed = 0;
        var cut = Make(p => p.Add(x => x.Dismissible, true).Add(x => x.CloseLabel, "Dismiss").Add(x => x.OnClose, () => closed++));
        var button = cut.Find("button");
        Assert.Equal("Dismiss", button.GetAttribute("aria-label"));
        Assert.Equal("button", button.GetAttribute("type"));
        button.Click();
        Assert.Equal(1, closed);
        Assert.Empty(cut.FindAll("div"));
        cut.SetParametersAndRender(p => p.Add(x => x.Type, "error"));
        Assert.Empty(cut.FindAll("div"));
    }

    [Fact]
    public void Is_marked_medical() => Assert.Equal("medical", Make().Find("div").GetAttribute("data-context"));
}
