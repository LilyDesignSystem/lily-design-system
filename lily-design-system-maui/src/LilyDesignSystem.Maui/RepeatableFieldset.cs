using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>
/// RepeatableFieldset (components/repeatable-fieldset): the "add another" pattern, a question answered with a list of the same
/// fields, such as each medicine a person takes. Each item is a group with a heading and its remove button; the add button
/// follows. The remove buttons go at <see cref="Min"/>, the add button is disabled at <see cref="Max"/>, and each change is
/// announced in the app's words, when given (tasks.md P62-T3). Style hooks: <c>repeatable-fieldset</c>,
/// <c>repeatable-fieldset-legend</c>, <c>repeatable-fieldset-item</c>, <c>repeatable-fieldset-item-legend</c>,
/// <c>repeatable-fieldset-remove</c>, <c>repeatable-fieldset-add</c>.
/// </summary>
public class RepeatableFieldset<T> : VerticalStackLayout
{
    private readonly Label legend = Lily.Text("repeatable-fieldset-legend");
    private readonly VerticalStackLayout list = new() { Spacing = 12 };
    private readonly Button add = new() { StyleClass = ["repeatable-fieldset-add"] };

    /// <summary>Creates the fieldset; set the words, <see cref="NewItem"/> and <see cref="ItemView"/>.</summary>
    public RepeatableFieldset()
    {
        StyleClass = ["repeatable-fieldset"];
        Spacing = 12;
        SemanticProperties.SetHeadingLevel(legend, SemanticHeadingLevel.Level2);
        add.Clicked += (_, _) => Add();
        Children.Add(legend);
        Children.Add(list);
        Children.Add(add);
    }

    /// <summary>Names the whole list ("Your medicines").</summary>
    public string Legend { get => legend.Text; set { legend.Text = value; Rebuild(); } }

    /// <summary>The app's items; changed in place by the buttons, then <see cref="ItemsChanged"/> is raised.</summary>
    public List<T> Items { get; set { field = value; Rebuild(); } } = [];

    /// <summary>Makes an item when the add button is pressed.</summary>
    public Func<T>? NewItem { get; set; }

    /// <summary>One item's fields, given the item and its index from 0.</summary>
    public Func<T, int, View>? ItemView { get; set { field = value; Rebuild(); } }

    /// <summary>Each item's name, from 1 ("Medicine 2").</summary>
    public Func<int, string> ItemLegend { get; set { field = value; Rebuild(); } } = n => n.ToString(System.Globalization.CultureInfo.CurrentCulture);

    /// <summary>The add button's words ("Add a medicine").</summary>
    public string AddLabel { get => add.Text; set { add.Text = value; Rebuild(); } }

    /// <summary>Each remove button's words, from 1 ("Remove medicine 2").</summary>
    public Func<int, string> RemoveLabel { get; set { field = value; Rebuild(); } } = _ => "";

    /// <summary>The fewest items: the remove buttons go at it.</summary>
    public int Min { get; set { field = value; Rebuild(); } }

    /// <summary>The most items, or none: the add button is disabled at it.</summary>
    public int? Max { get; set { field = value; Rebuild(); } }

    /// <summary>What is announced after an add, from 1 ("Medicine 3 added").</summary>
    public Func<int, string>? AddedLabel { get; set; }

    /// <summary>What is announced after a remove, from 1.</summary>
    public Func<int, string>? RemovedLabel { get; set; }

    /// <summary>Raised after an add or a remove.</summary>
    public event EventHandler? ItemsChanged;

    /// <summary>Each item's remove button, in order: for the app's own styling and for tests.</summary>
    public IReadOnlyList<Button> RemoveButtons { get; private set; } = [];

    /// <summary>The add button.</summary>
    public Button AddButton => add;

    private (bool Add, bool Remove) Allowed()
    {
        try
        {
            return (FormParts.CanAddItem(Items.Count, Max), FormParts.CanRemoveItem(Items.Count, Min));
        }
        catch (FormPartsException e)
        {
            LilyWarnings.Warn([$"RepeatableFieldset: {e.Reason} is not a whole number"]);
            return (false, false);
        }
    }

    private void Add()
    {
        if (NewItem is null || !Allowed().Add) return;
        Items.Add(NewItem());
        Rebuild();
        ItemsChanged?.Invoke(this, EventArgs.Empty);
        if (AddedLabel is not null) LilyAnnouncer.Current.Announce(AddedLabel(Items.Count));
    }

    private void Remove(int index)
    {
        if (!Allowed().Remove) return;
        Items.RemoveAt(index);
        Rebuild();
        ItemsChanged?.Invoke(this, EventArgs.Empty);
        if (RemovedLabel is not null) LilyAnnouncer.Current.Announce(RemovedLabel(index + 1));
    }

    private void Rebuild()
    {
        var allowed = Allowed();
        SemanticProperties.SetDescription(this, Legend);
        add.IsEnabled = allowed.Add;
        list.Children.Clear();
        var removes = new List<Button>();
        for (var i = 0; i < Items.Count; i++)
        {
            var index = i;
            var heading = Lily.Text("repeatable-fieldset-item-legend", ItemLegend(index + 1));
            SemanticProperties.SetHeadingLevel(heading, SemanticHeadingLevel.Level3);
            var item = new VerticalStackLayout { Spacing = 8, StyleClass = ["repeatable-fieldset-item"], Children = { heading } };
            if (ItemView is not null) item.Children.Add(ItemView(Items[index], index));
            if (allowed.Remove)
            {
                var remove = new Button { Text = RemoveLabel(index + 1), StyleClass = ["repeatable-fieldset-remove"] };
                remove.Clicked += (_, _) => Remove(index);
                item.Children.Add(remove);
                removes.Add(remove);
            }
            list.Children.Add(item);
        }
        RemoveButtons = removes;
    }
}
