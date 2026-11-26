using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>An item that tells its record list whether it counts as an entry (HC-C17).</summary>
public interface IRecordEntry
{
    /// <summary>Whether the item is an entry for the list's status: not when it is withdrawn.</summary>
    bool Counts { get; }

    /// <summary>Raised when <see cref="Counts"/> changes.</summary>
    event EventHandler? CountsChanged;
}

/// <summary>
/// RecordList (components/record-list): the shape every clinical list shares, and the base of <see cref="AllergyRecordList"/>.
/// It is never blank: for any status but known its status words are its one item, and it is named by its label or those
/// words. "None known" beside an entry is a contradiction: the entry stays, the words go, and <see cref="ConflictLabel"/>, the
/// app's words for it, takes their place (HC-C17). Put items in <see cref="Items"/> (the XAML content).
/// Style hooks: <c>record-list</c>, <c>record-list-coverage</c>, <c>record-list-status</c>, <c>record-list-items</c>.
/// </summary>
[ContentProperty(nameof(Items))]
public class RecordList : VerticalStackLayout
{
    /// <summary>The status. Required.</summary>
    public static readonly BindableProperty StatusProperty = Create(nameof(Status), typeof(RecordListStatus), RecordListStatus.Known);

    /// <summary>The status in words ("No known allergies"); names the list, and is its one item unless known. Required.</summary>
    public static readonly BindableProperty StatusLabelProperty = Create(nameof(StatusLabel), typeof(string), string.Empty);

    /// <summary>The list's name, when it should differ from the status words.</summary>
    public static readonly BindableProperty LabelProperty = Create(nameof(Label), typeof(string), null);

    /// <summary>What the list is a view of (its window, its order, what is left out), shown first.</summary>
    public static readonly BindableProperty CoverageLabelProperty = Create(nameof(CoverageLabel), typeof(string), null);

    /// <summary>The app's words for a list that says none are known and holds an entry; shown instead of the status words.</summary>
    public static readonly BindableProperty ConflictLabelProperty = Create(nameof(ConflictLabel), typeof(string), null);

    private readonly Label coverage = Lily.Text("record-list-coverage");
    private readonly Label statusItem = Lily.Text("record-list-status");
    private readonly VerticalStackLayout items = new() { StyleClass = ["record-list-items"] };
    private readonly string kind;

    /// <summary>Creates an empty list.</summary>
    public RecordList()
        : this("record-list", "RecordList")
    {
    }

    /// <summary>For a subclass: its own class hook and name in warnings.</summary>
    protected RecordList(string styleClass, string kind)
    {
        this.kind = kind;
        StyleClass = [styleClass];
        coverage.StyleClass = [styleClass + "-coverage"];
        statusItem.StyleClass = [styleClass + "-status"];
        items.StyleClass = [styleClass + "-items"];
        Children.Add(coverage);
        Children.Add(statusItem);
        Children.Add(items);
        items.ChildAdded += (_, e) => Watch(e.Element, true);
        items.ChildRemoved += (_, e) => Watch(e.Element, false);
        Update();
        Loaded += (_, _) => LilyWarnings.Warn(Warnings);
    }

    /// <inheritdoc cref="StatusProperty"/>
    public RecordListStatus Status { get => (RecordListStatus)GetValue(StatusProperty); set => SetValue(StatusProperty, value); }

    /// <inheritdoc cref="StatusLabelProperty"/>
    public string StatusLabel { get => (string)GetValue(StatusLabelProperty); set => SetValue(StatusLabelProperty, value); }

    /// <inheritdoc cref="LabelProperty"/>
    public string? Label { get => (string?)GetValue(LabelProperty); set => SetValue(LabelProperty, value); }

    /// <inheritdoc cref="CoverageLabelProperty"/>
    public string? CoverageLabel { get => (string?)GetValue(CoverageLabelProperty); set => SetValue(CoverageLabelProperty, value); }

