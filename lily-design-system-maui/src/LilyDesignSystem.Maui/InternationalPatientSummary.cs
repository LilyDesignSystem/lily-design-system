using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>
/// InternationalPatientSummarySection (components/international-patient-summary-section): one IPS section under a level-2
/// heading, its status in words, the app's body (usually a record list) and an optional author's narrative behind a
/// <see cref="Disclosure"/>. A section never says "none known" above a record list that holds an entry (HC-C17, P50-T29): the
/// line goes and the list's conflict words speak. Style hooks: <c>international-patient-summary-section</c>, <c>-heading</c>,
/// <c>-status</c>, <c>-narrative</c>.
/// </summary>
public class InternationalPatientSummarySection : VerticalStackLayout
{
    /// <summary>The IPS section key ("allergies").</summary>
    public static readonly BindableProperty SectionProperty = Create(nameof(Section), typeof(string), string.Empty);

    /// <summary>The heading, in the app's words. Required.</summary>
    public static readonly BindableProperty HeadingProperty = Create(nameof(Heading), typeof(string), string.Empty);

    /// <summary>The section's status: known, none-known, not-recorded, unavailable or omitted.</summary>
    public static readonly BindableProperty StatusProperty = Create(nameof(Status), typeof(string), "known");

    /// <summary>The status in words; required for any status but known, unless <see cref="StatusPlacement"/> is List.</summary>
    public static readonly BindableProperty StatusLabelProperty = Create(nameof(StatusLabel), typeof(string), null);

    /// <summary>Where the status is said.</summary>
    public static readonly BindableProperty StatusPlacementProperty = Create(nameof(StatusPlacement), typeof(IpsStatusPlacement), IpsStatusPlacement.Heading);

    /// <summary>The section's body: a record list, or any view.</summary>
    public static readonly BindableProperty BodyProperty = Create(nameof(Body), typeof(View), null);

    /// <summary>The author's narrative, shown behind a disclosure named by <see cref="NarrativeLabel"/>.</summary>
    public static readonly BindableProperty NarrativeProperty = Create(nameof(Narrative), typeof(View), null);

    /// <summary>Names the narrative's disclosure.</summary>
    public static readonly BindableProperty NarrativeLabelProperty = Create(nameof(NarrativeLabel), typeof(string), null);

    private readonly Label heading = Lily.Text("international-patient-summary-section-heading");
    private readonly Label status = Lily.Text("international-patient-summary-section-status");
    private readonly ContentView body = new();
    private readonly Disclosure narrative = new() { StyleClass = ["international-patient-summary-section-narrative"] };
    private RecordList? watched;

    /// <summary>Creates a section; set <see cref="Section"/> and <see cref="Heading"/>.</summary>
    public InternationalPatientSummarySection()
    {
        StyleClass = ["international-patient-summary-section"];
        SemanticProperties.SetHeadingLevel(heading, SemanticHeadingLevel.Level2);
        Children.Add(heading);
        Children.Add(status);
        Children.Add(body);
        Children.Add(narrative);
        Update();
        Loaded += (_, _) => LilyWarnings.Warn(IpsRules.SectionWarnings(Heading, Status, StatusLabel, StatusPlacement, Narrative is not null, NarrativeLabel));
    }

    /// <inheritdoc cref="SectionProperty"/>
    public string Section { get => (string)GetValue(SectionProperty); set => SetValue(SectionProperty, value); }

    /// <inheritdoc cref="HeadingProperty"/>
    public string Heading { get => (string)GetValue(HeadingProperty); set => SetValue(HeadingProperty, value); }

    /// <inheritdoc cref="StatusProperty"/>
    public string Status { get => (string)GetValue(StatusProperty); set => SetValue(StatusProperty, value); }

    /// <inheritdoc cref="StatusLabelProperty"/>
    public string? StatusLabel { get => (string?)GetValue(StatusLabelProperty); set => SetValue(StatusLabelProperty, value); }

