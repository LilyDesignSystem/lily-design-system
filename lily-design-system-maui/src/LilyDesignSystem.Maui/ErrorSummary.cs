using System.Collections.ObjectModel;
using System.Collections.Specialized;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>One problem: what is wrong, in the app's words, and what to do when it is chosen (focus the field).</summary>
/// <param name="Message">What is wrong, in the app's language.</param>
/// <param name="OnSelected">The app's action: move focus to the field and scroll to it.</param>
public sealed record Problem(string Message, Action OnSelected);

/// <summary>
/// ErrorSummary (components/error-summary): the problems with a form, at the top after a failed submit. On the web it is
/// <c>role="alert"</c> and takes focus; here its title is a level-1 heading that takes screen-reader focus when the summary
/// is loaded, and each problem is a native button that runs the app's action. Style hooks: <c>error-summary</c>,
/// <c>error-summary-title</c>, <c>error-summary-problem</c>.
/// </summary>
public class ErrorSummary : VerticalStackLayout
{
    /// <summary>The heading ("There is a problem"), in the app's language.</summary>
    public static readonly BindableProperty TitleProperty = BindableProperty.Create(
        nameof(Title), typeof(string), typeof(ErrorSummary), string.Empty, propertyChanged: (b, _, n) => ((ErrorSummary)b).title.Text = (string)n);

    /// <summary>Move screen-reader focus to the title when the summary is loaded (default true, as the web focuses it).</summary>
    public static readonly BindableProperty FocusOnLoadedProperty = BindableProperty.Create(
        nameof(FocusOnLoaded), typeof(bool), typeof(ErrorSummary), true);

    private readonly Label title = Lily.Text("error-summary-title");

    /// <summary>Creates an empty summary; set <see cref="Title"/> and add to <see cref="Problems"/>.</summary>
    public ErrorSummary()
    {
        StyleClass = ["error-summary"];
        SemanticProperties.SetHeadingLevel(title, SemanticHeadingLevel.Level1);
        Children.Add(title);
        Problems.CollectionChanged += OnProblemsChanged;
        Loaded += (_, _) =>
        {
            if (FocusOnLoaded && title.Handler is not null) title.SetSemanticFocus();
        };
    }

    /// <inheritdoc cref="TitleProperty"/>
    public string Title { get => (string)GetValue(TitleProperty); set => SetValue(TitleProperty, value); }

    /// <inheritdoc cref="FocusOnLoadedProperty"/>
    public bool FocusOnLoaded { get => (bool)GetValue(FocusOnLoadedProperty); set => SetValue(FocusOnLoadedProperty, value); }

    /// <summary>The problems, in the order of the fields.</summary>
    public ObservableCollection<Problem> Problems { get; } = [];

    private void OnProblemsChanged(object? sender, NotifyCollectionChangedEventArgs e)
    {
        while (Children.Count > 1) Children.RemoveAt(1);
        foreach (var problem in Problems)
        {
            var button = new Button { Text = problem.Message, StyleClass = ["error-summary-problem"], LineBreakMode = LineBreakMode.WordWrap };
            button.Clicked += (_, _) => problem.OnSelected();
            Children.Add(button);
        }
    }
}
