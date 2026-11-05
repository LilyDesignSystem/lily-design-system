using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class CoachmarkTests : TestContext
{
    public CoachmarkTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<Coachmark> Make(Action<ComponentParameterCollectionBuilder<Coachmark>>? more = null) =>
        RenderComponent<Coachmark>(p =>
        {
            p.Add(x => x.Title, "New").Add(x => x.DismissLabel, "Close");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.coachmark"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.coachmark").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.coachmark").GetAttribute("data-test"));

    [Fact]
    public void Is_a_manual_popover()
    {
        var root = Make().Find("div");
        Assert.Equal("dialog", root.GetAttribute("role"));
        Assert.Equal("manual", root.GetAttribute("popover"));
    }

    [Fact]
    public void The_state_is_sent_to_the_module_when_it_changes()
    {
        var cut = Make();
        var before = JSInterop.Invocations.Count;
        cut.SetParametersAndRender(p => p.Add(x => x.Open, true));
        Assert.Contains(JSInterop.Invocations.Skip(before), i => i.Identifier == "set" && (bool)i.Arguments[0]!);
    }

    [Fact]
    public void The_title_names_it_and_the_description_describes_it()
    {
        var cut = Make(p => p.Add(x => x.Description, "Look here."));
        var root = cut.Find("div");
        Assert.Equal("false", root.GetAttribute("aria-modal"));
        Assert.Equal(root.GetAttribute("aria-labelledby"), cut.Find("h2.coachmark-title").Id);
        Assert.Equal(root.GetAttribute("aria-describedby"), cut.Find("p.coachmark-description").Id);
        Assert.False(Make().Find("div").HasAttribute("aria-describedby"));
    }

    [Fact]
    public void The_button_reports()
    {
        var dismissed = 0;
        var cut = Make(p => p.Add(x => x.OnDismiss, () => dismissed++));
        Assert.Equal("Close", cut.Find("button.coachmark-dismiss").GetAttribute("aria-label"));
        cut.Find("button").Click();
        Assert.Equal(1, dismissed);
    }
}
