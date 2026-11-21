// ThemePicker — spec §5.6 "Follow this device" and §5.7 the theme cookie (ported from the Svelte reference, 2026-11-16).

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bunit;
using Bunit.JSInterop;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class ThemePickerSystemTests : TestContext
{
    // In the order the picker lists them: alphabetical by the name shown (spec/theme-picker, "Order of themes").
    private static readonly string[] Themes = { "abyss", "dark", "light" };

    public ThemePickerSystemTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
    }

    /// <summary>The device's answer to <c>prefers-color-scheme: dark</c>.</summary>
    private void Device(bool dark) => JSInterop.Setup<bool?>("eval", _ => true).SetResult(dark);

    /// <summary>What <c>document.cookie</c> and <c>localStorage</c> return.</summary>
    private void Stored(string? cookie, string? storage)
    {
        JSInterop.Setup<string?>("eval", i => Script(i).Contains("return document.cookie")).SetResult(cookie);
        JSInterop.Setup<string?>("eval", i => Script(i).Contains("localStorage.getItem")).SetResult(storage);
    }

    private static string Script(JSRuntimeInvocation i) => i.Arguments.Count > 0 ? i.Arguments[0]?.ToString() ?? "" : "";

    /// <summary>The apply scripts run so far, oldest first.</summary>
    private List<string> Applied() => JSInterop.Invocations
        .Where(i => i.Identifier == "eval" && Script(i).Contains("setAttribute('data-theme'"))
        .Select(Script)
        .ToList();

    private static bool Sets(string script, string theme) => script.Contains($"setAttribute('data-theme',\"{theme}\")");

    private IRenderedComponent<ThemePicker> Render(Action<ComponentParameterCollectionBuilder<ThemePicker>>? more = null)
        => RenderComponent<ThemePicker>(p =>
        {
            p.Add(x => x.Label, "Theme").Add(x => x.ThemesUrl, "/assets/themes/").Add(x => x.Themes, Themes);
            more?.Invoke(p);
        });

    private static Action<ComponentParameterCollectionBuilder<ThemePicker>> WithSystem(
        Action<ComponentParameterCollectionBuilder<ThemePicker>>? more = null)
        => p =>
        {
            p.Add(x => x.SystemLabel, "Follow this device");
            more?.Invoke(p);
        };

    private static void Choose(IRenderedComponent<ThemePicker> cut, string name)
    {
        cut.Find(".theme-picker-button").Click();
        cut.FindAll(".theme-picker-option").First(o => o.TextContent.Trim() == name).Click();
    }

    [Fact(DisplayName = "§7.35 SystemLabel adds a first option, value system, with its own class hook")]
    public void SystemOptionFirst()
    {
        var cut = Render(WithSystem());
        var options = cut.FindAll(".theme-picker-option");
        Assert.Equal(new[] { "Follow this device", "Abyss", "Dark", "Light" }, options.Select(o => o.TextContent.Trim()));
        Assert.Contains("theme-picker-option-system", options[0].ClassList);
        Assert.DoesNotContain("theme-picker-option-system", options[1].ClassList);
    }

    [Fact(DisplayName = "§7.35 without SystemLabel there is no such option")]
    public void NoSystemOptionWithoutLabel()
    {
        var cut = Render();
        Assert.Equal(3, cut.FindAll(".theme-picker-option").Count);
        Assert.Empty(cut.FindAll(".theme-picker-option-system"));
    }

    [Fact(DisplayName = "§7.36 with SystemLabel and nothing kept, the picker follows the device")]
    public void StartsFollowingTheDevice()
    {
        Device(true);
        string? bound = null;
        var cut = Render(WithSystem(p => p
            .Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => bound = v))));
        cut.WaitForAssertion(() => Assert.Equal(ThemePicker.SystemTheme, bound));
        Assert.True(Sets(Applied().Last(), "dark"));
        Assert.Single(JSInterop.Invocations, i => i.Identifier == "__lilyThemePickerWatch");
    }

    [Fact(DisplayName = "§7.37 while following, a device switch changes the theme")]
    public async Task FollowsADeviceSwitch()
    {
        Device(false);
        var changed = new List<string>();
        var cut = Render(WithSystem(p => p
            .Add(x => x.Value, ThemePicker.SystemTheme)
            .Add(x => x.OnChange, EventCallback.Factory.Create<string>(this, v => changed.Add(v)))));
        cut.WaitForAssertion(() => Assert.True(Sets(Applied().Last(), "light")));
        await cut.InvokeAsync(() => cut.Instance.OnColorSchemeChanged(true));
        Assert.True(Sets(Applied().Last(), "dark"));
        Assert.Equal("dark", changed.Last());
    }

    [Fact(DisplayName = "§7.37 choosing a theme stops following the device, and so does disposing")]
    public async Task ChoosingStopsFollowing()
    {
        Device(false);
        var cut = Render(WithSystem());
        cut.WaitForAssertion(() => Assert.Single(JSInterop.Invocations, i => i.Identifier == "__lilyThemePickerWatch"));
        Choose(cut, "Abyss");
        cut.WaitForAssertion(() => Assert.True(Sets(Applied().Last(), "abyss")));
        Assert.Single(JSInterop.Invocations, i => i.Identifier == "__lilyThemePickerUnwatch");
        await cut.InvokeAsync(() => cut.Instance.OnColorSchemeChanged(true));
        Assert.True(Sets(Applied().Last(), "abyss"));

        Choose(cut, "Follow this device");
        cut.WaitForAssertion(() => Assert.Equal(2, JSInterop.Invocations.Count(i => i.Identifier == "__lilyThemePickerWatch")));
        await cut.Instance.DisposeAsync();
        Assert.Equal(2, JSInterop.Invocations.Count(i => i.Identifier == "__lilyThemePickerUnwatch"));
    }

    [Fact(DisplayName = "§7.38 SystemThemes chooses which themes the device maps to")]
    public void SystemThemesMap()
    {
        Device(true);
        var cut = Render(WithSystem(p => p.Add(x => x.SystemThemes, new ThemePickerSystemThemes("light", "abyss"))));
        cut.WaitForAssertion(() => Assert.True(Sets(Applied().Last(), "abyss")));
    }

    [Fact(DisplayName = "§7.39 the native select variant offers it too, followed by a separator")]
    public void SelectVariantHasIt()
    {
        var cut = Render(WithSystem(p => p.Add(x => x.Variant, "select")));
        var first = cut.FindAll("option")[0];
        Assert.Equal(ThemePicker.SystemTheme, first.GetAttribute("value"));
        Assert.Equal("Follow this device", first.TextContent.Trim());
        // AngleSharp (bUnit's parser) follows the older rule that drops <hr> inside <select>; browsers keep it, so the
        // rendered markup is what is checked.
        Assert.Contains("Follow this device</option><hr class=\"theme-picker-separator\"", cut.Markup.Replace("\n", "").Replace("  ", ""));
    }

    [Fact(DisplayName = "§7.40 a choice is written to the cookie: the choice, not the theme it applies")]
    public void CookieKeepsTheChoice()
    {
        Device(true);
        var cut = Render(WithSystem(p => p.Add(x => x.CookieName, "theme")));
        cut.WaitForAssertion(() => Assert.True(Sets(Applied().Last(), "dark")));
        // The starting choice is not written: a first visit sets no cookie.
        Assert.DoesNotContain("document.cookie", Applied().Last());
        Choose(cut, "Dark");
        cut.WaitForAssertion(() => Assert.Contains("theme=dark; Path=/; Max-Age=34560000; SameSite=Lax", Applied().Last()));
        Assert.Contains("location.protocol==='https:'", Applied().Last());
        Choose(cut, "Follow this device");
        cut.WaitForAssertion(() => Assert.Contains("theme=system; Path=/", Applied().Last()));
    }

    [Fact(DisplayName = "§7.44 with no StorageKey or CookieName, a choice is kept in both, under lily-{Name}")]
    public void KeptInBothByDefault()
    {
        var cut = Render();
        cut.WaitForAssertion(() => Assert.True(Sets(Applied().Last(), "light")));
        Choose(cut, "Abyss");
        cut.WaitForAssertion(() => Assert.True(Sets(Applied().Last(), "abyss")));
        Assert.Contains("localStorage.setItem(\"lily-theme\",\"abyss\")", Applied().Last());
        Assert.Contains("lily-theme=abyss; Path=/", Applied().Last());

        var brand = Render(p => p.Add(x => x.Name, "brand"));
        Choose(brand, "Dark");
        brand.WaitForAssertion(() => Assert.Contains("lily-brand=dark; Path=/", Applied().Last()));
    }

    [Fact(DisplayName = "§7.45 the first load stores nothing until the choice changes")]
    public void FirstLoadStoresNothing()
    {
        Device(true);
        var cut = Render(WithSystem());
        cut.WaitForAssertion(() => Assert.True(Sets(Applied().Last(), "dark")));
        Assert.All(Applied(), s => Assert.DoesNotContain("localStorage.setItem", s));
        Assert.All(Applied(), s => Assert.DoesNotContain("document.cookie=", s));
        // A device switch while following is not a new choice either.
        cut.InvokeAsync(() => cut.Instance.OnColorSchemeChanged(false)).Wait();
        Assert.True(Sets(Applied().Last(), "light"));
        Assert.DoesNotContain("localStorage.setItem", Applied().Last());
    }

    [Fact(DisplayName = "§7.46 an empty string turns either store off")]
    public void EmptyStringTurnsAStoreOff()
    {
        var cut = Render(p => p.Add(x => x.StorageKey, "").Add(x => x.CookieName, ""));
        cut.WaitForAssertion(() => Assert.True(Sets(Applied().Last(), "light")));
        Choose(cut, "Abyss");
        cut.WaitForAssertion(() => Assert.True(Sets(Applied().Last(), "abyss")));
        Assert.DoesNotContain("localStorage.setItem", Applied().Last());
        Assert.DoesNotContain("document.cookie=", Applied().Last());
    }

    [Fact(DisplayName = "§7.41 the cookie sets the starting choice, above localStorage")]
    public void CookieAboveStorage()
    {
        Stored("a=1; theme=abyss", "dark");
        var cut = Render(p => p.Add(x => x.CookieName, "theme").Add(x => x.StorageKey, "lily-theme"));
        cut.WaitForAssertion(() => Assert.True(Sets(Applied().Last(), "abyss")));
    }

    [Fact(DisplayName = "§7.42 a cookie that is not one of the choices is ignored")]
    public void ForgedCookieIgnored()
    {
        Stored("theme=..%2F..%2Fevil", null);
        var cut = Render(p => p.Add(x => x.CookieName, "theme"));
        cut.WaitForAssertion(() => Assert.True(Sets(Applied().Last(), "light")));
        Assert.DoesNotContain(Applied(), s => s.Contains("evil"));
    }

    [Fact(DisplayName = "§7.43 ThemeCookie and ReadThemeCookie")]
    public void CookieHelpers()
    {
        Assert.Equal("theme=dark; Path=/; Max-Age=34560000; SameSite=Lax", ThemePicker.ThemeCookie("theme", "dark"));
        Assert.EndsWith("; Secure", ThemePicker.ThemeCookie("theme", "dark", secure: true));
        Assert.Equal("dark", ThemePicker.ReadThemeCookie("a=1; theme=dark; b=2", "theme"));
        Assert.Equal("", ThemePicker.ReadThemeCookie("a=1; theme=dark", "theme", new[] { "light" }));
        Assert.Equal("", ThemePicker.ReadThemeCookie("mytheme=dark", "theme"));
        Assert.Equal("", ThemePicker.ReadThemeCookie(null, "theme"));
        Assert.Equal("dark", ThemePicker.ResolveTheme("system", true, new ThemePickerSystemThemes("light", "dark")));
        Assert.Equal("abyss", ThemePicker.ResolveTheme("abyss", false, new ThemePickerSystemThemes("light", "dark")));
    }
}
