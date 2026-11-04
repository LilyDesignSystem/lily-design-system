using Bunit;
using LilyDesignSystem.Blazor.Helpers;
using LilyDesignSystem.Blazor.Testing;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class ThemePickerPatternTests : TestContext
{
    [Fact]
    public void Meets_the_picker_listbox_contract()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        var cut = RenderComponent<ThemePicker>(p => p
            .Add(x => x.Label, "Picker")
            .Add(x => x.Themes, new[] { "abyss", "dark", "light" })
            .Add(x => x.Value, "abyss")
            .Add(x => x.ThemesUrl, "/t/"));
        PatternTester.Run(cut, "picker-listbox", "theme-picker");
    }
}
