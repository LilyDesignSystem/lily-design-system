using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TextAreaInputWithCharacterCounterTests : TestContext
{
    public TextAreaInputWithCharacterCounterTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<TextAreaInputWithCharacterCounter> Make(Action<ComponentParameterCollectionBuilder<TextAreaInputWithCharacterCounter>>? more = null) =>
        RenderComponent<TextAreaInputWithCharacterCounter>(p =>
        {
            p.Add(x => x.Label, "Notes").Add(x => x.MaxLength, 10).Add(x => x.CounterTemplate, "{count}/{max}");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.text-area-input-with-character-counter"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.text-area-input-with-character-counter").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.text-area-input-with-character-counter").GetAttribute("data-test"));

    [Fact]
    public void The_counter_is_live_and_describes_the_field()
    {
        var cut = Make(p => p.Add(x => x.Value, "abc").Add(x => x.Rows, 4));
        var area = cut.Find("textarea");
        var counter = cut.Find("span");
        Assert.Equal("3/10", counter.TextContent);
        Assert.Equal("polite", counter.GetAttribute("aria-live"));
        Assert.Equal(counter.Id, area.GetAttribute("aria-describedby"));
        Assert.Equal("10", area.GetAttribute("maxlength"));
        Assert.Equal("4", area.GetAttribute("rows"));
    }

    [Fact]
    public void Typing_updates_the_value_and_the_count()
    {
        string? seen = null;
        var cut = Make(p => p.Add(x => x.ValueChanged, (string v) => seen = v));
        cut.Find("textarea").Input("hello");
        Assert.Equal("hello", seen);
        Assert.Equal("5/10", cut.Find("span").TextContent);
    }
}
