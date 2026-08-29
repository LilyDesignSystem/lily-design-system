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
    public void Components_category_filter_shows_exactly_the_components_in_that_category()
    {
        var cut = RenderComponent<ComponentsPage>();
        var expected = ComponentData.Components.Count(c => c.Category == "tables");

        cut.Find("#category-filter").Change("tables");

        var links = cut.FindAll("a[href^='/components/']");
        Assert.Equal(expected, links.Count);
        Assert.True(links.Count > 0);
    }

    [Fact]
    public void Components_suffix_filter_shows_exactly_the_slugs_ending_in_that_suffix()
    {
        var cut = RenderComponent<ComponentsPage>();
        var expected = ComponentData.Components.Count(c => SuffixPattern.Of(c.Slug) == "picker-button");

        cut.Find("#suffix-filter").Change("picker-button");

        var links = cut.FindAll("a[href^='/components/']");
        Assert.Equal(expected, links.Count);
        Assert.True(links.Count > 0);
        foreach (var link in links)
        {
            var slug = link.GetAttribute("href")!.Replace("/components/", "");
            Assert.Equal("picker-button", SuffixPattern.Of(slug));
        }
    }

    [Fact]
    public void Components_category_suffix_and_search_combine_as_an_intersection()
    {
        var expectedSlugs = ComponentData.Components
            .Where(c => c.Category == "pickers"
                && SuffixPattern.Of(c.Slug) == "picker-button"
                && c.Name.Contains("star", StringComparison.OrdinalIgnoreCase))
            .Select(c => c.Slug)
            .OrderBy(s => s)
            .ToList();

        // Guard: skip only if a future catalog change removes every
        // star + picker-button component (mirrors the canonical
        // Playwright spec's test.skip behaviour).
        if (expectedSlugs.Count == 0) return;

        var cut = RenderComponent<ComponentsPage>();
        cut.Find("#category-filter").Change("pickers");
        cut.Find("#suffix-filter").Change("picker-button");
        cut.Find("#search").Input("star");

        var actualSlugs = cut.FindAll("a[href^='/components/']")
            .Select(a => a.GetAttribute("href")!.Replace("/components/", ""))
            .OrderBy(s => s)
            .ToList();

        Assert.Equal(expectedSlugs, actualSlugs);

        cut.Find("button.button").Click();
        Assert.Equal(string.Empty, cut.Find("#category-filter").GetAttribute("value") ?? string.Empty);
        var links = cut.FindAll("a[href^='/components/']");
        Assert.Equal(ComponentData.Components.Count, links.Count);
    }

    [Fact]
    public void Components_clear_filters_button_only_appears_when_a_filter_is_active()
    {
        var cut = RenderComponent<ComponentsPage>();
        Assert.Empty(cut.FindAll("button.button"));

        cut.Find("#search").Input("breadcrumb");
        Assert.Single(cut.FindAll("button.button"));
    }

    [Fact]
    public void Components_status_region_reports_filtered_and_total_counts()
    {
        var cut = RenderComponent<ComponentsPage>();
        var total = ComponentData.Components.Count;
        var status = cut.Find("[role='status']");
        Assert.Equal($"{total} of {total} components", status.TextContent);

        cut.Find("#search").Input("breadcrumb");
        var filteredCount = ComponentData.Components.Count(c =>
            c.Name.Contains("breadcrumb", StringComparison.OrdinalIgnoreCase) ||
            c.Slug.Contains("breadcrumb", StringComparison.OrdinalIgnoreCase) ||
            c.Description.Contains("breadcrumb", StringComparison.OrdinalIgnoreCase));
        status = cut.Find("[role='status']");
        Assert.Equal($"{filteredCount} of {total} components", status.TextContent);
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
