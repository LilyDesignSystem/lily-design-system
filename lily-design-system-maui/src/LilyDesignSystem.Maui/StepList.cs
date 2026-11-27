using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>
/// StepList (components/step-list): the steps of a task and where the person is. Each step is one screen-reader stop that says
/// its name then its status in the app's words, never by colour or a tick alone (tasks.md P62-T3). Style hooks: <c>step-list</c>,
/// <c>step-list-item</c> with <c>step-list-item-{status}</c>, <c>step-list-item-name</c>, <c>step-list-item-status</c>.
/// </summary>
public class StepList : VerticalStackLayout
{
    private IReadOnlyList<string> steps = [];
    private int current;
    private Func<string, string> statusLabel = s => s;
    private string labelText = "";

    /// <summary>Creates a step list; set <see cref="Label"/>, <see cref="Steps"/> and <see cref="StatusLabel"/>.</summary>
    public StepList()
    {
        StyleClass = ["step-list"];
        Spacing = 6;
    }

    /// <summary>The list's spoken name ("Questions").</summary>
    public string Label { get => labelText; set { labelText = value; Rebuild(); } }

    /// <summary>Each step's name, in order.</summary>
    public IReadOnlyList<string> Steps { get => steps; set { steps = value; Rebuild(); } }

    /// <summary>The current step's index, from 0.</summary>
    public int Current { get => current; set { current = value; Rebuild(); } }

    /// <summary>The words for each status ("finished", "in-progress", "waiting"), spoken after the step's name.</summary>
    public Func<string, string> StatusLabel { get => statusLabel; set { statusLabel = value; Rebuild(); } }

    /// <summary>Each step's status, by the shared rules; a current index out of range is a warning and every step waiting.</summary>
    public static IReadOnlyList<string> Statuses(int count, int current)
    {
        try
        {
            return [.. Enumerable.Range(0, count).Select(i => FormParts.StepStatus(i, current))];
        }
        catch (FormPartsException)
        {
            LilyWarnings.Warn([$"StepList: current {current} is not a step"]);
            return [.. Enumerable.Repeat("waiting", count)];
        }
    }

    private void Rebuild()
    {
        SemanticProperties.SetDescription(this, Label);
        Children.Clear();
        var statuses = Statuses(Steps.Count, Current);
        for (var i = 0; i < Steps.Count; i++)
        {
            var words = StatusLabel(statuses[i]);
            var row = new HorizontalStackLayout
            {
                Spacing = 8,
                StyleClass = ["step-list-item", $"step-list-item-{statuses[i]}"],
                Children = { Lily.Hidden(Lily.Text("step-list-item-name", Steps[i])), Lily.Hidden(Lily.Text("step-list-item-status", words)) },
            };
            Lily.OneStop(row, LilySemantics.Spoken(Steps[i], words));
            Children.Add(row);
        }
    }
}
