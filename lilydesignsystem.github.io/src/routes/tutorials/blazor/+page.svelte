<svelte:head>
  <title>Blazor tutorial — Lily Design System</title>
  <meta name="description" content="Build an accessible, styled form with Lily's Blazor headless components: Razor components with parameters and bUnit tests." />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Tutorials</p>
  <h1>Blazor tutorial</h1>
  <p class="hero-tagline">
    Razor class library components with parameters, <code>ChildContent</code>
    render fragments, attribute splatting, and a bUnit test per component.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>Step 1 — Get the code</h2>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-blazor-headless
cd lily-design-system-blazor-headless
dotnet build
dotnet test      # bUnit — 1,400+ cases across the catalog`}</code></pre>
  <p>
    Components live in <code>src/LilyBlazorHeadless/Components/</code> —
    <code>Button.razor</code>, <code>TextInput.razor</code> — one Razor file
    each. Reference the project (or copy the files) from your Blazor app and
    add <code>@using LilyBlazorHeadless.Components</code> to
    <code>_Imports.razor</code>.
  </p>

  <h2>Step 2 — Your first component</h2>
  <pre><code>{`<Button OnClick="Save">Save</Button>`}</code></pre>
  <p>
    Renders <code>&lt;button class="button"&gt;</code>. The shared parameter
    conventions: <code>Label</code> (an <code>aria-label</code> override),
    <code>CssClass</code> (appended to the base hook),
    <code>ChildContent</code>, and
    <code>[Parameter(CaptureUnmatchedValues = true)]</code> attribute
    splatting so any extra HTML attribute passes through.
  </p>

  <h2>Step 3 — Compose a small form</h2>
  <pre><code>{`<Form OnSubmit="HandleSubmit">
  <Field>
    <Label For="name">Full name</Label>
    <TextInput Id="name" Label="Full name" @bind-Value="name" Required="true" />
  </Field>
  <Button Type="submit">Save</Button>
</Form>

@code {
  private string name = "";
}`}</code></pre>

  <h2>Step 4 — Style it</h2>
  <p>
    Style the class hooks — <code>.button</code>, <code>.text-input</code>,
    <code>.label</code>, <code>.field</code> — in <code>app.css</code>, or
    link a ready-made theme in <code>App.razor</code> /
    <code>index.html</code>:
  </p>
  <pre><code>{`<link rel="stylesheet" href="themes/wireframe.css" />`}</code></pre>

  <h2>Step 5 — See it all working</h2>
  <p>
    The <a href="/examples/">Blazor Web example app</a> shows the full
    catalog styled and demoed, with Playwright e2e tests:
  </p>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-blazor-web-examples
cd lily-design-system-blazor-web-examples
dotnet run --project src/LilyBlazorWebExamples`}</code></pre>

  <h2>Next steps</h2>
  <ul>
    <li><a href="/tutorials/theming/">Theming</a> — runtime switching with the Blazor theme-select helper (a Razor class library on NuGet).</li>
    <li><a href="/tutorials/helpers/">Preference helpers</a> — language and text size.</li>
    <li><a href="/components/">Component catalog</a> — props, ARIA, and keyboard per component.</li>
  </ul>
</section>
