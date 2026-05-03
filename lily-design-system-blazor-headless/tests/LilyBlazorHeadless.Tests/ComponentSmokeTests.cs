using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests;

/// <summary>
/// Smoke tests that exercise a representative sample across the catalog so
/// regressions in the headless markup, the kebab class hook, and the
/// AdditionalAttributes pass-through get caught by `dotnet test`. Component-
/// specific behavior tests can sit in their own files.
/// </summary>
public class ComponentSmokeTests : TestContext
{
    [Fact]
    public void Container_renders_div_with_class()
    {
        var cut = RenderComponent<Container>(p => p.AddChildContent("hello"));
        var root = cut.Find("div.container");
        Assert.NotNull(root);
        Assert.Equal("hello", root.TextContent.Trim());
    }

    [Fact]
    public void Diff_renders_role_group_and_aria_label()
    {
        var cut = RenderComponent<Diff>(p => p.Add(x => x.Label, "Comparison").AddChildContent("body"));
        var root = cut.Find("div.diff");
        Assert.Equal("group", root.GetAttribute("role"));
        Assert.Equal("Comparison", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void Hero_renders_section_with_required_label()
    {
        var cut = RenderComponent<Hero>(p => p.Add(x => x.Label, "Story").AddChildContent("body"));
        var root = cut.Find("section.hero");
        Assert.Equal("Story", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void Loading_renders_with_role_status()
    {
        var cut = RenderComponent<Loading>(p => p.Add(x => x.Label, "Loading…").AddChildContent("…"));
        var root = cut.Find("div.loading");
        Assert.Equal("status", root.GetAttribute("role"));
    }

    [Fact]
    public void TextInput_renders_input_with_type_text()
    {
        var cut = RenderComponent<TextInput>(p => p.Add(x => x.Label, "Name"));
        var input = cut.Find("input.text-input");
        Assert.Equal("text", input.GetAttribute("type"));
        Assert.Equal("Name", input.GetAttribute("aria-label"));
    }

    [Fact]
    public void EmailInput_renders_input_with_type_email()
    {
        var cut = RenderComponent<EmailInput>(p => p.Add(x => x.Label, "Email"));
        var input = cut.Find("input.email-input");
        Assert.Equal("email", input.GetAttribute("type"));
    }

    [Fact]
    public void DateTimeLocalInput_renders_input_with_type_datetime_local()
    {
        var cut = RenderComponent<DateTimeLocalInput>(p => p.Add(x => x.Label, "When"));
        var input = cut.Find("input.date-time-local-input");
        Assert.Equal("datetime-local", input.GetAttribute("type"));
    }

    [Fact]
    public void AccordionLink_renders_anchor_with_href()
    {
        var cut = RenderComponent<AccordionLink>(p => p
            .Add(x => x.Href, "/section-1")
            .AddChildContent("Section 1"));
        var anchor = cut.Find("a.accordion-link");
        Assert.Equal("/section-1", anchor.GetAttribute("href"));
        Assert.Equal("Section 1", anchor.TextContent.Trim());
    }

    [Fact]
    public void TableTH_renders_th_element()
    {
        var cut = RenderComponent<TableTH>(p => p.AddChildContent("Name"));
        var th = cut.Find("th.table-th");
        Assert.Equal("Name", th.TextContent.Trim());
    }

    [Fact]
    public void TableTD_renders_td_element()
    {
        var cut = RenderComponent<TableTD>(p => p.AddChildContent("Alice"));
        var td = cut.Find("td.table-td");
        Assert.Equal("Alice", td.TextContent.Trim());
    }

    [Fact]
    public void ChatList_renders_ol_element()
    {
        var cut = RenderComponent<ChatList>(p => p.AddChildContent("<li>x</li>"));
        Assert.NotNull(cut.Find("ol.chat-list"));
    }

    [Fact]
    public void ChatNav_renders_nav_with_required_label()
    {
        var cut = RenderComponent<ChatNav>(p => p.Add(x => x.Label, "Chat").AddChildContent("x"));
        var nav = cut.Find("nav.chat-nav");
        Assert.Equal("Chat", nav.GetAttribute("aria-label"));
    }

    [Fact]
    public void Code_renders_inline_code_element()
    {
        var cut = RenderComponent<Code>(p => p.AddChildContent("foo()"));
        Assert.NotNull(cut.Find("code.code"));
    }

    [Fact]
    public void CodeBlock_renders_pre_element()
    {
        var cut = RenderComponent<CodeBlock>(p => p.AddChildContent("<code>x</code>"));
        Assert.NotNull(cut.Find("pre.code-block"));
    }

    [Fact]
    public void Citation_renders_cite_element()
    {
        var cut = RenderComponent<Citation>(p => p.AddChildContent("Source"));
        Assert.NotNull(cut.Find("cite.citation"));
    }

    [Fact]
    public void Kbd_renders_kbd_element()
    {
        var cut = RenderComponent<Kbd>(p => p.AddChildContent("Cmd+S"));
        Assert.NotNull(cut.Find("kbd.kbd"));
    }

    [Fact]
    public void Tile_renders_div_passing_through_extra_attributes()
    {
        var cut = RenderComponent<Tile>(p => p
            .AddUnmatched("data-testid", "tile")
            .AddChildContent("x"));
        var root = cut.Find("div.tile");
        Assert.Equal("tile", root.GetAttribute("data-testid"));
    }

    [Fact]
    public void TileMap_applies_role_img_and_aria_roledescription()
    {
        var cut = RenderComponent<TileMap>(p => p.Add(x => x.Label, "USA").AddChildContent("x"));
        var root = cut.Find("div.tile-map");
        Assert.Equal("img", root.GetAttribute("role"));
        Assert.Equal("tile map", root.GetAttribute("aria-roledescription"));
    }

    [Fact]
    public void SuperBanner_renders_role_alert_and_aria_live()
    {
        var cut = RenderComponent<SuperBanner>(p => p.AddChildContent("Outage"));
        var root = cut.Find("div.super-banner");
        Assert.Equal("alert", root.GetAttribute("role"));
    }

    [Fact]
    public void HorizontalScroller_renders_role_region_with_tabindex_zero()
    {
        var cut = RenderComponent<HorizontalScroller>(p => p.Add(x => x.Label, "Gallery").AddChildContent("x"));
        var root = cut.Find("div.horizontal-scroller");
        Assert.Equal("region", root.GetAttribute("role"));
    }

    [Fact]
    public void Mockup_components_render_div_wrappers()
    {
        var cut = RenderComponent<MockupBrowser>(p => p.AddChildContent("screenshot"));
        Assert.NotNull(cut.Find("div.mockup-browser"));
    }

    [Fact]
    public void GoToTop_renders_anchor_with_href()
    {
        var cut = RenderComponent<GoToTop>(p => p
            .Add(x => x.Href, "#top")
            .AddChildContent("Top"));
        var anchor = cut.Find("a.go-to-top");
        Assert.Equal("#top", anchor.GetAttribute("href"));
    }

    [Fact]
    public void CssClass_param_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Container>(p => p
            .Add(x => x.CssClass, "highlighted")
            .AddChildContent("x"));
        var root = cut.Find(".container");
        Assert.Contains("highlighted", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root_element()
    {
        var cut = RenderComponent<Container>(p => p
            .AddUnmatched("data-foo", "bar")
            .AddChildContent("x"));
        var root = cut.Find(".container");
        Assert.Equal("bar", root.GetAttribute("data-foo"));
    }
}
