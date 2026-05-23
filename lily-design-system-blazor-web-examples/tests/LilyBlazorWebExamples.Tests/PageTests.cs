using Bunit;
using LilyBlazorWebExamples.Components.Pages;
using LilyBlazorWebExamples.Data;
using Xunit;
using ComponentsPage = LilyBlazorWebExamples.Components.Pages.Components;

namespace LilyBlazorWebExamples.Tests;

public class PageTests : TestContext
{
    [Fact]
    public void Home_renders_h1()
    {
        var cut = RenderComponent<Home>();
        Assert.NotNull(cut.Find("h1"));
    }

    [Fact]
    public void Components_renders_h1()
    {
        var cut = RenderComponent<ComponentsPage>();
        Assert.NotNull(cut.Find("h1"));
    }

    [Fact]
    public void Components_renders_a_link_per_catalog_entry()
    {
        var cut = RenderComponent<ComponentsPage>();
        var links = cut.FindAll("a[href^='/components/']");
        Assert.Equal(ComponentData.Components.Count, links.Count);
    }

    [Fact]
    public void ContactForm_renders_h1()
    {
        var cut = RenderComponent<ContactForm>();
        Assert.NotNull(cut.Find("h1"));
    }

    [Fact]
    public void Dashboard_renders_h1()
    {
        var cut = RenderComponent<Dashboard>();
        Assert.NotNull(cut.Find("h1"));
    }

    [Fact]
    public void DialogFlow_renders_h1()
    {
        var cut = RenderComponent<DialogFlow>();
        Assert.NotNull(cut.Find("h1"));
    }

    [Fact]
    public void FileUploadForm_renders_h1()
    {
        var cut = RenderComponent<FileUploadForm>();
        Assert.NotNull(cut.Find("h1"));
    }

    [Fact]
    public void NavigationAndMenus_renders_h1()
    {
        var cut = RenderComponent<NavigationAndMenus>();
        Assert.NotNull(cut.Find("h1"));
    }

    [Fact]
    public void PageLayout_renders_h1()
    {
        var cut = RenderComponent<PageLayout>();
        Assert.NotNull(cut.Find("h1"));
    }

    [Fact]
    public void RatingAndFeedback_renders_h1()
    {
        var cut = RenderComponent<RatingAndFeedback>();
        Assert.NotNull(cut.Find("h1"));
    }

    [Fact]
    public void SearchAndFilter_renders_h1()
    {
        var cut = RenderComponent<SearchAndFilter>();
        Assert.NotNull(cut.Find("h1"));
    }

    [Fact]
    public void SettingsPage_renders_h1()
    {
        var cut = RenderComponent<SettingsPage>();
        Assert.NotNull(cut.Find("h1"));
    }

    [Fact]
    public void TabbedInterface_renders_h1()
    {
        var cut = RenderComponent<TabbedInterface>();
        Assert.NotNull(cut.Find("h1"));
    }

    [Fact]
    public void TaskManagement_renders_h1()
    {
        var cut = RenderComponent<TaskManagement>();
        Assert.NotNull(cut.Find("h1"));
    }

    [Fact]
    public void TimelineAndCards_renders_h1()
    {
        var cut = RenderComponent<TimelineAndCards>();
        Assert.NotNull(cut.Find("h1"));
    }
}

public class ComponentDetailPageTests : TestContext
{
    public static IEnumerable<object[]> AllCatalogSlugs =>
        ComponentData.Components.Select(c => new object[] { c.Slug, c.Name });

    [Theory]
    [MemberData(nameof(AllCatalogSlugs))]
    public void ComponentDetail_renders_h1_with_component_name_for_each_slug(string slug, string name)
    {
        var cut = RenderComponent<ComponentDetail>(p => p.Add(x => x.Slug, slug));
        var h1 = cut.Find("h1");
        Assert.Equal(name, h1.TextContent.Trim());
    }

    [Theory]
    [MemberData(nameof(AllCatalogSlugs))]
    public void ComponentDetail_renders_back_link_for_each_slug(string slug, string _name)
    {
        var cut = RenderComponent<ComponentDetail>(p => p.Add(x => x.Slug, slug));
        var back = cut.Find("a[href='/components']");
        Assert.NotNull(back);
    }
}
