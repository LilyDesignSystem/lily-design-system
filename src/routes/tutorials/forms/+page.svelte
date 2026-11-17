<svelte:head>
  <title>Accessible forms tutorial — Lily Design System</title>
  <meta name="description" content="Labels, hints, errors next to each field, an error summary that takes focus: an accessible form with Lily, in any framework." />
</svelte:head>

<section class="page-intro">
  <h1>Accessible forms tutorial</h1>
  <p class="page-intro-tagline">
    The pattern every Lily form follows, whatever the framework: label every
    control, check on submit, put each error next to its field, and summarise
    the errors where focus lands.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>What you'll build</h2>
  <p>
    A two-field form that, when submitted with mistakes, says what is wrong,
    beside each field and in a summary at the top, and moves focus there, so
    a keyboard or screen-reader user finds the errors at once. It is shown in
    plain HTML with the Lily class hooks; every framework catalog renders the
    same markup from its own <code>Field</code>, <code>Hint</code>,
    <code>ErrorMessage</code> and <code>ErrorSummary</code> components.
    About 20 minutes; the <a href="/tutorials/html/">HTML tutorial</a> first
    helps.
  </p>

  <h2>Step 1 — Label every control, and say what you expect</h2>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`<form class="form" novalidate>
  <div class="field">
    <label class="label" for="name">Full name</label>
    <input class="text-input" type="text" id="name" name="name" autocomplete="name" required />
  </div>
  <div class="field">
    <label class="label" for="email">Email</label>
    <p class="hint" id="email-hint">We only use this to send your appointment.</p>
    <input class="email-input" type="email" id="email" name="email"
      autocomplete="email" aria-describedby="email-hint" required />
  </div>
  <button class="button" type="submit">Continue</button>
</form>`}</code></pre>
  <ul>
    <li>A visible <code>&lt;label for&gt;</code> on every control, never a placeholder in its place: a placeholder vanishes as you type.</li>
    <li>A hint joins the field's name through <code>aria-describedby</code>, so a screen reader reads it with the field.</li>
    <li><code>autocomplete</code> lets the browser fill what it knows (WCAG 1.3.5).</li>
    <li>
      <code>novalidate</code> turns off the browser's own bubbles, because you
      will show the errors yourself, in your words and your language. The
      <code>required</code> and <code>type</code> stay: your script reads them.
    </li>
  </ul>

  <h2>Step 2 — Check on submit, not while someone types</h2>
  <p>
    Telling someone their email is wrong after one letter is noise. Check when
    they submit. The 63 themes already style a field as invalid only after it
    has been edited and left (<code>:user-invalid</code>), or when you set
    <code>aria-invalid="true"</code>, so nothing turns red on page load.
  </p>
  <p>Never disable the submit button until the form is valid: a disabled button cannot say why.</p>

  <h2>Step 3 — Put each error next to its field</h2>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`<div class="field">
  <label class="label" for="email">Email</label>
  <p class="hint" id="email-hint">We only use this to send your appointment.</p>
  <p class="error-message" id="email-error">Enter an email address in the right format, like name@example.com</p>
  <input class="email-input" type="email" id="email" name="email" autocomplete="email"
    aria-invalid="true" aria-describedby="email-hint email-error" required />
</div>`}</code></pre>
  <ul>
    <li><code>aria-invalid="true"</code> says the field is wrong; the message says why and how to fix it.</li>
    <li>The message is in <code>aria-describedby</code>, after the hint, so it is read when the field is focused.</li>
    <li>Say what to do, not just what is wrong: "Enter an email address in the right format", not "Invalid".</li>
    <li>Never colour alone: the text is the error; the red border only repeats it (WCAG 1.4.1).</li>
  </ul>

  <h2>Step 4 — Summarise the errors where focus lands</h2>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`<div class="error-summary" role="alert" tabindex="-1" aria-labelledby="error-summary-title">
  <h2 id="error-summary-title">There is a problem</h2>
  <ul>
    <li><a href="#name">Enter your full name</a></li>
    <li><a href="#email">Enter an email address in the right format, like name@example.com</a></li>
  </ul>
</div>`}</code></pre>
  <p>
    Put it at the top of the form and move focus to it on submit. Each link
    goes straight to its field. <code>tabindex="-1"</code> lets the summary
    take focus without adding a tab stop.
  </p>

  <h2>Step 5 — The script that ties it together</h2>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`const messages = {
  name: { valueMissing: "Enter your full name" },
  email: {
    valueMissing: "Enter your email address",
    typeMismatch: "Enter an email address in the right format, like name@example.com",
  },
};

const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  form.querySelector(".error-summary")?.remove();
  const errors = [];
  for (const field of form.querySelectorAll("input")) {
    const old = document.getElementById(field.id + "-error");
    old?.remove();
    const describedBy = (field.getAttribute("aria-describedby") ?? "")
      .split(" ").filter((id) => id && id !== field.id + "-error");
    const problem = Object.keys(messages[field.name] ?? {}).find((key) => field.validity[key]);
    if (!problem) {
      field.removeAttribute("aria-invalid");
      field.setAttribute("aria-describedby", describedBy.join(" "));
      continue;
    }
    const text = messages[field.name][problem];
    const message = document.createElement("p");
    message.className = "error-message";
    message.id = field.id + "-error";
    message.textContent = text;
    field.before(message);
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", [...describedBy, message.id].join(" "));
    errors.push({ id: field.id, text });
  }
  if (errors.length === 0) return; // valid: let it submit
  event.preventDefault();
  const summary = document.createElement("div");
  summary.className = "error-summary";
  summary.setAttribute("role", "alert");
  summary.tabIndex = -1;
  summary.setAttribute("aria-labelledby", "error-summary-title");
  summary.innerHTML = '<h2 id="error-summary-title">There is a problem</h2><ul></ul>';
  for (const { id, text } of errors) {
    const link = document.createElement("a");
    link.href = "#" + id;
    link.textContent = text;
    const item = document.createElement("li");
    item.append(link);
    summary.querySelector("ul").append(item);
  }
  form.prepend(summary);
  summary.focus();
});`}</code></pre>
  <p>
    The messages are yours, in your language: the browser's
    <code>validity</code> says which rule failed, and your table says what
    to tell the person. Lily ships no English for you to translate.
  </p>
  <div class="callout">
    <p style="margin: 0;">
      <strong>Check your work:</strong> submit the empty form with the
      keyboard. Focus moves to the summary and a screen reader reads "There
      is a problem" and both errors. Follow a link: focus lands in the field,
      which is read with its hint and its error. Fix both and submit: the
      form goes through, and no error is left behind.
    </p>
  </div>

  <h2>What to avoid</h2>
  <ul>
    <li>Clamping or correcting what someone typed without saying so; tell them instead.</li>
    <li>Clearing a form on error: keep everything they entered.</li>
    <li>An error that appears only on hover, or only in a tooltip.</li>
    <li>Timing out a form without warning; use <code>timeout-dialog</code> to warn and extend.</li>
  </ul>

  <h2>Next steps</h2>
  <ul>
    <li><a href="/training/">Training</a> — eight modules, each with an exercise and a self-check.</li>
    <li><a href="/components/error-summary/">ErrorSummary</a>, <a href="/components/field/">Field</a> and <a href="/components/error-message/">ErrorMessage</a> in the catalog.</li>
    <li><a href="/tutorials/worldwide/">A form that works worldwide</a> — names, addresses, dates and direction.</li>
    <li><a href="/tutorials/theming/">Theming</a> — the invalid state each theme draws.</li>
  </ul>
</section>
