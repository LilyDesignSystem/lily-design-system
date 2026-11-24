namespace LilyBlazorWebExamples.Data;

public record ComponentInfo(string Slug, string Name, string Description, string Tag, string Category, string Purpose, string DemoHtml);
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

    // Purpose id → display label (tasks.md P46-T3).
    public static readonly Dictionary<string, string> PurposeLabel = new()
    {
        { "collect", "Collect input" },
        { "show", "Show information" },
        { "navigate", "Navigate" },
        { "inform", "Inform or warn" },
        { "act", "Act or decide" },
        { "structure", "Structure or style content" },
    };

    public static readonly List<ComponentInfo> Components = new()
    {
        new("button", "Button", "a generic clickable button element", "button", "buttons", "act", "<button class=\"button\" type=\"button\">Button</button>"),
        new("check-list", "CheckList", "a list of checked items", "ol", "lists", "show", "<ol class=\"check-list\"><li class=\"check-list-item\">One</li></ol>"),
        new("mark", "Mark", "a highlighted run of text", "mark", "text", "show", "<mark class=\"mark\">Marked</mark>"),
    };
}