    /// <inheritdoc cref="ConflictLabelProperty"/>
    public string? ConflictLabel { get => (string?)GetValue(ConflictLabelProperty); set => SetValue(ConflictLabelProperty, value); }

    /// <summary>The items (record list items, or any view, which does not count as an entry).</summary>
    public IList<IView> Items => items.Children;

    /// <summary>Whether an item that counts is in the list.</summary>
    public bool HasEntries => items.Children.OfType<IRecordEntry>().Any(e => e.Counts);

    /// <summary>Raised when what the list shows may have changed: its status, words or entries.</summary>
    public event EventHandler? Changed;

    /// <summary>Whether the list says none are known while holding an entry.</summary>
    public bool IsConflict { get; private set; }

    /// <summary>The development warnings for the current properties and items.</summary>
    public IReadOnlyList<string> Warnings => RecordRules.ListWarnings(kind, StatusLabel, Status, ConflictLabel, HasEntries);

    private static BindableProperty Create(string property, Type type, object? initial) =>
        BindableProperty.Create(property, type, typeof(RecordList), initial, propertyChanged: (b, _, _) => ((RecordList)b).Update());

    private void Watch(Element element, bool added)
    {
        if (element is IRecordEntry entry)
        {
            if (added) entry.CountsChanged += OnCountsChanged;
            else entry.CountsChanged -= OnCountsChanged;
        }
        Update();
    }

    private void OnCountsChanged(object? sender, EventArgs e) => Update();

    private void Update()
    {
        var (name, item, conflict) = RecordRules.Shown(Status, StatusLabel, ConflictLabel, Label, HasEntries);
        IsConflict = conflict;
        coverage.Text = CoverageLabel;
        coverage.IsVisible = !string.IsNullOrEmpty(CoverageLabel);
        statusItem.Text = item;
        statusItem.IsVisible = item is not null;
        items.IsVisible = RecordRules.ShowsEntries(Status);
        SemanticProperties.SetDescription(this, name);
        Changed?.Invoke(this, EventArgs.Empty);
    }
}

/// <summary>
/// RecordListItem (components/record-list-item): one record. Its parts are read in order: whose record (when it is not the
/// patient's), the entry state, the content (unless withheld), the status, the update. A record entered in error is struck
/// through: every label inside the content is drawn with a line through it. Style hooks: <c>record-list-item</c>,
/// <c>-subject</c>, <c>-entry-state</c>, <c>-status</c>, <c>-updated</c>.
/// </summary>
public class RecordListItem : VerticalStackLayout, IRecordEntry
{
    /// <summary>Whose record it is, when it is not the patient's ("Mother"); first.</summary>
    public static readonly BindableProperty SubjectLabelProperty = Create(nameof(SubjectLabel), typeof(string), null);

    /// <summary>The record's status, as the app's code (for styling); <see cref="StatusLabel"/> is its words.</summary>
    public static readonly BindableProperty RecordStatusProperty = Create(nameof(RecordStatus), typeof(string), null);

    /// <summary>The record's status in words; required with a code.</summary>
    public static readonly BindableProperty StatusLabelProperty = Create(nameof(StatusLabel), typeof(string), null);

    /// <summary>When it was updated, in the app's words.</summary>
    public static readonly BindableProperty UpdatedLabelProperty = Create(nameof(UpdatedLabel), typeof(string), null);

    /// <summary>Withheld or entered in error.</summary>
    public static readonly BindableProperty EntryStateProperty = Create(nameof(EntryState), typeof(RecordEntryState?), null);

    /// <summary>The entry state in words; required with a state.</summary>
    public static readonly BindableProperty EntryStateLabelProperty = Create(nameof(EntryStateLabel), typeof(string), null);

    /// <summary>The record itself, usually a Lily view.</summary>
    public static readonly BindableProperty ContentProperty = Create(nameof(Content), typeof(View), null);

