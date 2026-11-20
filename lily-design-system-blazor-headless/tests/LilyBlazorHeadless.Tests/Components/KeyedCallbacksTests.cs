using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// What reaches C# when the keys module calls back: each component's override of a KeyedComponentBase hook, called
// through the [JSInvokable] entry point as the module calls it.
public class KeyedCallbacksTests : TestContext
{
    public KeyedCallbacksTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public async Task Cascader_opens_and_reports_the_chosen_path()
    {
        bool? expanded = null;
        TreeSelection? chosen = null;
        var cut = RenderComponent<Cascader>(p => p
            .Add(x => x.Label, "Place")
            .Add(x => x.ExpandedChanged, v => expanded = v)
            .Add(x => x.OnSelect, v => chosen = v));
        await cut.InvokeAsync(() => cut.Instance.OnKeyedOpen(true));
        Assert.True(expanded);
        Assert.True(cut.Instance.Expanded);
        await cut.InvokeAsync(() => cut.Instance.OnKeyedSelect("leeds", ["uk", "leeds"], ["leeds"]));
        Assert.Equal("leeds", chosen!.Value);
        Assert.Equal(["uk", "leeds"], chosen.Path);
        Assert.Equal(["leeds"], chosen.Selected);
    }

    [Fact]
    public async Task TreeSelect_opens_closes_and_reports_every_selected_value()
    {
        var opened = new List<bool>();
        TreeSelection? chosen = null;
        var cut = RenderComponent<TreeSelect>(p => p
            .Add(x => x.Label, "Teams")
            .Add(x => x.Multiple, true)
            .Add(x => x.ExpandedChanged, v => opened.Add(v))
            .Add(x => x.OnSelect, v => chosen = v));
        await cut.InvokeAsync(() => cut.Instance.OnKeyedOpen(true));
        await cut.InvokeAsync(() => cut.Instance.OnKeyedSelect("red", ["all", "red"], ["blue", "red"]));
        await cut.InvokeAsync(() => cut.Instance.OnKeyedOpen(false));
        Assert.Equal([true, false], opened);
        Assert.Equal(["blue", "red"], chosen!.Selected);
    }

    [Fact]
    public async Task SplitView_keys_move_the_split_and_report_it()
    {
        double? reported = null;
        var cut = RenderComponent<SplitView>(p => p
            .Add(x => x.Label, "Panes")
            .Add(x => x.SplitPercentChanged, v => reported = v));
        await cut.InvokeAsync(() => cut.Instance.OnKeyedChange(60));
        Assert.Equal(60, reported);
        Assert.Equal("60", cut.Find(".split-view").GetAttribute("data-split-percent"));
        Assert.Equal("60", cut.Find(".split-view-divider").GetAttribute("aria-valuenow"));
    }

    [Fact]
    public void SplitView_renders_a_consumer_divider_instead_of_its_own()
    {
        var cut = RenderComponent<SplitView>(p => p
            .Add(x => x.Label, "Panes")
            .Add(x => x.Divider, (RenderFragment)(b => b.AddMarkupContent(0, "<div class=\"mine\" role=\"separator\"></div>"))));
        Assert.Empty(cut.FindAll(".split-view-divider"));
        Assert.NotNull(cut.Find(".mine"));
    }

    [Fact]
    public async Task Splitter_keys_move_the_value_and_report_it()
    {
        double? reported = null;
        var cut = RenderComponent<Splitter>(p => p
            .Add(x => x.Label, "Panes")
            .Add(x => x.ValueChanged, v => reported = v));
        await cut.InvokeAsync(() => cut.Instance.OnKeyedChange(30));
        Assert.Equal(30, reported);
        Assert.Equal(30, cut.Instance.Value);
    }

    [Fact]
    public async Task ImageCropper_reports_the_crop_the_keys_moved()
    {
        CropRect? crop = null;
        var cut = RenderComponent<ImageCropper>(p => p.Add(x => x.OnCropChange, v => crop = v));
        await cut.InvokeAsync(() => cut.Instance.OnKeyedCrop(new CropRect(10, 5, 50, 40)));
        Assert.Equal(new CropRect(10, 5, 50, 40), crop);
    }

    [Fact]
    public async Task A_component_without_a_hook_takes_any_callback_quietly()
    {
        var cut = RenderComponent<ActionBar>(p => p.Add(x => x.Label, "Actions"));
        await cut.InvokeAsync(() => cut.Instance.OnKeyedChange(1));
        await cut.InvokeAsync(() => cut.Instance.OnKeyedCrop(new CropRect(0, 0, 1, 1)));
        await cut.InvokeAsync(() => cut.Instance.OnKeyedOpen(true));
        await cut.InvokeAsync(() => cut.Instance.OnKeyedSelect("x", ["x"], ["x"]));
        Assert.NotNull(cut.Find(".action-bar"));
    }
}
