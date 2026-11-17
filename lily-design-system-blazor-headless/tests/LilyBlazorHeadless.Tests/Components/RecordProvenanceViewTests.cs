using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class RecordProvenanceViewTests : TestContext
{
    [Fact]
    public void Renders_each_part_in_the_consumers_words_states_first()
    {
        var cut = RenderComponent<RecordProvenanceView>(p => p
            .Add(x => x.Attestation, "pending").Add(x => x.AttestationLabel, "Awaiting signature")
            .Add(x => x.Sync, "pending").Add(x => x.SyncLabel, "Saved on this device, not yet sent")
            .Add(x => x.Source, "device").Add(x => x.SourceLabel, "From a blood pressure monitor")
            .Add(x => x.AuthorLabel, "Dr A Patel")
            .Add(x => x.Observed, "2026-11-03T08:10").Add(x => x.ObservedLabel, "Measured 08:10")
            .Add(x => x.Recorded, "2026-11-03T09:00").Add(x => x.RecordedLabel, "Recorded 09:00")
            .Add(x => x.VersionLabel, "Version 2"));
        var root = cut.Find("span.record-provenance-view");
        Assert.Equal("pending", root.GetAttribute("data-attestation"));
        Assert.Equal("pending", root.GetAttribute("data-sync"));
        Assert.Equal("device", root.GetAttribute("data-source"));
        var parts = root.Children.Select(el => el.ClassName!.Replace("record-provenance-view-", "")).ToArray();
        Assert.Equal(new[] { "attestation", "sync", "source", "author", "observed", "recorded", "version" }, parts);
        Assert.Equal("2026-11-03T08:10", cut.Find(".record-provenance-view-observed").GetAttribute("datetime"));
    }

    [Fact]
    public void An_unsigned_record_shows_its_own_words_and_state()
    {
        var cut = RenderComponent<RecordProvenanceView>(p => p.Add(x => x.Attestation, "unsigned").Add(x => x.AttestationLabel, "Not signed"));
        Assert.Equal("unsigned", cut.Find("span").GetAttribute("data-attestation"));
        Assert.Equal("Not signed", cut.Find(".record-provenance-view-attestation").TextContent);
    }

    [Fact]
    public void Renders_no_part_and_no_data_attribute_it_was_not_given()
    {
        var root = RenderComponent<RecordProvenanceView>(p => p.Add(x => x.AuthorLabel, "Dr A Patel")).Find("span.record-provenance-view");
        Assert.False(root.HasAttribute("data-attestation"));
        Assert.Single(root.Children);
    }
}
