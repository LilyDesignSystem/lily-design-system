using System;
using System.IO;
using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ContentsNavTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<ContentsNav>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".contents-nav");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<ContentsNav>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".contents-nav");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<ContentsNav>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".contents-nav");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Spy_is_off_by_default_and_renders_no_spy_attributes()
    {
        var cut = RenderComponent<ContentsNav>(p => p.Add(x => x.Label, "Contents").AddChildContent("body"));
        var root = cut.Find(".contents-nav");
        Assert.False(root.HasAttribute("data-lily-contents-nav-spy"));
        Assert.False(root.HasAttribute("data-spy-offset"));
    }

    [Fact]
    public void Spy_renders_the_data_attributes_the_script_reads()
    {
        var cut = RenderComponent<ContentsNav>(p => p
            .Add(x => x.Label, "Contents")
            .Add(x => x.Spy, true)
            .Add(x => x.SpyOffset, 64)
            .Add(x => x.SpyCurrent, "location")
            .Add(x => x.SpyRoot, "#pane")
            .AddChildContent("body"));
        var root = cut.Find(".contents-nav");
        Assert.True(root.HasAttribute("data-lily-contents-nav-spy"));
        Assert.Equal("64", root.GetAttribute("data-spy-offset"));
        Assert.Equal("location", root.GetAttribute("data-spy-current"));
        Assert.Equal("#pane", root.GetAttribute("data-spy-root"));
    }

    [Fact]
    public void Spy_renders_an_offset_of_zero()
    {
        var cut = RenderComponent<ContentsNav>(p => p
            .Add(x => x.Label, "Contents").Add(x => x.Spy, true).Add(x => x.SpyOffset, 0).AddChildContent("body"));
        Assert.Equal("0", cut.Find(".contents-nav").GetAttribute("data-spy-offset"));
    }

    [Fact]
    public void The_spy_script_ships_as_a_static_web_asset_exporting_autoInit()
    {
        var dir = AppContext.BaseDirectory;
        string? found = null;
        for (var d = new DirectoryInfo(dir); d is not null; d = d.Parent)
        {
            var candidate = Path.Combine(d.FullName, "src", "LilyBlazorHeadless", "wwwroot", "contents-nav-spy.js");
            if (File.Exists(candidate)) { found = candidate; break; }
        }
        Assert.NotNull(found);
        var text = File.ReadAllText(found!);
        Assert.Contains("export function autoInit", text);
        Assert.Contains("export function startScrollspy", text);
    }
}
