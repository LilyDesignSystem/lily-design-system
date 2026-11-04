using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class CommandTests : TestContext
{
    public CommandTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void Links_the_search_input_to_its_listbox_and_names_both()
    {
        var cut = RenderComponent<Command>(p => p
            .Add(x => x.Label, "Actions")
            .AddChildContent("<div role=\"option\">One</div>"));
        var input = cut.Find("input[type='search']");
        var list = cut.Find("[role='listbox']");
        Assert.Equal(list.Id, input.GetAttribute("aria-controls"));
        Assert.Equal("Actions", input.GetAttribute("aria-label"));
        Assert.Equal("Actions", list.GetAttribute("aria-label"));
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Command>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".command");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Command>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".command");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Command>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".command");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }
}
