using System.Reflection;
using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// Every component whose keys or observers live in a JavaScript module attaches a handle after its first render and must
// release it when it goes: dispose the handle, then the module. A circuit that has already gone (JSDisconnectedException)
// is not an error. bUnit runs no JavaScript, so this checks the calls the component makes.
public class ModuleDisposalTests : TestContext
{
    private static FieldInfo? ModulePathOf(Type type) =>
        type.GetField("ModulePath", BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy);

    // Components that load their module on a condition or by another name, each covered by its own tests.
    private static readonly Dictionary<string, string> Elsewhere = new()
    {
        ["ContentsNav"] = "attaches only with Spy",
        ["Drawer"] = "calls open, not attach, and only when opened",
        ["Combobox"] = "attaches the Popover module and attachDotNet",
        ["NavigationMenu"] = "attaches only with overflow navigation",
    };

    public static IEnumerable<object[]> ModuleComponents() =>
        typeof(Menu).Assembly.GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract && typeof(IComponent).IsAssignableFrom(t)
                && typeof(IAsyncDisposable).IsAssignableFrom(t) && ModulePathOf(t) is not null
                && !Elsewhere.ContainsKey(t.Name))
            .OrderBy(t => t.Name)
            .Select(t => new object[] { t.Name });

    private static Type Find(string name) => typeof(Menu).Assembly.GetTypes().Single(t => t.Name == name && typeof(IComponent).IsAssignableFrom(t));

    [Fact]
    public void Finds_the_module_components()
    {
        Assert.True(ModuleComponents().Count() >= 20);
    }

    [Theory, MemberData(nameof(ModuleComponents))]
    public async Task Disposing_releases_the_handle_and_the_module(string name)
    {
        var type = Find(name);
        JSInterop.Mode = JSRuntimeMode.Loose;
        var path = (string)ModulePathOf(type)!.GetValue(null)!;
        var module = JSInterop.SetupModule(path);
        var handle = module.SetupModule("attach", _ => true);

        var cut = Render(builder =>
        {
            builder.OpenComponent(0, type);
            builder.CloseComponent();
        });
        var instance = (IAsyncDisposable)cut.FindComponents<IComponent>().Select(c => c.Instance).First(i => i.GetType() == type);
        Assert.Contains(module.Invocations, i => i.Identifier == "attach");

        await instance.DisposeAsync();
        Assert.Contains(handle.Invocations, i => i.Identifier == "dispose");
    }

    [Theory, MemberData(nameof(ModuleComponents))]
    public async Task A_disconnected_circuit_during_disposal_is_not_an_error(string name)
    {
        var type = Find(name);
        JSInterop.Mode = JSRuntimeMode.Loose;
        var path = (string)ModulePathOf(type)!.GetValue(null)!;
        var module = JSInterop.SetupModule(path);
        var handle = module.SetupModule("attach", _ => true);
        handle.SetupVoid("dispose").SetException(new JSDisconnectedException("The circuit has gone."));

        var cut = Render(builder =>
        {
            builder.OpenComponent(0, type);
            builder.CloseComponent();
        });
        var instance = (IAsyncDisposable)cut.FindComponents<IComponent>().Select(c => c.Instance).First(i => i.GetType() == type);
        await instance.DisposeAsync();
    }
}
