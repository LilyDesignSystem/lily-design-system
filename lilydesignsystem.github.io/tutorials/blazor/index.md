# Lily tutorial for Blazor

This tutorial walks through using Lily's Blazor headless components in a fresh
Blazor Web app.

> **Status:** the Blazor headless package is in progress. This tutorial reflects
> the target API and the patterns the existing Razor components follow.

## What you'll build

A Blazor route at `/` with a Lily Button and Lily Alert composition that
toggles the alert when the button is clicked.

## Prerequisites

- .NET 10 SDK.
- Familiarity with Razor components and C# event callbacks.

## Step 1 — Create a Blazor Web app

```sh
dotnet new blazor -o MyLilyApp --interactivity Server
cd MyLilyApp
```

## Step 2 — Reference the Lily Blazor headless source

Clone the Lily Blazor headless repo next to your project:

```sh
cd ..
git clone https://github.com/LilyDesignSystem/lily-design-system-blazor-headless
cd MyLilyApp
```

Add a project reference to the headless library in `MyLilyApp.csproj`:

```xml
<ItemGroup>
  <ProjectReference Include="..\lily-design-system-blazor-headless\Lily.Components.csproj" />
</ItemGroup>
```

Make the Lily namespace globally available in `_Imports.razor`:

```razor
@using Lily.Components
```

## Step 3 — Use components in a page

Replace `Components/Pages/Home.razor`:

```razor
@page "/"
@rendermode InteractiveServer

<main>
  <h1>Hello, Lily.</h1>

  @if (saved)
  {
    <Alert Role="status">Saved successfully.</Alert>
  }

  <Button OnClick="Save">Save</Button>
</main>

@code {
  private bool saved;
  private void Save() => saved = true;
}
```

## Step 4 — Add styles

Replace `wwwroot/app.css`:

```css
:root {
  --color-primary: #2563eb;
}
body { font: 16px/1.5 system-ui, sans-serif; color: #111827; }
main { max-width: 32rem; margin: 4rem auto; padding: 0 1rem; }

.button {
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: #fff;
  border: 0;
  border-radius: 0.375rem;
  cursor: pointer;
}
.alert {
  padding: 0.75rem 1rem;
  background: #ecfdf5;
  color: #065f46;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}
```

Lily renders `<Button>` as `<button class="button">` and `<Alert>` as
`<div class="alert" role="alert">`. Your CSS targets the kebab-case classes.

## Step 5 — Run the app

```sh
dotnet run
```

Open the URL in the console output. Click **Save** — the alert appears.

## Step 6 — Test it

Add bUnit (Blazor's component testing library):

```sh
cd ..
dotnet new xunit -o MyLilyApp.Tests
cd MyLilyApp.Tests
dotnet add package bunit
dotnet add reference ..\MyLilyApp\MyLilyApp.csproj
```

Create `HomeTests.cs`:

```csharp
using Bunit;
using MyLilyApp.Components.Pages;
using Xunit;

public class HomeTests : TestContext
{
  [Fact]
  public void ClickingSaveShowsTheAlert()
  {
    var cut = RenderComponent<Home>();

    Assert.Empty(cut.FindAll("[role='alert']"));

    cut.Find("button").Click();

    Assert.Single(cut.FindAll("[role='alert']"));
  }
}
```

Run with `dotnet test`.

## What you got for free

- Strongly-typed Razor component with `EventCallback` props.
- A real `<button>` element with proper keyboard handling.
- `role="alert"` for screen reader announcements.
- Translatable labels via Razor parameters — no hardcoded English.

## Where to go next

- Try a styled example: clone
  `lily-design-system-blazor-web-examples` and run `dotnet run`.
- Browse the [component catalog](../../components/) for every pattern.
