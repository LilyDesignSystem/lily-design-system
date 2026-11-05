using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TaskListItemTests : TestContext
{
    public TaskListItemTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<TaskListItem> Make(Action<ComponentParameterCollectionBuilder<TaskListItem>>? more = null) =>
        RenderComponent<TaskListItem>(p =>
        {
            p.Add(x => x.Label, "Write");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("li.task-list-item"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("li.task-list-item").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("li.task-list-item").GetAttribute("data-test"));

    [Fact]
    public void The_checkbox_is_labelled_by_the_text()
    {
        var label = Make().Find("li > label");
        Assert.NotNull(label.QuerySelector("input[type=checkbox]"));
        Assert.Contains("Write", label.TextContent);
    }

    [Fact]
    public void Checking_reports_and_is_reflected()
    {
        bool? seen = null;
        var cut = Make(p => p.Add(x => x.CheckedChanged, (bool v) => seen = v));
        Assert.Equal("false", cut.Find("li").GetAttribute("data-checked"));
        cut.Find("input").Change(true);
        Assert.True(seen);
        Assert.Equal("true", cut.Find("li").GetAttribute("data-checked"));
    }

    [Fact]
    public void Disabled_reaches_the_checkbox_and_the_li()
    {
        var cut = Make(p => p.Add(x => x.Disabled, true));
        Assert.True(cut.Find("input").HasAttribute("disabled"));
        Assert.Equal("true", cut.Find("li").GetAttribute("data-disabled"));
    }
}
