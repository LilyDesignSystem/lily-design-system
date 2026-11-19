<svelte:head>
    <title>Getting started — Lily Design System</title>
    <meta
        name="description"
        content="Lily in five minutes: install one package, render a labelled email field and a button, add a theme. For React, Vue, Svelte, Solid, Angular, Web Components, HTML, Nunjucks, Alpine.js and Blazor."
    />
</svelte:head>

<section class="page-intro">
    <h1>Getting started in five minutes</h1>
    <p class="page-intro-tagline">
        Three steps in any framework: install the package, render a labelled email field and a
        button, and link a theme.
    </p>
</section>

<section
    class="section prose"
    style="margin: 0 auto;"
>
    <h2>What you will have</h2>
    <p>
        A small sign-up form: a visible label tied to an email input, and a submit button. The
        components bring the semantic HTML, the ARIA and the keyboard behaviour; the theme brings
        the look. Lily ships no CSS of its own, so without a theme you get the browser's defaults,
        which is the point: every visual decision is yours.
    </p>
    <p>
        Every user-facing string, the label and the button text, is yours too, so the same code
        works in any language.
    </p>

    <h2>Pick your framework</h2>
    <ul>
        <li>
            <a href="#react">React</a>, <a href="#vue">Vue</a>, <a href="#svelte">Svelte</a>,
            <a href="#solid">Solid</a>, <a href="#angular">Angular</a>
        </li>
        <li>
            <a href="#web-components">Web Components</a>, <a href="#html">HTML</a>,
            <a href="#nunjucks">Nunjucks</a>, <a href="#alpine">Alpine.js</a>
        </li>
        <li><a href="#blazor">Blazor</a></li>
    </ul>

    <h2 id="react">React</h2>
    <p>React 18 or 19, in Vite, Next.js or any React app.</p>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`npm install @lilydesignsystem/react-headless @lilydesignsystem/themes`}</code
        ></pre>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`import { useState } from "react";
import { Field, EmailInput, Button } from "@lilydesignsystem/react-headless";
import "@lilydesignsystem/themes/light.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <Field label="Email address" inputId="email">
        <EmailInput id="email" label="Email address" value={email} onChange={setEmail} required />
      </Field>
      <Button type="submit">Subscribe</Button>
    </form>
  );
}`}</code
        ></pre>
    <p><code>onChange</code> receives the new string, not an event.</p>

    <h2 id="vue">Vue</h2>
    <p>Vue 3.4 or later, in Vite or Nuxt.</p>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`npm install @lilydesignsystem/vue-headless @lilydesignsystem/themes`}</code
        ></pre>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`<script setup>
import { ref } from "vue";
import { Field, EmailInput, Button } from "@lilydesignsystem/vue-headless";
import "@lilydesignsystem/themes/light.css";

const email = ref("");
</script>

<template>
  <form @submit.prevent>
    <Field label="Email address" input-id="email">
      <EmailInput id="email" label="Email address" v-model="email" required />
    </Field>
    <Button type="submit">Subscribe</Button>
  </form>
</template>`}</code
        ></pre>

    <h2 id="svelte">Svelte</h2>
    <p>
        Svelte 5, in SvelteKit or Vite. The package ships <code>.svelte</code> files for your bundler
        to compile.
    </p>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`npm install @lilydesignsystem/svelte-headless @lilydesignsystem/themes`}</code
        ></pre>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`<script>
  import { Field, EmailInput, Button } from "@lilydesignsystem/svelte-headless";
  import "@lilydesignsystem/themes/light.css";

  let email = $state("");
</script>

<form onsubmit={(event) => event.preventDefault()}>
  <Field label="Email address" inputId="email">
    <EmailInput id="email" label="Email address" bind:value={email} required />
  </Field>
  <Button type="submit">Subscribe</Button>
</form>`}</code
        ></pre>

    <h2 id="solid">Solid</h2>
    <p>Solid 2.0, in Vite.</p>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`npm install @lilydesignsystem/solid-headless @lilydesignsystem/themes`}</code
        ></pre>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`import { createSignal } from "solid-js";
import { Field, EmailInput, Button } from "@lilydesignsystem/solid-headless";
import "@lilydesignsystem/themes/light.css";

export default function Signup() {
  const [email, setEmail] = createSignal("");
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <Field label="Email address" inputId="email">
        <EmailInput id="email" label="Email address" value={email()} onChange={setEmail} required />
      </Field>
      <Button type="submit">Subscribe</Button>
    </form>
  );
}`}</code
        ></pre>

    <h2 id="angular">Angular</h2>
    <p>
        Angular 20 to 22, standalone components. Add the theme to <code>styles</code> in
        <code>angular.json</code>.
    </p>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`npm install @lilydesignsystem/angular-headless @lilydesignsystem/themes`}</code
        ></pre>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`// angular.json: "styles": ["node_modules/@lilydesignsystem/themes/dist/light.css"]
import { Component } from "@angular/core";
import { EmailInput, Button } from "@lilydesignsystem/angular-headless";

@Component({
  selector: "app-signup",
  imports: [EmailInput, Button],
  template: \`
    <form (submit)="$event.preventDefault()">
      <label>
        Email address
        <lily-email-input label="Email address" [required]="true" />
      </label>
      <lily-button type="submit">Subscribe</lily-button>
    </form>
  \`,
})
export class Signup {}`}</code
        ></pre>
    <p>
        The visible label wraps the component, which labels the <code>&lt;input&gt;</code> inside
        it, in every version. From <code>@lilydesignsystem/angular-headless</code> 0.13.0 you can
        use
        <code>&lt;lily-field inputId="email"&gt;</code> around
        <code>&lt;lily-email-input id="email"&gt;</code> instead.
    </p>

    <h2 id="web-components">Web Components</h2>
    <p>Any page or framework. Importing the package registers every <code>lily-*</code> element.</p>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`npm install @lilydesignsystem/web-components-headless @lilydesignsystem/themes`}</code
        ></pre>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`<link rel="stylesheet" href="node_modules/@lilydesignsystem/themes/dist/light.css" />
<script type="module">
  import "@lilydesignsystem/web-components-headless";
</script>

<form>
  <label>
    Email address
    <lily-email-input label="Email address" required></lily-email-input>
  </label>
  <lily-button type="submit">Subscribe</lily-button>
</form>`}</code
        ></pre>
    <p>
        The bare import needs a bundler or an import map. The wrapping label reaches the inner
        <code>&lt;input&gt;</code> in every version; from 0.13.0,
        <code>&lt;lily-field label="Email address"&gt;</code>
        around the input does too.
    </p>

    <h2 id="html">HTML</h2>
    <p>
        No install and no build: Lily's HTML is plain markup with class hooks. Link a theme from a
        CDN and write the markup.
    </p>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@lilydesignsystem/themes@0.6.2/dist/light.css" />