    /// <inheritdoc cref="StatusPlacementProperty"/>
    public IpsStatusPlacement StatusPlacement { get => (IpsStatusPlacement)GetValue(StatusPlacementProperty); set => SetValue(StatusPlacementProperty, value); }

    /// <inheritdoc cref="BodyProperty"/>
    public View? Body { get => (View?)GetValue(BodyProperty); set => SetValue(BodyProperty, value); }

    /// <inheritdoc cref="NarrativeProperty"/>
    public View? Narrative { get => (View?)GetValue(NarrativeProperty); set => SetValue(NarrativeProperty, value); }

    /// <inheritdoc cref="NarrativeLabelProperty"/>
    public string? NarrativeLabel { get => (string?)GetValue(NarrativeLabelProperty); set => SetValue(NarrativeLabelProperty, value); }

    private static BindableProperty Create(string property, Type type, object? initial) =>
        BindableProperty.Create(property, type, typeof(InternationalPatientSummarySection), initial, propertyChanged: (b, _, _) => ((InternationalPatientSummarySection)b).Update());

    private void Update()
    {
        // Follow the record list inside, so the status line can step aside when the list holds an entry.
        if (!ReferenceEquals(watched, Body))
        {
            if (watched is not null) watched.Changed -= OnListChanged;
            watched = Body as RecordList;
            if (watched is not null) watched.Changed += OnListChanged;
        }
        heading.Text = Heading;
        var line = IpsRules.ShowsStatusLine(Status, StatusPlacement, watched?.HasEntries == true);
        status.Text = line ? StatusLabel : null;
        status.IsVisible = line && !string.IsNullOrEmpty(StatusLabel);
        body.Content = Body;
        narrative.Label = NarrativeLabel ?? string.Empty;
        narrative.Body = Narrative;
        narrative.IsVisible = Narrative is not null;
    }

    private void OnListChanged(object? sender, EventArgs e) => Update();
}

/// <summary>
/// InternationalPatientSummary (components/international-patient-summary): structure only, Lily parses no FHIR. A named group
/// of the app's banner, the contents (buttons raising <see cref="SectionSelected"/> with a key, for the app to scroll to), the
/// app's sections (<see cref="Sections"/>, the XAML content), an omitted section for each missing required one, and the details.
/// Style hooks: <c>international-patient-summary</c>, <c>-contents</c>, <c>-contents-entry</c>.
/// </summary>
[ContentProperty(nameof(Sections))]
public class InternationalPatientSummary : VerticalStackLayout
{
    /// <summary>The summary's spoken name. Required.</summary>
    public static readonly BindableProperty LabelProperty = Create(nameof(Label), typeof(string), string.Empty);

    /// <summary>Headings for a missing required section (medications, allergies, problems), in the app's words.</summary>
    public static readonly BindableProperty RequiredHeadingsProperty = Create(nameof(RequiredHeadings), typeof(IReadOnlyDictionary<string, string>), null);

    /// <summary>The words an added, missing section shows ("Section missing from document"). Required.</summary>
    public static readonly BindableProperty OmittedLabelProperty = Create(nameof(OmittedLabel), typeof(string), string.Empty);

    /// <summary>Names the contents; without it there are none.</summary>
    public static readonly BindableProperty ContentsLabelProperty = Create(nameof(ContentsLabel), typeof(string), null);

    /// <summary>The app's patient banner.</summary>
    public static readonly BindableProperty BannerProperty = Create(nameof(Banner), typeof(View), null);

    /// <summary>The document's details (date, author, version).</summary>
    public static readonly BindableProperty DetailsProperty = Create(nameof(Details), typeof(View), null);

    private readonly ContentView banner = new();
    private readonly VerticalStackLayout contents = new() { StyleClass = ["international-patient-summary-contents"] };
    private readonly VerticalStackLayout sections = new();
    private readonly VerticalStackLayout added = new();
    private readonly ContentView details = new();

