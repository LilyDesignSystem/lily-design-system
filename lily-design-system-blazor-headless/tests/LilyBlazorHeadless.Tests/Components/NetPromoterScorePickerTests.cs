using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class NetPromoterScorePickerTests : TestContext
{
    public NetPromoterScorePickerTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<NetPromoterScorePicker> Make(Action<ComponentParameterCollectionBuilder<NetPromoterScorePicker>>? more = null) =>
        RenderComponent<NetPromoterScorePicker>(p =>
        {
            p.Add(x => x.Label, "Score");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("fieldset.net-promoter-score-picker"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("fieldset.net-promoter-score-picker").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("fieldset.net-promoter-score-picker").GetAttribute("data-test"));

    [Fact]
    public void Is_a_named_radiogroup_of_eleven_radios()
    {
        var cut = Make();
        Assert.Equal("radiogroup", cut.Find("fieldset").GetAttribute("role"));
        Assert.Equal("Score", cut.Find("fieldset").GetAttribute("aria-label"));
        var radios = cut.FindAll("input[type=radio]");
        Assert.Equal(Enumerable.Range(0, 11).Select(i => i.ToString()), radios.Select(r => r.GetAttribute("value")));
        Assert.All(radios, r => Assert.Equal("nps", r.GetAttribute("name")));
        Assert.Equal("3", radios[3].GetAttribute("aria-label"));
    }

    [Fact]
    public void Value_checks_a_radio_and_Name_is_passed_on()
    {
        var radios = Make(p => p.Add(x => x.Value, "7").Add(x => x.Name, "service")).FindAll("input");
        Assert.True(radios[7].HasAttribute("checked"));
        Assert.False(radios[6].HasAttribute("checked"));
        Assert.Equal("service", radios[0].GetAttribute("name"));
    }

    [Fact]
    public void Choosing_reports()
    {
        string? seen = null;
        var cut = Make(p => p.Add(x => x.ValueChanged, (string v) => seen = v));
        cut.FindAll("input")[9].Change(true);
        Assert.Equal("9", seen);
    }
}