<form>
  <div class="field">
    <label for="email">Email address</label>
    <input class="email-input" id="email" type="email" required />
  </div>
  <button class="button" type="submit">Subscribe</button>
</form>`}</code
        ></pre>
    <p>
        Every component's markup is in <code>@lilydesignsystem/html-headless</code> (<code
            >components/&#123;slug&#125;.html</code
        >) and on its page in the <a href="/components">catalog</a>.
    </p>

    <h2 id="nunjucks">Nunjucks</h2>
    <p>Nunjucks 3, in Eleventy or Express. Add the package's templates to your loader.</p>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`npm install @lilydesignsystem/nunjucks-headless nunjucks @lilydesignsystem/themes`}</code
        ></pre>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`// setup
const nunjucks = require("nunjucks");
const { templatesDir } = require("@lilydesignsystem/nunjucks-headless");
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader([templatesDir, "views"]));

{# views/signup.njk #}
{% from "field/macro.njk" import field %}
{% from "label/macro.njk" import label %}
{% from "email-input/macro.njk" import emailInput %}
{% from "button/macro.njk" import button %}

<form method="post">
  {% call field() %}
    {{ label({ for: "email", text: "Email address" }) }}
    {{ emailInput({ id: "email", autocomplete: "email", required: true }) }}
  {% endcall %}
  {{ button({ type: "submit", text: "Subscribe" }) }}
</form>`}</code
        ></pre>

    <h2 id="alpine">Alpine.js</h2>
    <p>
        Alpine 3.14 or later. The markup is the same as HTML's; the plugin adds state and keyboard
        behaviour to the interactive components (menus, tabs, listboxes), so register it once.
    </p>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`npm install @lilydesignsystem/alpine-headless alpinejs @lilydesignsystem/themes`}</code
        ></pre>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`import Alpine from "alpinejs";
import lily from "@lilydesignsystem/alpine-headless/plugin";
import "@lilydesignsystem/themes/light.css";

Alpine.plugin(lily);
Alpine.start();`}</code
        ></pre>
    <p>
        Then use the HTML form above. Each component's annotated snippet is in
        <code>@lilydesignsystem/alpine-headless</code> (<code>components/&#123;slug&#125;.html</code
        >). The plugin needs 0.3.1 or later.
    </p>

    <h2 id="blazor">Blazor</h2>
    <p>
        .NET 11, a Blazor Web App. Link the theme from <code>wwwroot</code> or a CDN in
        <code>App.razor</code>.
    </p>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code>{`dotnet add package LilyDesignSystem.Blazor.Headless`}</code></pre>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`@page "/signup"
@using LilyBlazorHeadless.Components

<form @onsubmit="Subscribe">
    <Field Label="Email address" InputId="email">
        <EmailInput id="email" Label="Email address" @bind-Value="email" required />
    </Field>
    <Button type="submit">Subscribe</Button>
</form>

@code {
    private string email = "";

    private void Subscribe() { }
}`}</code
        ></pre>

    <h2>Next steps</h2>
    <ul>
        <li>
            <a href="/tutorials">Tutorials</a>: compose a fuller form, style it against the class
            hooks, and add the preference pickers.
        </li>
        <li>
            <a href="/tutorials/theming">Theming</a>: the 63 themes, switching them at runtime, and
            writing your own.
        </li>
        <li>
            <a
                href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/framework-comparison.md"
                >Framework comparison</a
            >: what each of the ten libraries covers, side by side.
        </li>
        <li>
            <a href="/components">Components</a>: all 661, each with a live demo, its markup and its
            keyboard contract.
        </li>
        <li>
            National identifiers (health, tax and identity numbers from 77 countries) are a separate
            package per framework, such as <code>@lilydesignsystem/react-headless-identifiers</code
            >.
        </li>
    </ul>
</section>
