using Bunit;
using LilyDesignSystem.Blazor.Helpers;
using LilyDesignSystem.Blazor.Testing;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class TextSizePickerPatternTests : TestContext
{
    [Fact]
    public void Meets_the_picker_listbox_contract()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        var cut = RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Picker")
            .Add(x => x.Sizes, new[] { "large", "normal", "small" })
            .Add(x => x.Value, "large"));
        PatternTester.Run(cut, "picker-listbox", "text-size-picker");
    }
}
