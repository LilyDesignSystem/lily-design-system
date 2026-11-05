using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.JSInterop;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ClipboardCopyButtonTests : TestContext
{
    public ClipboardCopyButtonTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<ClipboardCopyButton> Make(Action<ComponentParameterCollectionBuilder<ClipboardCopyButton>>? more = null) =>
        RenderComponent<ClipboardCopyButton>(p =>
        {
            p.Add(x => x.Text, "copy me").Add(x => x.Label, "Copy");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("button.clipboard-copy-button"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("button.clipboard-copy-button").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("button.clipboard-copy-button").GetAttribute("data-test"));

    [Fact]
    public void A_copy_writes_the_text_reports_and_marks_it_then_clears()
    {
        var plan = JSInterop.SetupVoid("navigator.clipboard.writeText", "copy me");
        plan.SetVoidResult();
        var success = 0;
        var cut = Make(p => p.Add(x => x.OnSuccess, () => success++));
        Assert.Equal("button", cut.Find("button").GetAttribute("type"));
        Assert.Equal("false", cut.Find("button").GetAttribute("data-copied"));
        cut.Find("button").Click();
        cut.WaitForAssertion(() => Assert.Equal("true", cut.Find("button").GetAttribute("data-copied")));
        Assert.Equal(1, success);
        cut.WaitForAssertion(() => Assert.Equal("false", cut.Find("button").GetAttribute("data-copied")), TimeSpan.FromSeconds(4));
    }

    [Fact]
    public void A_refused_copy_reports_and_marks_nothing()
    {
        JSInterop.SetupVoid("navigator.clipboard.writeText", "copy me").SetException(new JSException("denied"));
        string? error = null;
        var cut = Make(p => p.Add(x => x.OnError, (string e) => error = e));
        cut.Find("button").Click();
        cut.WaitForAssertion(() => Assert.Equal("denied", error));
        Assert.Equal("false", cut.Find("button").GetAttribute("data-copied"));
    }
}
