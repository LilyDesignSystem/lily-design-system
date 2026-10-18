using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class EditableTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Editable>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".editable");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Editable>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".editable");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Editable>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".editable");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Accessible_name_includes_the_visible_value()
    {
        var cut = RenderComponent<Editable>(p => p
            .Add(x => x.Label, "Project title")
            .Add(x => x.Value, "Q1 plan")
            .AddChildContent("Q1 plan"));
        Assert.Equal("Q1 plan, Project title", cut.Find(".editable").GetAttribute("aria-label"));
    }

    [Fact]
    public void Accessible_name_is_the_label_when_there_is_no_value()
    {
        var cut = RenderComponent<Editable>(p => p
            .Add(x => x.Label, "Project title")
            .AddChildContent("body"));
        Assert.Equal("Project title", cut.Find(".editable").GetAttribute("aria-label"));
    }
}
