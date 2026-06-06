// ThemePicker tests — one [Fact] per spec.md §7 acceptance criterion.

using System.Collections.Generic;
using System.Threading.Tasks;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class ThemePickerTests : TestContext
{
    private static readonly string[] Themes = { "light", "dark", "abyss" };
    private const string UrlTrailing = "/assets/themes/";
    private const string UrlNoTrailing = "/assets/themes";

    public ThemePickerTests()
    {
        // bUnit JSInterop defaults to Strict; relax so the eval call
        // does not throw during render. Tests inspect invocations.
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
    }

    // -----------------------------------------------------------------
    // §7.1 — Renders a <fieldset> with role=radiogroup.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_1_Renders_Fieldset_With_Radiogroup_Role()
    {
        var cut = RenderComponent<ThemePicker>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes));

        var root = cut.Find("fieldset");
        Assert.Equal("radiogroup", root.GetAttribute("role"));
        Assert.Contains("theme-picker", root.GetAttribute("class") ?? "");
    }

    // -----------------------------------------------------------------
    // §7.2 — aria-label is the supplied Label.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_2_AriaLabel_Is_Label()
    {
        var cut = RenderComponent<ThemePicker>(p => p
            .Add(x => x.Label, "Choose theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes));

        Assert.Equal("Choose theme", cut.Find("fieldset").GetAttribute("aria-label"));
    }

    // -----------------------------------------------------------------
    // §7.3 — One radio per theme, sharing the supplied Name.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_3_One_Radio_Per_Theme_Sharing_Name()
    {
        var cut = RenderComponent<ThemePicker>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.Name, "appearance"));

        var radios = cut.FindAll("input[type=radio]");
        Assert.Equal(3, radios.Count);
        foreach (var r in radios)
        {
            Assert.Equal("appearance", r.GetAttribute("name"));
        }
    }

    // -----------------------------------------------------------------
    // §7.4 — Each radio carries the slug as its value attribute.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_4_Radio_Value_Is_Slug()
    {
        var cut = RenderComponent<ThemePicker>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes));

        var radios = cut.FindAll("input[type=radio]");
        Assert.Equal("light", radios[0].GetAttribute("value"));
        Assert.Equal("dark", radios[1].GetAttribute("value"));
        Assert.Equal("abyss", radios[2].GetAttribute("value"));
    }

    // -----------------------------------------------------------------
    // §7.5 — Default labels title-case the slug; "default" never appears;
    //        ThemeLabels overrides the default rendering.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_5_Default_Labels_TitleCase_And_Overrideable()
    {
        var cut = RenderComponent<ThemePicker>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, new[] { "light", "dark" }));

        var text = cut.Markup;
        Assert.Contains("Light", text);
        Assert.Contains("Dark", text);
        Assert.DoesNotContain("default", text, System.StringComparison.OrdinalIgnoreCase);

        var cut2 = RenderComponent<ThemePicker>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, new[] { "light", "dark" })
            .Add(x => x.ThemeLabels,
                (IReadOnlyDictionary<string, string>)new Dictionary<string, string>
                {
                    ["light"] = "Bright",
                    ["dark"] = "Midnight",
                }));
        Assert.Contains("Bright", cut2.Markup);
        Assert.Contains("Midnight", cut2.Markup);
    }

    // -----------------------------------------------------------------
    // §7.6 — Resolved initial value is "light" when present, else themes[0],
    //        and ValueChanged fires with that value.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_6_Initial_Value_Resolves_To_Light_Or_First()
    {
        var observed = "";
        var cut = RenderComponent<ThemePicker>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => observed = v)));

        await Task.Yield();
        Assert.Equal("light", observed);

        var observed2 = "";
        var cut2 = RenderComponent<ThemePicker>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, new[] { "dark", "abyss" })
            .Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => observed2 = v)));
        await Task.Yield();
        Assert.Equal("dark", observed2);
    }

    // -----------------------------------------------------------------
    // §7.7 — The first interop eval call carries the constructed href.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_7_Interop_Fires_With_Constructed_Href()
    {
        var cut = RenderComponent<ThemePicker>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes));

        await Task.Yield();

        var calls = JSInterop.Invocations;
        var voidCall = false;
        foreach (var inv in calls)
        {
            if (inv.Identifier == "eval" && inv.Arguments.Count > 0
                && inv.Arguments[0] is string s
                && s.Contains("/assets/themes/light.css"))
            {
                voidCall = true;
                break;
            }
        }
        Assert.True(voidCall, "Expected an eval interop call carrying /assets/themes/light.css");
    }

    // -----------------------------------------------------------------
    // §7.8 — Selecting a different radio updates Value, invokes interop
    //        with the new href, and fires OnChange / ValueChanged.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_8_Selecting_Radio_Updates_Value_And_Fires_Callbacks()
    {
        var changed = "";
        var valueChanged = "";
        var cut = RenderComponent<ThemePicker>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.OnChange,
                EventCallback.Factory.Create<string>(this, v => changed = v))
            .Add(x => x.ValueChanged,
                EventCallback.Factory.Create<string>(this, v => valueChanged = v)));
        await Task.Yield();

        var radios = cut.FindAll("input[type=radio]");
        await radios[2].ChangeAsync(new() { Value = "abyss" });

        Assert.Equal("abyss", changed);
        Assert.Equal("abyss", valueChanged);

        var sawAbyss = false;
        foreach (var inv in JSInterop.Invocations)
        {
            if (inv.Identifier == "eval" && inv.Arguments.Count > 0
                && inv.Arguments[0] is string s
                && s.Contains("/assets/themes/abyss.css"))
            {
                sawAbyss = true;
                break;
            }
        }
        Assert.True(sawAbyss, "Expected an eval interop call carrying /assets/themes/abyss.css");
    }

    // -----------------------------------------------------------------
    // §7.9 — When StorageKey is set, the interop call carries the key.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_9_StorageKey_Embedded_In_Apply_Script()
    {
        var script = ThemePicker.BuildApplyScript("theme", "/assets/themes/dark.css", "dark", "lily-theme");
        Assert.Contains("localStorage.setItem(\"lily-theme\"", script);
        Assert.Contains("\"dark\"", script);

        var noKey = ThemePicker.BuildApplyScript("theme", "/assets/themes/dark.css", "dark", null);
        Assert.DoesNotContain("localStorage.setItem", noKey);

        // End-to-end: render with StorageKey and confirm the interop
        // call surface mentions the key.
        var cut = RenderComponent<ThemePicker>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.StorageKey, "lily-theme"));
        await Task.Yield();

        var sawKey = false;
        foreach (var inv in JSInterop.Invocations)
        {
            if (inv.Identifier == "eval" && inv.Arguments.Count > 0
                && inv.Arguments[0] is string s
                && s.Contains("\"lily-theme\""))
            {
                sawKey = true;
                break;
            }
        }
        Assert.True(sawKey, "Expected an eval interop call carrying the storage key");
    }

    // -----------------------------------------------------------------
    // §7.10 — Supplied non-empty Value wins over storage and defaults.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_10_Explicit_Value_Wins()
    {
        var observed = "";
        var cut = RenderComponent<ThemePicker>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.Value, "abyss")
            .Add(x => x.DefaultValue, "light")
            .Add(x => x.StorageKey, "lily-theme")
            .Add(x => x.ValueChanged,
                EventCallback.Factory.Create<string>(this, v => observed = v)));
        await Task.Yield();

        // Confirm the interop call applied "abyss", not "light".
        var sawAbyss = false;
        foreach (var inv in JSInterop.Invocations)
        {
            if (inv.Identifier == "eval" && inv.Arguments.Count > 0
                && inv.Arguments[0] is string s
                && s.Contains("/assets/themes/abyss.css"))
            {
                sawAbyss = true;
                break;
            }
        }
        Assert.True(sawAbyss, "Expected Value='abyss' to be applied");
    }

    // -----------------------------------------------------------------
    // §7.11 — Missing trailing slash on ThemesUrl still yields one slash.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_11_Url_Normalisation()
    {
        Assert.Equal("/assets/themes/", ThemePicker.NormaliseThemesUrl(UrlTrailing));
        Assert.Equal("/assets/themes/", ThemePicker.NormaliseThemesUrl(UrlNoTrailing));
        Assert.Equal("/a/light.css", ThemePicker.ThemeHref("/a", "light", ".css"));
        Assert.Equal("/a/light.css", ThemePicker.ThemeHref("/a/", "light", ".css"));
    }

    // -----------------------------------------------------------------
    // §7.12 — Extra attributes spread onto the <fieldset>.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_12_AdditionalAttributes_Spread()
    {
        var cut = RenderComponent<ThemePicker>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .AddUnmatched("data-testid", "tp"));

        Assert.Equal("tp", cut.Find("fieldset").GetAttribute("data-testid"));
    }

    // -----------------------------------------------------------------
    // §7.13 — Custom ChildContent receives ThemePickerContext.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_13_ChildContent_Receives_Context()
    {
        RenderFragment<ThemePickerContext> custom = ctx => builder =>
        {
            builder.OpenElement(0, "div");
            builder.AddAttribute(1, "data-testid", "custom");
            builder.AddAttribute(2, "data-name", ctx.Name);
            builder.AddContent(3, string.Join(",", ctx.Themes));
            builder.CloseElement();
        };

        var cut = RenderComponent<ThemePicker>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.Name, "scheme")
            .Add(x => x.ChildContent, custom));

        var div = cut.Find("[data-testid='custom']");
        Assert.Equal("scheme", div.GetAttribute("data-name"));
        Assert.Contains("light,dark,abyss", div.TextContent);
    }
}
