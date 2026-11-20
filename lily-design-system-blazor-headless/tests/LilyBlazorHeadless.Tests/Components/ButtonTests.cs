using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ButtonTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Button>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".button");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Button>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".button");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Button>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".button");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Names_itself_with_aria_label()
    {
        var cut = RenderComponent<Button>(p => p.Add(x => x.Label, "Name"));
        Assert.Equal("Name", cut.Find("button.button").GetAttribute("aria-label"));
    }

    [Fact]
    public void Pending_button_stays_focusable_while_consumer_guard_ignores_second_click()
    {
        var pending = false;
        var starts = 0;
        var cut = RenderComponent<Button>(p => p
            .AddChildContent("Saving")
            .AddUnmatched("aria-busy", "true")
            .AddUnmatched("aria-disabled", "true")
            .AddUnmatched("onclick", EventCallback.Factory.Create(this, () =>
            {
                if (pending) return;
                pending = true;
                starts++;
            })));
        var button = cut.Find("button");

        button.Click();
        button.Click();

        Assert.False(button.HasAttribute("disabled"));
        Assert.False(button.HasAttribute("tabindex"));
        Assert.Equal("true", button.GetAttribute("aria-busy"));
        Assert.Equal("true", button.GetAttribute("aria-disabled"));
        Assert.Equal(1, starts);
    }
}
