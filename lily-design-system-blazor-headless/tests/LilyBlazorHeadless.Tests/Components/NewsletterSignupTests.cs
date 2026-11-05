using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class NewsletterSignupTests : TestContext
{
    private IRenderedComponent<NewsletterSignup> Make(Action<ComponentParameterCollectionBuilder<NewsletterSignup>>? more = null) =>
        RenderComponent<NewsletterSignup>(p =>
        {
            p
            .Add(x => x.Label, "Newsletter")
            .Add(x => x.EmailLabel, "Email")
            .Add(x => x.SubmitLabel, "Join");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("form.newsletter-signup"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("form.newsletter-signup").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("form.newsletter-signup").GetAttribute("data-test"));

    [Fact]
    public void The_form_is_named_and_is_no_live_region()
    {
        var root = Make().Find("form");
        Assert.Equal("Newsletter", root.GetAttribute("aria-label"));
        Assert.False(root.HasAttribute("role"));
        Assert.Equal("idle", root.GetAttribute("data-state"));
    }

    [Fact]
    public void Header_is_only_there_with_text()
    {
        Assert.Empty(Make().FindAll("header"));
        var cut = Make(p => p.Add(x => x.Heading, "News").Add(x => x.Description, "Monthly."));
        Assert.Equal("News", cut.Find("h3.newsletter-signup-heading").TextContent);
        Assert.Equal("Monthly.", cut.Find("p.newsletter-signup-description").TextContent);
    }

    [Fact]
    public void The_input_sits_in_its_label()
    {
        var cut = Make(p => p.Add(x => x.EmailPlaceholder, "you@example.org"));
        var input = cut.Find("label.newsletter-signup-label > input.newsletter-signup-input");
        Assert.Equal("email", input.GetAttribute("type"));
        Assert.Equal("you@example.org", input.GetAttribute("placeholder"));
        Assert.Contains("Email", cut.Find("label").TextContent);
        Assert.Equal("submit", cut.Find("button").GetAttribute("type"));
        Assert.Equal("Join", cut.Find("button").TextContent);
    }

    [Theory]
    [InlineData("idle", false, true, true)]
    [InlineData("submitting", true, true, true)]
    [InlineData("success", false, false, true)]
    [InlineData("error", false, true, false)]
    public void State_drives_the_controls_and_the_messages(string state, bool disabled, bool successHidden, bool errorHidden)
    {
        var cut = Make(p => p.Add(x => x.State, state).Add(x => x.SuccessMessage, "Done").Add(x => x.ErrorMessage, "Failed"));
        Assert.Equal(state, cut.Find("form").GetAttribute("data-state"));
        Assert.Equal(disabled, cut.Find("input").HasAttribute("disabled"));
        Assert.Equal(disabled, cut.Find("button").HasAttribute("disabled"));
        Assert.Equal(successHidden, cut.Find(".newsletter-signup-success").HasAttribute("hidden"));
        Assert.Equal(errorHidden, cut.Find(".newsletter-signup-error").HasAttribute("hidden"));
    }

    [Fact]
    public void The_messages_are_live_regions_before_their_state()
    {
        var cut = Make();
        Assert.Equal("status", cut.Find(".newsletter-signup-success").GetAttribute("role"));
        Assert.Equal("polite", cut.Find(".newsletter-signup-success").GetAttribute("aria-live"));
        Assert.Equal("alert", cut.Find(".newsletter-signup-error").GetAttribute("role"));
    }

    [Fact]
    public void Email_binds_and_submit_reports()
    {
        string? email = null;
        var submitted = 0;
        var cut = Make(p => p.Add(x => x.EmailChanged, (string v) => email = v).Add(x => x.OnSubmit, () => submitted++));
        cut.Find("input").Input("a@example.org");
        cut.Find("form").Submit();
        Assert.Equal("a@example.org", email);
        Assert.Equal(1, submitted);
    }
}
