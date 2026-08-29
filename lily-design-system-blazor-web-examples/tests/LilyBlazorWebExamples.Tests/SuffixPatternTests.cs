using LilyBlazorWebExamples.Data;
using Xunit;

namespace LilyBlazorWebExamples.Tests;

// Ported from the canonical Svelte reference:
// lily-design-system-svelte-sveltekit-examples/src/lib/data/suffix-pattern.test.ts
public class SuffixPatternTests
{
    [Fact]
    public void Matches_the_most_specific_longest_suffix_first()
    {
        Assert.Equal("table-th", SuffixPattern.Of("data-table-th"));
        Assert.Equal("table-head", SuffixPattern.Of("data-table-head"));
        Assert.Equal("list-item", SuffixPattern.Of("breadcrumb-list-item"));
        Assert.Equal("list", SuffixPattern.Of("breadcrumb-list"));
        Assert.Equal("table-thead", SuffixPattern.Of("gantt-table-thead"));
    }

    [Fact]
    public void Matches_real_compound_families()
    {
        Assert.Equal("picker-button", SuffixPattern.Of("five-star-rating-picker-button"));
        Assert.Equal("picker", SuffixPattern.Of("five-star-rating-picker"));
        Assert.Equal("select-option", SuffixPattern.Of("theme-select-option"));
        Assert.Equal("select", SuffixPattern.Of("theme-select"));
    }

    [Fact]
    public void Falls_back_to_standalone_for_a_leaf_component_with_no_suffix_family()
    {
        Assert.Equal(SuffixPattern.StandaloneId, SuffixPattern.Of("badge"));
        Assert.Equal(SuffixPattern.StandaloneId, SuffixPattern.Of("hero"));
    }

    [Fact]
    public void Has_a_label_for_every_id_it_can_return_including_every_catalog_slug()
    {
        foreach (var c in ComponentData.Components)
        {
            var id = SuffixPattern.Of(c.Slug);
            Assert.True(
                SuffixPattern.Label.ContainsKey(id) && !string.IsNullOrEmpty(SuffixPattern.Label[id]),
                $"missing label for suffix id \"{id}\" (from {c.Slug})");
        }
    }

    [Fact]
    public void Declares_every_pattern_id_exactly_once()
    {
        var ids = SuffixPattern.Patterns.Select(p => p.Id).ToList();
        Assert.Equal(ids.Count, ids.Distinct().Count());
    }
}
