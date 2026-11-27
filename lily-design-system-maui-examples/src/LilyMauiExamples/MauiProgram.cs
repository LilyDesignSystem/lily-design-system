using LilyDesignSystem.Maui.Themes;

namespace LilyMauiExamples;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder.UseMauiApp<App>();
        builder.Services.AddMauiBlazorWebView();
        return builder.Build();
    }
}

public class App : Application
{
    public App()
    {
        // The light theme's tokens, for {DynamicResource lily-color-…} in the styles below.
        LilyTheme.Apply(Resources, LilyTokens.Light);
        Resources.MergedDictionaries.Add(LilyStyles.Create());
    }

    protected override Window CreateWindow(IActivationState? activationState) =>
        new(new AppShell()) { Title = "Lily MAUI examples" };
}

public class AppShell : Shell
{
    public AppShell()
    {
        Items.Add(new ShellContent { Title = "Native controls", Route = "native", ContentTemplate = new DataTemplate(typeof(NativePage)) });
        Items.Add(new ShellContent { Title = "Healthcare", Route = "healthcare", ContentTemplate = new DataTemplate(typeof(HealthcarePage)) });
        Items.Add(new ShellContent { Title = "Blazor catalog", Route = "blazor", ContentTemplate = new DataTemplate(typeof(BlazorPage)) });
    }
}
