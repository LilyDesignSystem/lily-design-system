using System.Reflection;
using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// The components whose popup is the Popover module: after the first render they attach it, and from then on a change to
// their open parameter is sent to it with set, once per change. Disposing releases the handle, and a circuit that has
// already gone is not an error. Combobox, which also attaches keys, has its own tests.
public class PopoverSyncTests : TestContext
{
    public static TheoryData<string, string> Popups => new()
    {
        { nameof(ActionGroup), nameof(ActionGroup.OverflowOpen) },
        { nameof(ContextMenu), nameof(ContextMenu.Open) },
        { nameof(ContextualHelp), nameof(ContextualHelp.Expanded) },
        { nameof(DropdownMenu), nameof(DropdownMenu.Open) },
        { nameof(Popover), nameof(Popover.Open) },
        { nameof(Popup), nameof(Popup.Open) },
        { nameof(SplitButton), nameof(SplitButton.MenuOpen) },
    };

    private Task Run(string scenario, string name, string parameter)
    {
        var type = typeof(Popover).Assembly.GetTypes().Single(t => t.Name == name && typeof(IComponent).IsAssignableFrom(t));
        var method = GetType().GetMethod(scenario, BindingFlags.NonPublic | BindingFlags.Instance)!.MakeGenericMethod(type);
        return (Task)method.Invoke(this, [parameter])!;
    }

    // ActionGroup has a popup only when it has an overflow menu to put in it.
    private IRenderedComponent<T> Mount<T>(string parameter, bool open) where T : IComponent
    {
        var parameters = new List<ComponentParameter> { ComponentParameter.CreateParameter(parameter, open) };
        if (typeof(T) == typeof(ActionGroup))
            parameters.Add(ComponentParameter.CreateParameter(nameof(ActionGroup.Overflow), (RenderFragment)(b => b.AddContent(0, "More"))));
        return RenderComponent<T>([.. parameters]);
    }

    private BunitJSModuleInterop Handle()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        return JSInterop.SetupModule(Popover.ModulePath).SetupModule("attach", _ => true);
    }

    private Task SendsEachChangeOnce<T>(string parameter) where T : IComponent
    {
        var handle = Handle();
        var cut = Mount<T>(parameter, false);
        Assert.DoesNotContain(handle.Invocations, i => i.Identifier == "set");
        foreach (var open in new[] { true, true, false })
            cut.SetParametersAndRender(ComponentParameter.CreateParameter(parameter, open));
        var sets = handle.Invocations.Where(i => i.Identifier == "set").Select(i => (bool)i.Arguments[0]!).ToList();
        Assert.Equal([true, false], sets);
        return Task.CompletedTask;
    }

    private async Task ReleasesTheHandle<T>(string parameter) where T : IComponent
    {
        var handle = Handle();
        var cut = Mount<T>(parameter, false);
        await ((IAsyncDisposable)cut.Instance).DisposeAsync();
        Assert.Contains(handle.Invocations, i => i.Identifier == "dispose");
    }

    private async Task ToleratesADisconnectedCircuit<T>(string parameter) where T : IComponent
    {
        var handle = Handle();
        handle.SetupVoid("dispose").SetException(new JSDisconnectedException("The circuit has gone."));
        var cut = Mount<T>(parameter, false);
        await ((IAsyncDisposable)cut.Instance).DisposeAsync();
    }

    [Theory, MemberData(nameof(Popups))]
    public Task A_change_to_the_open_parameter_is_sent_once(string name, string parameter) =>
        Run(nameof(SendsEachChangeOnce), name, parameter);

    [Theory, MemberData(nameof(Popups))]
    public Task Disposing_releases_the_handle(string name, string parameter) =>
        Run(nameof(ReleasesTheHandle), name, parameter);

    [Theory, MemberData(nameof(Popups))]
    public Task A_disconnected_circuit_during_disposal_is_not_an_error(string name, string parameter) =>
        Run(nameof(ToleratesADisconnectedCircuit), name, parameter);
}
