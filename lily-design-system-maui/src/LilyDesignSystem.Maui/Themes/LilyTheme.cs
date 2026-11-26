using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui.Themes;

/// <summary>
/// Puts a theme's tokens into a ResourceDictionary (usually <c>Application.Current.Resources</c>), so the app's styles read
/// them with <c>{DynamicResource lily-color-primary}</c> and a theme switch restyles every page. Lily's controls set no colour
/// themselves; the app's styles, keyed on the controls' style classes, use these resources.
/// </summary>
public static class LilyTheme
{
    /// <summary>Writes every token of <paramref name="tokens"/> into <paramref name="resources"/>, replacing any earlier theme's.</summary>
    public static void Apply(ResourceDictionary resources, LilyTokens tokens)
    {
        foreach (var (key, value) in tokens.Resources()) resources[key] = value;
        resources["lily-theme"] = tokens.Slug;
    }
}
