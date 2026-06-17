// TextSizeSelect tests — one [Fact] per spec.md §7 acceptance criterion.

using System.Collections.Generic;
using System.Threading.Tasks;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class TextSizeSelectTests : TestContext
{
    private static readonly string[] Sizes = { "small", "medium", "large", "x-large" };

    public TextSizeSelectTests()
    {
        // Loose JSInterop: the apply-script eval and the localStorage
        // probe should not block render.
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
    }

    // -----------------------------------------------------------------
    // §7.1 — Renders a native <select> (no role attribute).
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_1_Renders_Select()
    {
        var cut = RenderComponent<TextSizeSelect>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes));

        var root = cut.Find("select");
        Assert.Null(root.GetAttribute("role"));
        Assert.Contains("text-size-select", root.GetAttribute("class") ?? "");
    }

    // -----------------------------------------------------------------
    // §7.2 — aria-label is the supplied Label.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_2_AriaLabel_Is_Label()
    {
        var cut = RenderComponent<TextSizeSelect>(p => p
            .Add(x => x.Label, "Choose text size")
            .Add(x => x.Sizes, Sizes));

        Assert.Equal("Choose text size", cut.Find("select").GetAttribute("aria-label"));
    }

    // -----------------------------------------------------------------
    // §7.3 — One option per size; the <select> carries the supplied Name.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_3_One_Option_Per_Size_Select_Has_Name()
    {
        var cut = RenderComponent<TextSizeSelect>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes)
            .Add(x => x.Name, "size"));

        var options = cut.FindAll("option");
        Assert.Equal(Sizes.Length, options.Count);
        Assert.Equal("size", cut.Find("select").GetAttribute("name"));
    }

    // -----------------------------------------------------------------
    // §7.3b — Default Name is "text-size".
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_3_Default_Name_Is_TextSize()
    {
        var cut = RenderComponent<TextSizeSelect>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes));

        Assert.Equal("text-size", cut.Find("select").GetAttribute("name"));
    }

    // -----------------------------------------------------------------
    // §7.4 — Each option carries the slug as its value.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_4_Option_Value_Is_Slug()
    {
        var cut = RenderComponent<TextSizeSelect>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes));

        var options = cut.FindAll("option");
        for (int i = 0; i < Sizes.Length; i++)
        {
            Assert.Equal(Sizes[i], options[i].GetAttribute("value"));
        }
    }

    // -----------------------------------------------------------------
    // §7.5 — Default labels title-case the slug; SizeLabels overrides.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_5_Default_Labels_TitleCase_And_Override()
    {
        var cut = RenderComponent<TextSizeSelect>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes));
        // Default: "x-large" → "X Large", "small" → "Small".
        Assert.Contains("X Large", cut.Markup);
        Assert.Contains("Small", cut.Markup);

        var cut2 = RenderComponent<TextSizeSelect>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, new[] { "small", "large" })
            .Add(x => x.SizeLabels,
                (IReadOnlyDictionary<string, string>)new Dictionary<string, string>
                {
                    ["small"] = "Compact",
                    ["large"] = "Comfortable",
                }));
        Assert.Contains("Compact", cut2.Markup);
        Assert.Contains("Comfortable", cut2.Markup);
    }

    // §7.5b — TitleCase pure helper drops the "default" word.
    [Fact]
    public void Section_7_5_TitleCase_Drops_Default_Word()
    {
        Assert.Equal("X Large", TextSizeSelect.TitleCase("x-large"));
        Assert.Equal("Medium", TextSizeSelect.TitleCase("medium"));
        Assert.Equal("Large", TextSizeSelect.TitleCase("default-large"));
    }

    // -----------------------------------------------------------------
    // §7.6 — Initial value defaults to "medium" if present, else Sizes[0].
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_6_Initial_Value_Prefers_Medium()
    {
        var observed = "";
        var cut = RenderComponent<TextSizeSelect>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes)
            .Add(x => x.OnChange,
                EventCallback.Factory.Create<string>(this, v => observed = v)));
        await Task.Yield();

        Assert.Equal("medium", observed);

        var firstObserved = "";
        var cut2 = RenderComponent<TextSizeSelect>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, new[] { "compact", "cozy" })
            .Add(x => x.OnChange,
                EventCallback.Factory.Create<string>(this, v => firstObserved = v)));
        await Task.Yield();

        Assert.Equal("compact", firstObserved);
    }

    // -----------------------------------------------------------------
    // §7.7 — Applies data-text-size to document.documentElement after render.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_7_Applies_DataTextSize_On_First_Render()
    {
        var cut = RenderComponent<TextSizeSelect>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes));
        await Task.Yield();

        var sawApply = false;
        foreach (var inv in JSInterop.Invocations)
        {
            if (inv.Identifier == "eval" && inv.Arguments.Count > 0
                && inv.Arguments[0] is string s
                && s.Contains("setAttribute('data-text-size',\"medium\")"))
            {
                sawApply = true;
                break;
            }
        }
        Assert.True(sawApply, "Expected an interop eval call setting data-text-size=medium");
    }

    // §7.7b — BuildApplyScript sets data-text-size to the slug.
    [Fact]
    public void Section_7_7_Apply_Script_Sets_DataTextSize()
    {
        var script = TextSizeSelect.BuildApplyScript("large", storageKey: null);
        Assert.Contains("setAttribute('data-text-size',\"large\")", script);
    }

    // -----------------------------------------------------------------
    // §7.8 — Selecting an option updates Value, fires OnChange /
    //         ValueChanged, and invokes interop with the new slug.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_8_Selecting_Option_Fires_Callbacks()
    {
        var changed = "";
        var valueChanged = "";
        var cut = RenderComponent<TextSizeSelect>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes)
            .Add(x => x.OnChange,
                EventCallback.Factory.Create<string>(this, v => changed = v))
            .Add(x => x.ValueChanged,
                EventCallback.Factory.Create<string>(this, v => valueChanged = v)));
        await Task.Yield();

        cut.Find("select").Change("x-large");

        Assert.Equal("x-large", changed);
        Assert.Equal("x-large", valueChanged);

        var sawSize = false;
        foreach (var inv in JSInterop.Invocations)
        {
            if (inv.Identifier == "eval" && inv.Arguments.Count > 0
                && inv.Arguments[0] is string s
                && s.Contains("setAttribute('data-text-size',\"x-large\")"))
            {
                sawSize = true;
                break;
            }
        }
        Assert.True(sawSize, "Expected an interop eval call setting data-text-size=x-large");
    }

    // -----------------------------------------------------------------
    // §7.9 — When StorageKey is set, the apply-script writes to localStorage.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_9_StorageKey_Embedded_In_Apply_Script()
    {
        var with = TextSizeSelect.BuildApplyScript("large", storageKey: "lily-text-size");
        Assert.Contains("localStorage.setItem(\"lily-text-size\",\"large\")", with);

        var without = TextSizeSelect.BuildApplyScript("large", storageKey: null);
        Assert.DoesNotContain("localStorage.setItem", without);
    }

    // -----------------------------------------------------------------
    // §7.10 — A supplied non-empty Value wins over storage and defaults.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_10_Explicit_Value_Wins()
    {
        var observed = "";
        var cut = RenderComponent<TextSizeSelect>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes)
            .Add(x => x.Value, "large")
            .Add(x => x.DefaultValue, "small")
            .Add(x => x.StorageKey, "lily-text-size")
            .Add(x => x.OnChange,
                EventCallback.Factory.Create<string>(this, v => observed = v)));
        await Task.Yield();

        Assert.Equal("large", observed);

        var sawLarge = false;
        foreach (var inv in JSInterop.Invocations)
        {
            if (inv.Identifier == "eval" && inv.Arguments.Count > 0
                && inv.Arguments[0] is string s
                && s.Contains("setAttribute('data-text-size',\"large\")"))
            {
                sawLarge = true;
                break;
            }
        }
        Assert.True(sawLarge, "Expected Value=large to be applied as data-text-size=large");
    }

    // -----------------------------------------------------------------
    // §7.12 — Extra attributes spread onto the <select>.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_12_AdditionalAttributes_Spread()
    {
        var cut = RenderComponent<TextSizeSelect>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes)
            .AddUnmatched("data-testid", "ts"));

        Assert.Equal("ts", cut.Find("select").GetAttribute("data-testid"));
    }

    // -----------------------------------------------------------------
    // §7.13 — Custom ChildContent receives TextSizeSelectContext.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_13_ChildContent_Receives_Context()
    {
        // Render an <option> (a valid <select> child) so the parser keeps it.
        RenderFragment<TextSizeSelectContext> custom = ctx => builder =>
        {
            builder.OpenElement(0, "option");
            builder.AddAttribute(1, "data-testid", "custom");
            builder.AddAttribute(2, "data-name", ctx.Name);
            builder.AddAttribute(3, "data-label-x-large", ctx.LabelFor("x-large"));
            builder.AddContent(4, string.Join(",", ctx.Sizes));
            builder.CloseElement();
        };

        var cut = RenderComponent<TextSizeSelect>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes)
            .Add(x => x.Name, "size")
            .Add(x => x.ChildContent, custom));

        var opt = cut.Find("[data-testid='custom']");
        Assert.Equal("size", opt.GetAttribute("data-name"));
        Assert.Equal("X Large", opt.GetAttribute("data-label-x-large"));
        Assert.Contains("small,medium,large,x-large", opt.TextContent);
    }
}
