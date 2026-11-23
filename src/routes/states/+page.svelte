<svelte:head>
  <title>Component states — Lily Design System</title>
  <meta
    name="description"
    content="Every interactive Lily class hook in each state the themes style, in one grid: rest, hover, keyboard focus, pressed, current, invalid and disabled. Choose a theme to compare."
  />
</svelte:head>

<section class="page-intro">
  <h1>Component states</h1>
  <p class="page-intro-tagline">
    Every interactive class hook in each state the themes style, in one grid, under the theme you chose. Use the theme picker
    in the header to compare themes.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>How to read this page</h2>
  <ul>
    <li>
      <strong>Rest, pressed, current, checked, invalid and disabled</strong> are set by attributes, so they are shown
      side by side.
    </li>
    <li>
      <strong>Hover and keyboard focus</strong> cannot be set by an attribute, so the controls are live: move the pointer
      over a control, then Tab to it. An effect shown on hover must be shown on focus too (hover and focus parity,
      WCAG 1.4.13); compare the two as you go.
    </li>
    <li>
      Invalid uses <code>aria-invalid="true"</code>, and the native <code>:user-invalid</code> state appears after you type
      in the last field and leave it.
    </li>
  </ul>
</section>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<section
  class="section prose"
  style="margin: 0 auto; max-width: 64rem; overflow-x: auto;"
  aria-labelledby="states-grid"
  tabindex="0"
>
  <h2 id="states-grid">The grid</h2>
  <table style="min-inline-size: 44rem;">
    <thead>
      <tr>
        <th scope="col">Hook</th>
        <th scope="col">Rest</th>
        <th scope="col">Pressed, current or checked</th>
        <th scope="col">Invalid</th>
        <th scope="col">Disabled</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row"><code>button</code></th>
        <td><button type="button" class="button">Save</button></td>
        <td>—</td>
        <td>—</td>
        <td><button type="button" class="button" disabled>Save</button></td>
      </tr>
      <tr>
        <th scope="row"><code>toggle-button</code></th>
        <td><button type="button" class="toggle-button" aria-pressed="false">Bold</button></td>
        <td><button type="button" class="toggle-button" aria-pressed="true">Bold</button></td>
        <td>—</td>
        <td><button type="button" class="toggle-button" aria-pressed="false" disabled>Bold</button></td>
      </tr>
      <tr>
        <th scope="row">Link in text</th>
        <td><a href="/states/">Read the guidance</a></td>
        <td><a href="/states/" aria-current="page">Read the guidance</a></td>
        <td>—</td>
        <td>—</td>
      </tr>
      <tr>
        <th scope="row"><code>action-link</code></th>
        <td><a class="action-link" href="/states/">Start now</a></td>
        <td>—</td>
        <td>—</td>
        <td>—</td>
      </tr>
      <tr>
        <th scope="row"><code>text-input</code></th>
        <td><input class="text-input" type="text" aria-label="Name, at rest" value="Sam Okoro" /></td>
        <td>—</td>
        <td><input class="text-input" type="text" aria-label="Name, invalid" aria-invalid="true" value="" /></td>
        <td><input class="text-input" type="text" aria-label="Name, disabled" value="Sam Okoro" disabled /></td>
      </tr>
      <tr>
        <th scope="row"><code>checkbox-input</code></th>
        <td><input class="checkbox-input" type="checkbox" aria-label="Checkbox, unchecked" /></td>
        <td><input class="checkbox-input" type="checkbox" aria-label="Checkbox, checked" checked /></td>
        <td><input class="checkbox-input" type="checkbox" aria-label="Checkbox, invalid" aria-invalid="true" /></td>
        <td><input class="checkbox-input" type="checkbox" aria-label="Checkbox, disabled" disabled /></td>
      </tr>
      <tr>
        <th scope="row"><code>radio-input</code></th>
        <td><input class="radio-input" type="radio" name="states-radio-rest" aria-label="Radio, unselected" /></td>
        <td><input class="radio-input" type="radio" name="states-radio-checked" aria-label="Radio, selected" checked /></td>
        <td><input class="radio-input" type="radio" name="states-radio-invalid" aria-label="Radio, invalid" aria-invalid="true" /></td>
        <td><input class="radio-input" type="radio" name="states-radio-disabled" aria-label="Radio, disabled" disabled /></td>
      </tr>
      <tr>
        <th scope="row"><code>select</code></th>
        <td>
          <select class="select" aria-label="Country, at rest">
            <option>Kenya</option>
            <option>Peru</option>
          </select>
        </td>
        <td>—</td>
        <td>
          <select class="select" aria-label="Country, invalid" aria-invalid="true">
            <option>Kenya</option>
            <option>Peru</option>
          </select>
        </td>
        <td>
          <select class="select" aria-label="Country, disabled" disabled>
            <option>Kenya</option>
            <option>Peru</option>
          </select>
        </td>
      </tr>
      <tr>
        <th scope="row"><code>switch-button</code></th>
        <td><button type="button" class="switch-button" role="switch" aria-checked="false" aria-label="Notifications, off"></button></td>
        <td><button type="button" class="switch-button" role="switch" aria-checked="true" aria-label="Notifications, on"></button></td>
        <td>—</td>
        <td><button type="button" class="switch-button" role="switch" aria-checked="false" aria-label="Notifications, disabled" disabled></button></td>
      </tr>
      <tr>
        <th scope="row">Disclosure (<code>summary</code>)</th>
        <td>
          <details>
            <summary>Closed</summary>
            <p>Content.</p>
          </details>
        </td>
        <td>
          <details open>
            <summary>Open</summary>
            <p>Content.</p>
          </details>
        </td>
        <td>—</td>
        <td>—</td>
      </tr>
    </tbody>
  </table>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>Related</h2>
  <ul>
    <li><a href="/components/">The component catalog</a>, where each component documents its keyboard and ARIA contract.</li>
    <li><a href="/theme-contrast/">Theme contrast</a>, the measured contrast of every text pair in every theme.</li>
  </ul>
</section>
