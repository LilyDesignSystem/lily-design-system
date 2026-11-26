using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>
/// LilyCard (components/card): a heading and content. The heading is a heading (level 2 by default; MAUI, unlike Compose,
/// has heading levels). A <see cref="Label"/> names the card as a group, the web's <c>role="group"</c> with <c>aria-label</c>.
/// Put the card's body in <see cref="Body"/>. Style hooks: <c>card</c>, <c>card-heading</c>.
/// </summary>
public class LilyCard : VerticalStackLayout
{
    /// <summary>The heading, in the app's language.</summary>
    public static readonly BindableProperty HeadingProperty = BindableProperty.Create(
        nameof(Heading), typeof(string), typeof(LilyCard), null, propertyChanged: (b, _, _) => ((LilyCard)b).Update());

    /// <summary>The heading's level, 1 to 9.</summary>
    public static readonly BindableProperty HeadingLevelProperty = BindableProperty.Create(
        nameof(HeadingLevel), typeof(SemanticHeadingLevel), typeof(LilyCard), SemanticHeadingLevel.Level2, propertyChanged: (b, _, _) => ((LilyCard)b).Update());

    /// <summary>Names the card as a group, in the app's language.</summary>
    public static readonly BindableProperty LabelProperty = BindableProperty.Create(
        nameof(Label), typeof(string), typeof(LilyCard), null, propertyChanged: (b, _, n) => SemanticProperties.SetDescription(b, n as string));

    /// <summary>The card's body.</summary>
    public static readonly BindableProperty BodyProperty = BindableProperty.Create(
        nameof(Body), typeof(View), typeof(LilyCard), null, propertyChanged: (b, o, n) => ((LilyCard)b).SetBody(o as View, n as View));

    private readonly Label heading = Lily.Text("card-heading");

    /// <summary>Creates a card.</summary>
    public LilyCard()
    {
        StyleClass = ["card"];
        Children.Add(heading);
        Update();
    }

    /// <inheritdoc cref="HeadingProperty"/>
    public string? Heading { get => (string?)GetValue(HeadingProperty); set => SetValue(HeadingProperty, value); }

    /// <inheritdoc cref="HeadingLevelProperty"/>
    public SemanticHeadingLevel HeadingLevel { get => (SemanticHeadingLevel)GetValue(HeadingLevelProperty); set => SetValue(HeadingLevelProperty, value); }

    /// <inheritdoc cref="LabelProperty"/>
    public string? Label { get => (string?)GetValue(LabelProperty); set => SetValue(LabelProperty, value); }

    /// <inheritdoc cref="BodyProperty"/>
    public View? Body { get => (View?)GetValue(BodyProperty); set => SetValue(BodyProperty, value); }

    private void SetBody(View? old, View? body)
    {
        if (old is not null) Children.Remove(old);
        if (body is not null) Children.Add(body);
    }

    private void Update()
    {
        heading.Text = Heading;
        heading.IsVisible = !string.IsNullOrEmpty(Heading);
        SemanticProperties.SetHeadingLevel(heading, HeadingLevel);
    }
}
