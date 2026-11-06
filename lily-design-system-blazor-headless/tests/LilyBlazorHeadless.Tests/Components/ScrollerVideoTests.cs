using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ScrollerVideoTests : TestContext
{
    public ScrollerVideoTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<ScrollerVideo> Make(Action<ComponentParameterCollectionBuilder<ScrollerVideo>>? more = null) =>
        RenderComponent<ScrollerVideo>(p =>
        {
            p.Add(x => x.Src, "/a.webm").Add(x => x.Label, "Story").Add(x => x.Alt, "A river");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.scroller-video"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.scroller-video").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.scroller-video").GetAttribute("data-test"));

    [Fact]
    public void A_muted_described_video_behind_the_steps()
    {
        var cut = Make(p => p.AddChildContent("<section>One</section>"));
        Assert.Equal("group", cut.Find("div.scroller-video").GetAttribute("role"));
        var background = cut.Find(".scroller-video-background");
        Assert.Equal("img", background.GetAttribute("role"));
        Assert.Equal("A river", background.GetAttribute("aria-label"));
        Assert.Equal("scrollable video", background.GetAttribute("aria-roledescription"));
        var video = cut.Find("video.scroller-video-element");
        Assert.True(video.HasAttribute("muted"));
        Assert.True(video.HasAttribute("playsinline"));
        Assert.NotNull(cut.Find("div.scroller-base.scroller-video-foreground > section"));
    }

    [Fact]
    public async Task The_callbacks_reach_the_scroller()
    {
        double? progress = null;
        var cut = Make(p => p.Add(x => x.OnProgressChange, (double v) => progress = v));
        var scroller = cut.FindComponent<ScrollerBase>();
        await cut.InvokeAsync(() => scroller.Instance.OnScrollerProgress(1));
        Assert.Equal(1, progress);
    }

    [Fact]
    public void Is_a_named_group_when_labelled()
    {
        var cut = RenderComponent<ScrollerVideo>(p => p
            .AddChildContent("body")
            .Add(x => x.Alt, "Alt")
            .Add(x => x.Label, "Story"));
        var root = cut.Find(".scroller-video");
        Assert.Equal("group", root.GetAttribute("role"));
        Assert.Equal("Story", root.GetAttribute("aria-label"));
    }
}
