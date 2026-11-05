using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class FieldTests : TestContext
{
    public FieldTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<Field> Make(Action<ComponentParameterCollectionBuilder<Field>>? more = null) =>
        RenderComponent<Field>(p =>
        {
            p.Add(x => x.Label, "Name");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.field"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.field").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.field").GetAttribute("data-test"));

    [Fact]
    public void The_label_points_at_the_control()
    {
        var cut = Make(p => p.Add(x => x.InputId, "name").AddChildContent("<input id=\"name\" />"));
        Assert.Equal("name", cut.Find("label").GetAttribute("for"));
        Assert.Equal("Name", cut.Find("label").TextContent);
        Assert.NotNull(cut.Find("#name"));
    }

    [Fact]
    public void The_root_is_no_alert() => Assert.False(Make().Find("div").HasAttribute("role"));

    [Fact]
    public void Required_marks_it_with_a_hidden_asterisk()
    {
        var cut = Make(p => p.Add(x => x.Required, true));
        Assert.Equal("true", cut.Find("div").GetAttribute("data-required"));
        Assert.Equal("true", cut.Find("label span").GetAttribute("aria-hidden"));
    }

    [Fact]
    public void Description_and_error()
    {
        var cut = Make(p => p.Add(x => x.InputId, "n").Add(x => x.Description, "Help").Add(x => x.Error, "Bad"));
        Assert.Equal("Help", cut.Find("#n-desc").TextContent);
        Assert.Equal("alert", cut.Find("#n-error").GetAttribute("role"));
    }
}
