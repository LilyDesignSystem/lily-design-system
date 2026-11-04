using Bunit;
using LilyDesignSystem.Blazor.Helpers;
using LilyDesignSystem.Blazor.Testing;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class LocalePickerPatternTests : TestContext
{
    [Fact]
    public void Meets_the_picker_listbox_contract()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        var cut = RenderComponent<LocalePicker>(p => p
            .Add(x => x.Label, "Picker")
            .Add(x => x.Locales, new[] { "de", "fr", "it" })
            .Add(x => x.Value, "de"));
        PatternTester.Run(cut, "picker-listbox", "locale-picker");
    }
}
