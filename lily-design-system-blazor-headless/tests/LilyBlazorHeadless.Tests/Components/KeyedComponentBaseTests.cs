using System.Reflection;
using LilyBlazorHeadless.Components;
using Microsoft.JSInterop;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// Blazor reads [JSInvokable] from the runtime type without inheriting it, so the entry points the keys module calls must
// stay non-virtual methods of KeyedComponentBase, and a derived component overrides the protected hook instead. Breaking
// this fails only in a real browser (bUnit calls the C# method directly), so it is pinned here.
public class KeyedComponentBaseTests
{
    private static readonly string[] EntryPoints = ["OnKeyedChange", "OnKeyedCrop", "OnKeyedOpen", "OnKeyedSelect"];

    [Fact]
    public void The_entry_points_are_invokable_and_not_virtual()
    {
        foreach (var name in EntryPoints)
        {
            var method = typeof(KeyedComponentBase).GetMethod(name, BindingFlags.Public | BindingFlags.Instance)!;
            Assert.NotNull(method.GetCustomAttribute<JSInvokableAttribute>());
            Assert.False(method.IsVirtual && !method.IsFinal, $"{name} must not be virtual");
        }
    }

    [Fact]
    public void No_keyed_component_redeclares_an_entry_point()
    {
        var keyed = typeof(KeyedComponentBase).Assembly.GetTypes()
            .Where(t => t.IsSubclassOf(typeof(KeyedComponentBase)))
            .ToList();
        Assert.NotEmpty(keyed);
        foreach (var type in keyed)
            foreach (var name in EntryPoints)
                Assert.Null(type.GetMethod(name, BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly));
    }
}
