using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class FormTests : TestContext
{
    private IRenderedComponent<Form> Make(Action<ComponentParameterCollectionBuilder<Form>>? more = null) =>
        RenderComponent<Form>(p =>
        {
            p
            .Add(x => x.Label, "Named").AddChildContent("body");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("form.form"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("form.form").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("form.form").GetAttribute("data-test"));

    [Fact]
    public void Label_names_the_root_with_aria_label() => Assert.Equal("Named", Make().Find("form").GetAttribute("aria-label"));

    [Fact]
    public void Submit_and_reset_report()
    {
        var (submitted, reset) = (0, 0);
        var cut = Make(p => p.Add(x => x.OnSubmit, () => submitted++).Add(x => x.OnReset, () => reset++));
        cut.Find("form").Submit();
        cut.Find("form").Reset();
        Assert.Equal((1, 1), (submitted, reset));
    }

    [Fact]
    public void Lower_case_onsubmit_reaches_the_same_parameter()
    {
        var submitted = 0;
        var cut = Render(b =>
        {
            b.OpenComponent<Form>(0);
            b.AddAttribute(1, "Label", "Named");
            b.AddAttribute(2, "onsubmit", EventCallback.Factory.Create<EventArgs>(this, () => submitted++));
            b.CloseComponent();
        });
        cut.Find("form").Submit();
        Assert.Equal(1, submitted);
    }
}
