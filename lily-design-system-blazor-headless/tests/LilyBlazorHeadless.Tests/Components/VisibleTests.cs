using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class VisibleTests : TestContext
{
    public VisibleTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<Visible> Make(Action<ComponentParameterCollectionBuilder<Visible>>? more = null) =>
        RenderComponent<Visible>(p =>
        {
            p.AddUnmatched("data-root", "1");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.visible"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.visible").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.visible").GetAttribute("data-test"));

    [Fact]
    public void The_content_and_data_visible_follow_the_module()
    {
        var cut = Make(p => p.Add(x => x.ChildContent, (bool on) => on ? "<b>on</b>" : "<i>off</i>"));
        Assert.Equal("false", cut.Find("div").GetAttribute("data-visible"));
        Assert.NotNull(cut.Find("i"));
        cut.InvokeAsync(() => cut.Instance.OnVisibleChange(true));
        Assert.Equal("true", cut.Find("div").GetAttribute("data-visible"));
        Assert.NotNull(cut.Find("b"));
    }

    [Fact]
    public void The_options_reach_the_module()
    {
        Make(p => p.Add(x => x.Once, true).Add(x => x.Threshold, 0.5).Add(x => x.RootMargin, "10px"));
        var attach = Assert.Single(JSInterop.Invocations, i => i.Identifier == "attach");
        Assert.Equal(true, attach.Arguments[2]);
        Assert.Equal(0.5, attach.Arguments[3]);
        Assert.Equal("10px", attach.Arguments[4]);
    }
}
