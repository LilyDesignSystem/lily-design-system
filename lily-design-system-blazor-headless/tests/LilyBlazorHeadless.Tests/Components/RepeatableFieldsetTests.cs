using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class RepeatableFieldsetTests : TestContext
{
    public RepeatableFieldsetTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private sealed class Medicine { public string Name { get; set; } = ""; }

    private IRenderedComponent<RepeatableFieldset<Medicine>> Make(List<Medicine> items, int min = 0, int? max = null, Action<IReadOnlyList<Medicine>>? changed = null) =>
        RenderComponent<RepeatableFieldset<Medicine>>(p => p
            .Add(x => x.Legend, "Medicines")
            .Add(x => x.Items, items)
            .Add(x => x.ItemsChanged, EventCallback.Factory.Create<IReadOnlyList<Medicine>>(this, next => changed?.Invoke(next)))
            .Add(x => x.NewItem, () => new Medicine())
            .Add(x => x.ItemLegend, n => $"Medicine {n}")
            .Add(x => x.AddLabel, "Add another medicine")
            .Add(x => x.RemoveLabel, n => $"Remove medicine {n}")
            .Add(x => x.AddedLabel, n => $"Medicine {n} added")
            .Add(x => x.RemovedLabel, n => $"Medicine {n} removed")
            .Add(x => x.Min, min)
            .Add(x => x.Max, max)
            .Add(x => x.ItemTemplate, ctx => builder =>
            {
                builder.OpenElement(0, "input");
                builder.AddAttribute(1, "value", ctx.Item.Name);
                builder.CloseElement();
            }));

    private static string[] Legends(IRenderedComponent<RepeatableFieldset<Medicine>> cut) =>
        cut.FindAll(".repeatable-fieldset-item > legend").Select(l => l.TextContent).ToArray();

    [Fact]
    public void Add_appends_an_item_renumbers_and_announces()
    {
        IReadOnlyList<Medicine>? changed = null;
        var cut = Make([new() { Name = "Aspirin" }], changed: next => changed = next);
        cut.Find(".repeatable-fieldset-add").Click();
        Assert.Equal(2, changed!.Count);
        Assert.Equal(new[] { "Medicine 1", "Medicine 2" }, Legends(cut));
        Assert.Equal("Medicine 2 added", cut.Find("[role=status]").TextContent);
    }

    [Fact]
    public void Remove_takes_out_that_item_and_keeps_the_others()
    {
        IReadOnlyList<Medicine>? changed = null;
        var cut = Make([new() { Name = "Aspirin" }, new() { Name = "Metformin" }, new() { Name = "Ramipril" }], changed: next => changed = next);
        cut.FindAll(".repeatable-fieldset-remove")[1].Click();
        Assert.Equal(new[] { "Aspirin", "Ramipril" }, changed!.Select(m => m.Name).ToArray());
        Assert.Equal(new[] { "Medicine 1", "Medicine 2" }, Legends(cut));
        Assert.Equal("Medicine 2 removed", cut.Find("[role=status]").TextContent);
    }

    [Fact]
    public void Min_leaves_out_the_remove_buttons_and_max_disables_add()
    {
        var cut = Make([new() { Name = "Aspirin" }], min: 1, max: 1);
        Assert.Empty(cut.FindAll(".repeatable-fieldset-remove"));
        Assert.True(cut.Find(".repeatable-fieldset-add").HasAttribute("disabled"));
    }
}
