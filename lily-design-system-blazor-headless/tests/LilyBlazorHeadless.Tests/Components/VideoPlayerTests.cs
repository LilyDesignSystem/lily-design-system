using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class VideoPlayerTests : TestContext
{
    public VideoPlayerTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<VideoPlayer> Make(Action<ComponentParameterCollectionBuilder<VideoPlayer>>? more = null) =>
        RenderComponent<VideoPlayer>(p =>
        {
            p.Add(x => x.Src, "/a.webm").Add(x => x.Label, "Tour");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("figure.video-player"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("figure.video-player").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("figure.video-player").GetAttribute("data-test"));

    [Fact]
    public void Is_a_named_figure_around_a_native_video()
    {
        var cut = Make(p => p.Add(x => x.Poster, "/a.png").Add(x => x.Loop, true));
        Assert.False(cut.Find("figure").HasAttribute("role"));
        Assert.Equal("Tour", cut.Find("figure").GetAttribute("aria-label"));
        var video = cut.Find("video.video-player-element");
        Assert.Equal("/a.webm", video.GetAttribute("src"));
        Assert.Equal("/a.png", video.GetAttribute("poster"));
        Assert.True(video.HasAttribute("loop"));
        Assert.True(video.HasAttribute("controls"));
        Assert.True(video.HasAttribute("playsinline"));
    }

    [Fact]
    public void Controls_can_be_off() => Assert.False(Make(p => p.Add(x => x.Controls, false)).Find("video").HasAttribute("controls"));

    [Fact]
    public void Controls_and_caption_have_their_parts()
    {
        var cut = Make(p => p.AddChildContent("<button>Play</button>").Add(x => x.Caption, "<em>Caption</em>"));
        Assert.NotNull(cut.Find(".video-player-controls > button"));
        Assert.NotNull(cut.Find("figcaption.video-player-caption > em"));
        Assert.Empty(Make().FindAll(".video-player-controls"));
    }

    [Fact]
    public void Autoplay_and_Muted_reach_the_module()
    {
        Make(p => p.Add(x => x.Autoplay, true).Add(x => x.Muted, true));
        var attach = Assert.Single(JSInterop.Invocations, i => i.Identifier == "attach");
        Assert.Equal(true, attach.Arguments[1]);
        Assert.Equal(true, attach.Arguments[2]);
    }
}