    private readonly Label subject = Lily.Text("record-list-item-subject");
    private readonly Label entryState = Lily.Text("record-list-item-entry-state");
    private readonly ContentView content = new() { StyleClass = ["record-list-item-content"] };
    private readonly Label status = Lily.Text("record-list-item-status");
    private readonly Label updated = Lily.Text("record-list-item-updated");
    private bool counts = true;

    /// <summary>Creates an empty item.</summary>
    public RecordListItem()
    {
        StyleClass = ["record-list-item"];
        foreach (var v in new View[] { subject, entryState, content, status, updated }) Children.Add(v);
        Update();
        Loaded += (_, _) => LilyWarnings.Warn(RecordRules.ItemWarnings(RecordStatus, StatusLabel, EntryState, EntryStateLabel));
    }

    /// <inheritdoc/>
    public event EventHandler? CountsChanged;

    /// <inheritdoc/>
    public bool Counts => counts;

    /// <inheritdoc cref="SubjectLabelProperty"/>
    public string? SubjectLabel { get => (string?)GetValue(SubjectLabelProperty); set => SetValue(SubjectLabelProperty, value); }

    /// <inheritdoc cref="RecordStatusProperty"/>
    public string? RecordStatus { get => (string?)GetValue(RecordStatusProperty); set => SetValue(RecordStatusProperty, value); }

    /// <inheritdoc cref="StatusLabelProperty"/>
    public string? StatusLabel { get => (string?)GetValue(StatusLabelProperty); set => SetValue(StatusLabelProperty, value); }

    /// <inheritdoc cref="UpdatedLabelProperty"/>
    public string? UpdatedLabel { get => (string?)GetValue(UpdatedLabelProperty); set => SetValue(UpdatedLabelProperty, value); }

    /// <inheritdoc cref="EntryStateProperty"/>
    public RecordEntryState? EntryState { get => (RecordEntryState?)GetValue(EntryStateProperty); set => SetValue(EntryStateProperty, value); }

    /// <inheritdoc cref="EntryStateLabelProperty"/>
    public string? EntryStateLabel { get => (string?)GetValue(EntryStateLabelProperty); set => SetValue(EntryStateLabelProperty, value); }

    /// <inheritdoc cref="ContentProperty"/>
    public View? Content { get => (View?)GetValue(ContentProperty); set => SetValue(ContentProperty, value); }

    private static BindableProperty Create(string property, Type type, object? initial) =>
        BindableProperty.Create(property, type, typeof(RecordListItem), initial, propertyChanged: (b, _, _) => ((RecordListItem)b).Update());

    private static void Show(Label label, string? text)
    {
        label.Text = text;
        label.IsVisible = !string.IsNullOrEmpty(text);
    }

    private static void Strike(IView view, bool strike)
    {
        if (view is Label label) label.TextDecorations = strike ? TextDecorations.Strikethrough : TextDecorations.None;
        if (view is Layout layout) foreach (var child in layout.Children) Strike(child, strike);
        if (view is ContentView cv && cv.Content is not null) Strike(cv.Content, strike);
    }

    private void Update()
    {
        Show(subject, SubjectLabel);
        Show(entryState, EntryState is null ? null : EntryStateLabel);
        content.Content = Content;
        content.IsVisible = RecordRules.ShowsContent(EntryState);
        if (Content is not null) Strike(Content, RecordRules.StrikesContent(EntryState));
        Show(status, StatusLabel);
        Show(updated, UpdatedLabel);
        var now = !RecordRules.IsWithdrawn(RecordStatus, EntryState);
        if (now == counts) return;
        counts = now;
        CountsChanged?.Invoke(this, EventArgs.Empty);
    }
}

/// <summary>
/// AllergyRecordList (components/allergy-record-list): a record list of allergies and intolerances, never blank, with the same
/// conflict rule (HC-C17). Style hooks: <c>allergy-record-list</c> and its <c>-coverage</c>, <c>-status</c>, <c>-items</c>.
/// </summary>
public class AllergyRecordList : RecordList
{
    /// <summary>Creates an empty list.</summary>
    public AllergyRecordList()
        : base("allergy-record-list", "AllergyRecordList")
    {
    }
}

