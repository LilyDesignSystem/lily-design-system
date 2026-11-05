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
}
