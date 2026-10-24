namespace LilyBlazorWebExamples.Data;

public record ComponentInfo(string Slug, string Name, string Description, string Tag, string Category, string DemoHtml);
public static class ComponentData
{
    // Category id → display label (plan P6-T5's category filter).
    public static readonly Dictionary<string, string> CategoryLabel = new()
    {
        { "national", "Special-Purpose Identifiers" },
        { "forms", "Form controls" },
        { "buttons", "Buttons" },
        { "links", "Links" },
        { "lists", "Lists" },
        { "tables", "Tables" },
        { "navigation", "Navigation & structure" },
        { "overlays", "Overlays & dialogs" },
        { "pickers", "Pickers & ratings" },
        { "media", "Media & figures" },
        { "data-viz", "Data visualization" },
        { "content", "Content & other" },
    };

    public static readonly List<ComponentInfo> Components = new()
    {
        new("button", "Button", "a generic clickable button element", "button", "buttons", "<button class=\"button\" type=\"button\">Button</button>"),
        new("check-list", "CheckList", "a list of checked items", "ol", "lists", "<ol class=\"check-list\"><li class=\"check-list-item\">One</li></ol>"),
        new("mark", "Mark", "a highlighted run of text", "mark", "text", "<mark class=\"mark\">Marked</mark>"),
    };
}