    /// <summary>Creates an empty summary.</summary>
    public InternationalPatientSummary()
    {
        StyleClass = ["international-patient-summary"];
        foreach (var v in new View[] { banner, contents, sections, added, details }) Children.Add(v);
        sections.ChildAdded += (_, _) => Update();
        sections.ChildRemoved += (_, _) => Update();
        Update();
        Loaded += (_, _) => LilyWarnings.Warn(IpsRules.SummaryWarnings(Label, OmittedLabel, RequiredHeadings ?? new Dictionary<string, string>()));
    }

    /// <summary>A contents entry was chosen; its section key.</summary>
    public event EventHandler<string>? SectionSelected;

    /// <inheritdoc cref="LabelProperty"/>
    public string Label { get => (string)GetValue(LabelProperty); set => SetValue(LabelProperty, value); }

    /// <inheritdoc cref="RequiredHeadingsProperty"/>
    public IReadOnlyDictionary<string, string>? RequiredHeadings { get => (IReadOnlyDictionary<string, string>?)GetValue(RequiredHeadingsProperty); set => SetValue(RequiredHeadingsProperty, value); }

    /// <inheritdoc cref="OmittedLabelProperty"/>
    public string OmittedLabel { get => (string)GetValue(OmittedLabelProperty); set => SetValue(OmittedLabelProperty, value); }

    /// <inheritdoc cref="ContentsLabelProperty"/>
    public string? ContentsLabel { get => (string?)GetValue(ContentsLabelProperty); set => SetValue(ContentsLabelProperty, value); }

    /// <inheritdoc cref="BannerProperty"/>
    public View? Banner { get => (View?)GetValue(BannerProperty); set => SetValue(BannerProperty, value); }

    /// <inheritdoc cref="DetailsProperty"/>
    public View? Details { get => (View?)GetValue(DetailsProperty); set => SetValue(DetailsProperty, value); }

    /// <summary>The app's sections, in document order.</summary>
    public IList<IView> Sections => sections.Children;

    /// <summary>The contents: the app's sections, then each missing required one, added.</summary>
    public IReadOnlyList<IpsContentsEntry> Contents { get; private set; } = [];

    private static BindableProperty Create(string property, Type type, object? initial) =>
        BindableProperty.Create(property, type, typeof(InternationalPatientSummary), initial, propertyChanged: (b, _, _) => ((InternationalPatientSummary)b).Update());

    private void Update()
    {
        SemanticProperties.SetDescription(this, Label);
        banner.Content = Banner;
        details.Content = Details;
        var given = sections.Children.OfType<InternationalPatientSummarySection>()
            .Select(s => new IpsSectionEntry(s.Section, s.Heading, s.Status))
            .ToList();
        var headings = RequiredHeadings ?? new Dictionary<string, string>();
        // Contents throws for a missing required section with no heading; until the app supplies them, list only its own.
        Contents = IpsSections.Required.All(k => headings.TryGetValue(k, out var h) && h != "")
            ? IpsSections.Contents(given, headings)
            : given.Select(s => new IpsContentsEntry(s.Key, s.Heading, s.Status, IpsSections.Id(s.Key), IpsSections.Code(s.Key), IpsSections.IsRequired(s.Key), false)).ToList();

        contents.Children.Clear();
        contents.IsVisible = !string.IsNullOrEmpty(ContentsLabel);
        SemanticProperties.SetDescription(contents, ContentsLabel);
        foreach (var entry in Contents)
        {
            var button = new Button { Text = entry.Heading, StyleClass = ["international-patient-summary-contents-entry"], LineBreakMode = LineBreakMode.WordWrap };
            button.Clicked += (_, _) => SectionSelected?.Invoke(this, entry.Key);
            contents.Children.Add(button);
        }

        added.Children.Clear();
        foreach (var entry in Contents.Where(c => c.Added))
            added.Children.Add(new InternationalPatientSummarySection { Section = entry.Key, Heading = entry.Heading, Status = "omitted", StatusLabel = OmittedLabel });
    }
}
