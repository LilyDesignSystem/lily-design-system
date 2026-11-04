using System.Collections.Generic;
using Bunit;
using LilyDesignSystem.Blazor.Helpers;
using LilyDesignSystem.Blazor.Testing;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class LinkPickerPatternTests : TestContext
{
    [Fact]
    public void Meets_the_picker_disclosure_contract()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        var cut = RenderComponent<LinkPicker>(p => p
            .Add(x => x.Label, "Picker")
            .Add(x => x.Links, new List<LinkItem> { new LinkItem { Label = "Home", Href = "/" } }));
        PatternTester.Run(cut, "picker-disclosure", "link-picker");
    }
}
