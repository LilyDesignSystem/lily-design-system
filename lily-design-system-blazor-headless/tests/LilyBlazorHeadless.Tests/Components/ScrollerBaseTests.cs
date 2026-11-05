using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ScrollerBaseTests : TestContext
{
    public ScrollerBaseTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<ScrollerBase> Make(Action<ComponentParameterCollectionBuilder<ScrollerBase>>? more = null) =>
        RenderComponent<ScrollerBase>(p =>
        {
            p.Add(x => x.Label, "Story");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.scroller-base"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.scroller-base").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.scroller-base").GetAttribute("data-test"));

    [Fact]
    public void Label_names_it() => Assert.Equal("Story", Make().Find("div").GetAttribute("aria-label"));

    [Fact]
    public void Offset_and_what_is_wanted_reach_the_module()
    {
        Make(p => p.Add(x => x.Offset, 0.25).Add(x => x.OnProgressChange, (double _) => { }));
        var attach = Assert.Single(JSInterop.Invocations, i => i.Identifier == "attach");
        Assert.Equal(0.25, attach.Arguments[2]);
        Assert.Equal(false, attach.Arguments[3]);
        Assert.Equal(true, attach.Arguments[4]);
    }

    [Fact]
    public async Task The_module_reports_through_the_callbacks()
    {
        int? index = null;
        double? progress = null;
        var cut = Make(p => p.Add(x => x.OnIndexChange, (int i) => index = i).Add(x => x.OnProgressChange, (double v) => progress = v));
        await cut.InvokeAsync(() => cut.Instance.OnScrollerIndex(2));
        await cut.InvokeAsync(() => cut.Instance.OnScrollerProgress(0.5));
        Assert.Equal(2, index);
        Assert.Equal(0.5, progress);
    }
}
