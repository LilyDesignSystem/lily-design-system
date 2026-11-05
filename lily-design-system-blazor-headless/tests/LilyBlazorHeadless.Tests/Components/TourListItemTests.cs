using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TourListItemTests : TestContext
{
    public TourListItemTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<TourListItem> Make(Action<ComponentParameterCollectionBuilder<TourListItem>>? more = null) =>
        RenderComponent<TourListItem>(p =>
        {
            p.Add(x => x.Label, "Welcome");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("li.tour-list-item"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("li.tour-list-item").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("li.tour-list-item").GetAttribute("data-test"));

    [Fact]
    public void Is_a_named_step()
    {
        var root = Make().Find("li");
        Assert.Equal("group", root.GetAttribute("role"));
        Assert.Equal("step", root.GetAttribute("aria-roledescription"));
        Assert.Equal("Welcome", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void The_current_step_shows()
    {
        var root = Make(p => p.Add(x => x.Current, true)).Find("li");
        Assert.True(root.HasAttribute("data-current"));
        Assert.False(root.HasAttribute("hidden"));
        Assert.False(root.HasAttribute("aria-hidden"));
    }

    [Fact]
    public void Other_steps_are_hidden()
    {
        var root = Make().Find("li");
        Assert.False(root.HasAttribute("data-current"));
        Assert.True(root.HasAttribute("hidden"));
        Assert.Equal("true", root.GetAttribute("aria-hidden"));
    }

    [Fact]
    public void The_numbers_name_it_only_through_the_consumers_template()
    {
        Assert.Equal("Welcome", Make(p => p.Add(x => x.StepNumber, 2).Add(x => x.TotalSteps, 5)).Find("li").GetAttribute("aria-label"));
        Assert.Equal("Welcome: 2/5", Make(p => p.Add(x => x.StepNumber, 2).Add(x => x.TotalSteps, 5).Add(x => x.StepTemplate, "{label}: {step}/{total}")).Find("li").GetAttribute("aria-label"));
    }
}
