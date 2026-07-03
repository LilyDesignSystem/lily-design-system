<svelte:head>
  <title>Angular tutorial — Lily Design System</title>
  <meta name="description" content="Build an accessible, styled form with Lily's Angular 20 headless components: standalone components with signal inputs." />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Tutorials</p>
  <h1>Angular tutorial</h1>
  <p class="hero-tagline">
    Angular 20 standalone components — signal inputs, OnPush change
    detection, inline templates, zero NgModules, zero CSS.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>Step 1 — Get the code</h2>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-angular-headless
cd lily-design-system-angular-headless
pnpm install
pnpm test        # vitest + TestBed, all 490 components
pnpm run build-storybook`}</code></pre>
  <p>
    Components are flat files in <code>components/</code> —
    <code>Button.ts</code>, <code>TextInput.ts</code> — each a standalone
    component with an inline template, plus its spec and story. The barrel
    <code>index.ts</code> re-exports every component; <code>pnpm build</code>
    produces an Angular Package Format bundle via ng-packagr.
  </p>

  <h2>Step 2 — Your first component</h2>
  <pre><code>{`import { Component } from "@angular/core";
import { Button } from "lily-design-system-angular-headless";

@Component({
  selector: "app-save-bar",
  standalone: true,
  imports: [Button],
  template: \`<lily-button (click)="save()">Save</lily-button>\`,
})
export class SaveBar {
  save() { console.log("saved"); }
}`}</code></pre>
  <p>
    Every component declares a <code>lily-*</code> selector and renders the
    semantic element with its class hook —
    <code>&lt;button class="button" type="button"&gt;</code> here. Inputs are
    signal-based: <code>label()</code> for an <code>aria-label</code>
    override, <code>className()</code> to append classes.
  </p>

  <h2>Step 3 — Compose a small form</h2>
  <pre><code>{`import { Component, signal } from "@angular/core";
import { Form, Field, Label, TextInput, Button } from "lily-design-system-angular-headless";

@Component({
  selector: "app-contact-form",
  standalone: true,
  imports: [Form, Field, Label, TextInput, Button],
  template: \`
    <lily-form (submit)="handleSubmit($event)">
      <lily-field>
        <lily-label for="name">Full name</lily-label>
        <lily-text-input id="name" label="Full name" [(value)]="name" />
      </lily-field>
      <lily-button type="submit">Save</lily-button>
    </lily-form>
  \`,
})
export class ContactForm {
  name = signal("");
}`}</code></pre>
  <p>
    Input-like components expose <code>model()</code> values, so banana-box
    <code>[(value)]</code> two-way binding just works — zoneless-compatible
    throughout.
  </p>

  <h2>Step 4 — Style it</h2>
  <p>
    Style the class hooks — <code>.button</code>, <code>.text-input</code>,
    <code>.label</code>, <code>.field</code> — in <code>styles.css</code>, or
    add a ready-made theme to the <code>styles</code> array in
    <code>angular.json</code> / link it in <code>index.html</code>:
  </p>
  <pre><code>{`<link rel="stylesheet" href="/themes/adobe-spectrum.css" />`}</code></pre>

  <h2>Step 5 — See it all working</h2>
  <p>
    The <a href="/examples/">Angular + Analog example app</a> shows the full
    catalog with file-based routing and Vite:
  </p>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-angular-examples
cd lily-design-system-angular-examples
pnpm install && pnpm run dev`}</code></pre>

  <h2>Next steps</h2>
  <ul>
    <li><a href="/tutorials/theming/">Theming</a> — runtime switching with the Angular theme-select helper.</li>
    <li><a href="/tutorials/helpers/">Preference helpers</a> — language and text size.</li>
    <li><a href="/components/">Component catalog</a> — props, ARIA, and keyboard per component.</li>
  </ul>
</section>
