using System.Collections.Generic;
using Bunit;
using LilyDesignSystem.Blazor.Helpers;
using LilyDesignSystem.Blazor.Testing;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class SharePickerPatternTests : TestContext
{
    [Fact]
    public void Meets_the_picker_disclosure_contract()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        var cut = RenderComponent<SharePicker>(p => p
            .Add(x => x.Label, "Picker")
            .Add(x => x.Targets, new List<ShareTarget> { new ShareTarget { Id = "one", Label = "One", Href = (u, t, x) => "https://example.test/" } }));
        PatternTester.Run(cut, "picker-disclosure", "share-picker");
    }
}
