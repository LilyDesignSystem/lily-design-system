namespace LilyMauiExamples;

/// <summary>
/// The app's styles for Lily's class hooks. Lily's controls set no colour, size or font; an app styles them by StyleClass, as the
/// web themes style the kebab-case classes. Colours come from the theme's tokens (LilyTheme.Apply).
/// </summary>
public static class LilyStyles
{
    public static ResourceDictionary Create()
    {
        var styles = new ResourceDictionary();
        Style Class<T>(string name, params Setter[] setters)
            where T : BindableObject
        {
            var style = new Style(typeof(T)) { Class = name, ApplyToDerivedTypes = true };
            foreach (var setter in setters) style.Setters.Add(setter);
            styles.Add(style);
            return style;
        }

        Class<VerticalStackLayout>("alert", new Setter { Property = Layout.PaddingProperty, Value = new Thickness(16) }, new Setter { Property = VisualElement.BackgroundColorProperty, Value = Colors.Transparent });
        Class<Label>("alert-heading", new Setter { Property = Label.FontAttributesProperty, Value = FontAttributes.Bold });
        Class<Label>("card-heading", new Setter { Property = Label.FontAttributesProperty, Value = FontAttributes.Bold }, new Setter { Property = Label.FontSizeProperty, Value = 20d });
        Class<Label>("field-label", new Setter { Property = Label.FontAttributesProperty, Value = FontAttributes.Bold });
        Class<Label>("field-error", new Setter { Property = Label.FontAttributesProperty, Value = FontAttributes.Bold });
        Class<Label>("error-summary-title", new Setter { Property = Label.FontAttributesProperty, Value = FontAttributes.Bold }, new Setter { Property = Label.FontSizeProperty, Value = 20d });
        Class<Label>("summary-list-term", new Setter { Property = Label.FontAttributesProperty, Value = FontAttributes.Bold });
        Class<Label>("warning-text-text", new Setter { Property = Label.FontAttributesProperty, Value = FontAttributes.Bold });
        Class<Label>("international-patient-summary-section-heading", new Setter { Property = Label.FontAttributesProperty, Value = FontAttributes.Bold }, new Setter { Property = Label.FontSizeProperty, Value = 18d });
        Class<Label>("observation-view-flag", new Setter { Property = Label.FontAttributesProperty, Value = FontAttributes.Bold });
        return styles;
    }
}
