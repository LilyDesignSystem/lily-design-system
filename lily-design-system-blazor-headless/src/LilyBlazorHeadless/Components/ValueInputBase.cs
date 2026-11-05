using Microsoft.AspNetCore.Components;

namespace LilyBlazorHeadless.Components;

/// <summary>
/// A text-valued input: <c>Value</c> and <c>ValueChanged</c>, so a consumer can write <c>@bind-Value</c>. The markup binds
/// with <c>@bind:get</c> and <c>@bind:set</c>, not <c>value=</c> and <c>@oninput</c>: only the first tells the server what
/// the browser already holds, so a re-render cannot overwrite a character typed since.
/// </summary>
public abstract class ValueInputBase : ComponentBase
{
    /// <summary>The current text.</summary>
    [Parameter] public string Value { get; set; } = "";
    [Parameter] public EventCallback<string> ValueChanged { get; set; }

    /// <summary>Takes the text from the browser.</summary>
    protected async Task SetValueAsync(string? value)
    {
        Value = value ?? "";
        await ValueChanged.InvokeAsync(Value);
    }

    /// <summary>
    /// Takes the text of a time or datetime-local input. Blazor's event code always adds seconds ("10:15:00"), though the
    /// element and every other Lily port say "10:15". Seconds of zero go back; real ones ("10:15:30") stay.
    /// </summary>
    protected Task SetTimeValueAsync(string? value) =>
        SetValueAsync(value is not null && value.EndsWith(":00") && value.Count(c => c == ':') == 2 ? value[..^3] : value);
}
