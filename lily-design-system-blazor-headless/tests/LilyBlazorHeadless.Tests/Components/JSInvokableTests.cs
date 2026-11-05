using System.Reflection;
using LilyBlazorHeadless.Components;
using Microsoft.JSInterop;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

/// <summary>
/// Blazor reads [JSInvokable] from the runtime type without inheriting it, so an override of an invokable method cannot
/// be reached from JS. Neither bUnit, which calls the method directly, nor tests/js, which has no C#, can see that, so it
/// is checked here by reflection. e2e/widget-keys.spec.ts proves the path in a browser.
/// </summary>
public class JSInvokableTests
{
    [Fact]
    public void No_override_hides_an_invokable_method_from_JS()
    {
        var hidden = new List<string>();
        foreach (var type in typeof(KeyedComponentBase).Assembly.GetTypes())
        {
            foreach (var method in type.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly))
            {
                var root = method.GetBaseDefinition();
                if (root != method && root.IsDefined(typeof(JSInvokableAttribute), false)
                    && !method.IsDefined(typeof(JSInvokableAttribute), false))
                {
                    hidden.Add($"{type.Name}.{method.Name}");
                }
            }
        }
        Assert.Empty(hidden);
    }

    [Theory]
    [InlineData(typeof(Splitter))]
    [InlineData(typeof(SplitView))]
    [InlineData(typeof(Cascader))]
    [InlineData(typeof(TreeSelect))]
    [InlineData(typeof(MentionsInput))]
    [InlineData(typeof(ImageCropper))]
    public void Keyed_components_reach_the_entry_points_JS_calls(Type type)
    {
        foreach (var name in new[] { "OnKeyedChange", "OnKeyedCrop", "OnKeyedOpen", "OnKeyedSelect" })
        {
            Assert.True(type.GetMethod(name)!.IsDefined(typeof(JSInvokableAttribute), false), name);
        }
    }
}