/// <summary>
/// AllergyRecordListItem (components/allergy-record-list-item): one allergy, one screen-reader stop speaking its words in
/// order, whose record it is first; <see cref="Extra"/> (a link to the full record) follows as its own stops. A code without
/// its words is a development warning. Refuted or entered in error, it does not count against "none known".
/// Style hooks: <c>allergy-record-list-item</c>, <c>-record</c>, <c>-subject</c>, <c>-substance</c>, <c>-detail</c>.
/// </summary>
public class AllergyRecordListItem : VerticalStackLayout, IRecordEntry
{
    /// <summary>The substance and every part's words, in the app's language. Required.</summary>
    public static readonly BindableProperty WordsProperty = Create(nameof(Words), typeof(AllergyWords));

    /// <summary>The FHIR codes, when there are any; each needs its words in <see cref="Words"/>.</summary>
    public static readonly BindableProperty CodesProperty = Create(nameof(Codes), typeof(AllergyCodes));

    /// <summary>Anything else, such as a link to the full record; its own stops.</summary>
    public static readonly BindableProperty ExtraProperty = Create(nameof(Extra), typeof(View));

    private readonly VerticalStackLayout record = new() { StyleClass = ["allergy-record-list-item-record"] };
    private readonly ContentView extra = new();
    private bool counts = true;

    /// <summary>Creates an item; set <see cref="Words"/>.</summary>
    public AllergyRecordListItem()
    {
        StyleClass = ["allergy-record-list-item"];
        Children.Add(record);
        Children.Add(extra);
        Update();
        Loaded += (_, _) => LilyWarnings.Warn(Words is null ? [] : RecordRules.AllergyWarnings(Codes ?? new(), Words));
    }

    /// <inheritdoc/>
    public event EventHandler? CountsChanged;

    /// <inheritdoc/>
    public bool Counts => counts;

    /// <inheritdoc cref="WordsProperty"/>
    public AllergyWords? Words { get => (AllergyWords?)GetValue(WordsProperty); set => SetValue(WordsProperty, value); }

    /// <inheritdoc cref="CodesProperty"/>
    public AllergyCodes? Codes { get => (AllergyCodes?)GetValue(CodesProperty); set => SetValue(CodesProperty, value); }

    /// <inheritdoc cref="ExtraProperty"/>
    public View? Extra { get => (View?)GetValue(ExtraProperty); set => SetValue(ExtraProperty, value); }

    private static BindableProperty Create(string property, Type type) =>
        BindableProperty.Create(property, type, typeof(AllergyRecordListItem), null, propertyChanged: (b, _, _) => ((AllergyRecordListItem)b).Update());

    private void Update()
    {
        record.Children.Clear();
        if (Words is { } w)
        {
            if (!string.IsNullOrEmpty(w.Subject)) record.Children.Add(Lily.Hidden(Lily.Text("allergy-record-list-item-subject", w.Subject)));
            record.Children.Add(Lily.Hidden(Lily.Text("allergy-record-list-item-substance", w.Substance)));
            foreach (var detail in new[] { w.Reaction, w.Severity, w.Criticality, w.ClinicalStatus, w.VerificationStatus, w.Type, w.Category, w.Updated })
                if (!string.IsNullOrEmpty(detail)) record.Children.Add(Lily.Hidden(Lily.Text("allergy-record-list-item-detail", detail)));
            Lily.OneStop(record, RecordRules.AllergySpoken(w));
        }
        extra.Content = Extra;
        var now = !RecordRules.IsWithdrawn(Codes);
        if (now == counts) return;
        counts = now;
        CountsChanged?.Invoke(this, EventArgs.Empty);
    }
}
