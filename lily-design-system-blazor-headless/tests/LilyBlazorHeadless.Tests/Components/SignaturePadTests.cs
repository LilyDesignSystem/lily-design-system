using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class SignaturePadTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<SignaturePad>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".signature-pad");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<SignaturePad>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".signature-pad");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<SignaturePad>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".signature-pad");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void A_named_group_with_the_attestation_a_typed_name_field_and_an_outcome_notice()
    {
        var typed = "";
        var cut = RenderComponent<SignaturePad>(p => p
            .Add(x => x.Label, "Consent signature")
            .Add(x => x.Attestation, "I confirm.")
            .Add(x => x.TypedNameLabel, "Type your full name")
            .Add(x => x.Name, "signature")
            .Add(x => x.TypedNameChanged, (string v) => typed = v)
            .Add(x => x.Outcome, "declined")
            .Add(x => x.OutcomeLabel, "Declined to sign"));
        var root = cut.Find(".signature-pad");
        Assert.Equal("group", root.GetAttribute("role"));
        Assert.Equal("signature-pad-attestation", root.FirstElementChild!.ClassName);
        Assert.Equal(root.FirstElementChild!.Id, root.GetAttribute("aria-describedby"));
        Assert.Equal("declined", root.GetAttribute("data-outcome"));
        var input = cut.Find(".signature-pad-typed input");
        Assert.Equal(input.Id, cut.Find(".signature-pad-typed label").GetAttribute("for"));
        Assert.Equal("signature", input.GetAttribute("name"));
        input.Input("Ada Lovelace");
        Assert.Equal("Ada Lovelace", typed);
        Assert.Equal("Declined to sign", cut.Find(".signature-pad-outcome").TextContent);
    }
}
