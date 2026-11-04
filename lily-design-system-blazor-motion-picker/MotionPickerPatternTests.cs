using Bunit;
using LilyDesignSystem.Blazor.Helpers;
using LilyDesignSystem.Blazor.Testing;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class MotionPickerPatternTests : TestContext
{
    [Fact]
    public void Meets_the_picker_listbox_contract()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        var cut = RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Picker")
            .Add(x => x.Motions, new[] { "full", "none", "reduced" })
            .Add(x => x.Value, "full"));
        PatternTester.Run(cut, "picker-listbox", "motion-picker");
    }
}
