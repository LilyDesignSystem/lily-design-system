# Recipes

Small copy-paste compositions of Lily catalog components, between one component and a whole page.
Replace the placeholder words with your own. Generated from the repository's `recipes/` directory.

## Card: the whole card as one link

Uses [card](https://lilydesignsystem.com/components/card/), [button](https://lilydesignsystem.com/components/button/). Tags: card, navigation, link. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/card/whole-card-link.html).

```html
<!-- One link, in the heading, carries data-lily-card-link: the theme's shared "Whole-card link" section stretches
     its target over the card and draws the focus ring round the card. The link's text is the card's name, so a
     screen reader hears one link, not the whole card read as a link. Anything else interactive inside the card,
     such as the button here, stays above the link and keeps its own target. In a framework catalog, card's own heading does the
     same with href and wholeCardLink. -->
<div class="card">
  <h3>
    <a
      href="/appointments/2026-11-24"
      data-lily-card-link
      >Physiotherapy, 24 November</a
    >
  </h3>
  <p>10:30 at Riverside Health Centre, with Sam Okoro.</p>
  <button
    class="button"
    type="button"
  >
    Add to calendar
  </button>
</div>
```

## Checkbox group: select all that apply

Uses [checkbox-group](https://lilydesignsystem.com/components/checkbox-group/), [checkbox-input](https://lilydesignsystem.com/components/checkbox-input/), [label](https://lilydesignsystem.com/components/label/), [hint](https://lilydesignsystem.com/components/hint/). Tags: form, choice. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/checkbox-group/select-all-that-apply.html).

```html
<fieldset
  class="checkbox-group"
  aria-describedby="allergies-hint"
>
  <legend>Do you have any of these allergies?</legend>
  <p
    class="hint"
    id="allergies-hint"
  >
    Select all that apply.
  </p>
  <input
    class="checkbox-input"
    type="checkbox"
    id="allergy-nuts"
    name="allergies"
    value="nuts"
  />
  <label
    class="label"
    for="allergy-nuts"
    >Nuts</label
  >
  <input
    class="checkbox-input"
    type="checkbox"
    id="allergy-penicillin"
    name="allergies"
    value="penicillin"
  />
  <label
    class="label"
    for="allergy-penicillin"
    >Penicillin</label
  >
  <input
    class="checkbox-input"
    type="checkbox"
    id="allergy-latex"
    name="allergies"
    value="latex"
  />
  <label
    class="label"
    for="allergy-latex"
    >Latex</label
  >
</fieldset>
```

## Field: browser autocomplete

Uses [field](https://lilydesignsystem.com/components/field/), [label](https://lilydesignsystem.com/components/label/), [text-input](https://lilydesignsystem.com/components/text-input/). Tags: form, autocomplete. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/field/autocomplete.html).

```html
<!-- The autocomplete tokens let the browser fill known details (WCAG 1.3.5, Identify Input Purpose). -->
<div class="field">
  <label
    class="label"
    for="given-name"
    >Given name</label
  >
  <input
    class="text-input"
    type="text"
    id="given-name"
    name="given-name"
    autocomplete="given-name"
  />
</div>
<div class="field">
  <label
    class="label"
    for="family-name"
    >Family name</label
  >
  <input
    class="text-input"
    type="text"
    id="family-name"
    name="family-name"
    autocomplete="family-name"
  />
</div>
```

## Field: checkbox

Uses [field](https://lilydesignsystem.com/components/field/), [checkbox-input](https://lilydesignsystem.com/components/checkbox-input/), [label](https://lilydesignsystem.com/components/label/). Tags: form, consent. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/field/checkbox.html).

```html
<div class="field">
  <input
    class="checkbox-input"
    type="checkbox"
    id="updates"
    name="updates"
    value="yes"
  />
  <label
    class="label"
    for="updates"
    >Send me updates about my appointment</label
  >
</div>
```

## Field: combobox

Uses [field](https://lilydesignsystem.com/components/field/), [label](https://lilydesignsystem.com/components/label/), [combobox](https://lilydesignsystem.com/components/combobox/), [hint](https://lilydesignsystem.com/components/hint/). Tags: form, search. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/field/combobox.html).

```html
<div class="field">
  <label
    class="label"
    for="medicine"
    >Medicine</label
  >
  <p
    class="hint"
    id="medicine-hint"
  >
    Start typing, then choose from the list.
  </p>
  <div class="combobox">
    <input
      id="medicine"
      type="text"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded="false"
      aria-controls="medicine-list"
      aria-describedby="medicine-hint"
    />
    <div
      id="medicine-list"
      role="listbox"
      aria-label="Medicines"
      popover="manual"
    >
      <div
        role="option"
        id="medicine-1"
        data-value="amoxicillin"
      >
        Amoxicillin
      </div>
      <div
        role="option"
        id="medicine-2"
        data-value="atorvastatin"
      >
        Atorvastatin
      </div>
    </div>
  </div>
</div>
```

## Field: disabled

Uses [field](https://lilydesignsystem.com/components/field/), [label](https://lilydesignsystem.com/components/label/), [text-input](https://lilydesignsystem.com/components/text-input/), [hint](https://lilydesignsystem.com/components/hint/). Tags: form, disabled. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/field/disabled.html).

```html
<div class="field">
  <label
    class="label"
    for="member-number"
    >Membership number</label
  >
  <p
    class="hint"
    id="member-number-hint"
  >
    Your number cannot be changed. Contact us if it is wrong.
  </p>
  <input
    class="text-input"
    type="text"
    id="member-number"
    name="member-number"
    value="M-204781"
    disabled
    aria-describedby="member-number-hint"
  />
</div>
```

## Field: input group

Uses [field](https://lilydesignsystem.com/components/field/), [label](https://lilydesignsystem.com/components/label/), [input-group](https://lilydesignsystem.com/components/input-group/), [number-input](https://lilydesignsystem.com/components/number-input/), [hint](https://lilydesignsystem.com/components/hint/). Tags: form, currency. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/field/input-group.html).

```html
<div class="field">
  <label
    class="label"
    id="amount-label"
    for="amount"
    >Amount</label
  >
  <p
    class="hint"
    id="amount-hint"
  >
    In euros, to the nearest cent.
  </p>
  <div
    class="input-group"
    role="group"
    aria-labelledby="amount-label"
  >
    <span aria-hidden="true">€</span>
    <input
      class="number-input"
      type="number"
      id="amount"
      name="amount"
      min="0"
      step="0.01"
      inputmode="decimal"
      aria-describedby="amount-hint"
    />
  </div>
</div>
```

## Field: number

Uses [field](https://lilydesignsystem.com/components/field/), [label](https://lilydesignsystem.com/components/label/), [number-input](https://lilydesignsystem.com/components/number-input/), [hint](https://lilydesignsystem.com/components/hint/). Tags: form, number. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/field/number-field.html).

```html
<div class="field">
  <label
    class="label"
    for="people"
    >Number of people</label
  >
  <p
    class="hint"
    id="people-hint"
  >
    Up to 8.
  </p>
  <input
    class="number-input"
    type="number"
    id="people"
    name="people"
    min="1"
    max="8"
    step="1"
    inputmode="numeric"
    aria-describedby="people-hint"
  />
</div>
```

## Field: required

Uses [field](https://lilydesignsystem.com/components/field/), [label](https://lilydesignsystem.com/components/label/), [text-input](https://lilydesignsystem.com/components/text-input/), [hint](https://lilydesignsystem.com/components/hint/). Tags: form, required. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/field/required.html).

```html
<div
  class="field"
  data-required="true"
>
  <label
    class="label"
    for="full-name"
    >Full name</label
  >
  <p
    class="hint"
    id="full-name-hint"
  >
    As it appears on your passport.
  </p>
  <input
    class="text-input"
    type="text"
    id="full-name"
    name="full-name"
    autocomplete="name"
    required
    aria-describedby="full-name-hint"
  />
</div>
```

## Field: select

Uses [field](https://lilydesignsystem.com/components/field/), [label](https://lilydesignsystem.com/components/label/), [select](https://lilydesignsystem.com/components/select/). Tags: form, choice. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/field/select.html).

```html
<div class="field">
  <label
    class="label"
    for="contact-method"
    >How should we contact you?</label
  >
  <select
    class="select"
    id="contact-method"
    name="contact-method"
  >
    <option value="">Choose one</option>
    <option value="email">Email</option>
    <option value="phone">Phone</option>
    <option value="post">Post</option>
  </select>
</div>
```

## Field: slider

Uses [field](https://lilydesignsystem.com/components/field/), [label](https://lilydesignsystem.com/components/label/), [range-input](https://lilydesignsystem.com/components/range-input/), [hint](https://lilydesignsystem.com/components/hint/). Tags: form, range. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/field/slider.html).

```html
<div class="field">
  <label
    class="label"
    for="pain-score"
    >Pain score</label
  >
  <p
    class="hint"
    id="pain-score-hint"
  >
    0 is no pain, 10 is the worst pain you can imagine.
  </p>
  <input
    class="range-input"
    type="range"
    id="pain-score"
    name="pain-score"
    min="0"
    max="10"
    step="1"
    value="0"
    aria-describedby="pain-score-hint"
  />
</div>
```

## Field: switch

Uses [field](https://lilydesignsystem.com/components/field/), [label](https://lilydesignsystem.com/components/label/), [switch-button](https://lilydesignsystem.com/components/switch-button/), [hint](https://lilydesignsystem.com/components/hint/). Tags: form, setting. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/field/switch.html).

```html
<!-- A switch acts at once; inside a form that submits later, use checkbox instead. -->
<div class="field">
  <span
    class="label"
    id="reminders-label"
    >Text message reminders</span
  >
  <p
    class="hint"
    id="reminders-hint"
  >
    We text you the day before.
  </p>
  <button
    class="switch-button"
    type="button"
    role="switch"
    aria-checked="false"
    aria-labelledby="reminders-label"
    aria-describedby="reminders-hint"
  ></button>
</div>
```

## Field: text area

Uses [field](https://lilydesignsystem.com/components/field/), [label](https://lilydesignsystem.com/components/label/), [text-area-input](https://lilydesignsystem.com/components/text-area-input/), [hint](https://lilydesignsystem.com/components/hint/). Tags: form, text. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/field/textarea.html).

```html
<div class="field">
  <label
    class="label"
    for="symptoms"
    >Describe your symptoms</label
  >
  <p
    class="hint"
    id="symptoms-hint"
  >
    Include when they started and anything that makes them better or worse.
  </p>
  <textarea
    class="text-area-input"
    id="symptoms"
    name="symptoms"
    rows="5"
    aria-describedby="symptoms-hint"
  ></textarea>
</div>
```

## Field: with an error

Uses [field](https://lilydesignsystem.com/components/field/), [label](https://lilydesignsystem.com/components/label/), [text-input](https://lilydesignsystem.com/components/text-input/), [hint](https://lilydesignsystem.com/components/hint/), [error-message](https://lilydesignsystem.com/components/error-message/). Tags: form, validation. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/field/with-error.html).

```html
<div
  class="field"
  data-invalid="true"
>
  <label
    class="label"
    for="email"
    >Email address</label
  >
  <p
    class="hint"
    id="email-hint"
  >
    We will only use this to send your receipt.
  </p>
  <p
    class="error-message"
    id="email-error"
  >
    Enter an email address in the correct format, like name@example.com
  </p>
  <input
    class="text-input"
    type="email"
    id="email"
    name="email"
    autocomplete="email"
    value="name.example.com"
    aria-invalid="true"
    aria-describedby="email-hint email-error"
    aria-errormessage="email-error"
  />
</div>
```

## Field: native validity

Uses [field](https://lilydesignsystem.com/components/field/), [label](https://lilydesignsystem.com/components/label/), [text-input](https://lilydesignsystem.com/components/text-input/), [hint](https://lilydesignsystem.com/components/hint/), [error-message](https://lilydesignsystem.com/components/error-message/). Tags: form, validation. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/field/with-validity.html).

```html
<!-- The browser checks the pattern; a theme styles :user-invalid, which matches only after the user has edited and left
     the field. On submit, script shows the error message in the consumer's words and adds its id to aria-describedby:
     a hidden element named in aria-describedby is still read out, so it is linked only once it is shown. -->
<div
  class="field"
  data-required="true"
>
  <label
    class="label"
    for="postcode"
    >Postcode</label
  >
  <p
    class="hint"
    id="postcode-hint"
  >
    For example, LS1 4AP.
  </p>
  <p
    class="error-message"
    id="postcode-error"
    hidden
  >
    Enter a real postcode
  </p>
  <input
    class="text-input"
    type="text"
    id="postcode"
    name="postcode"
    autocomplete="postal-code"
    required
    pattern="[A-Za-z0-9 ]{5,8}"
    aria-describedby="postcode-hint"
  />
</div>
```

## Form: a complete form

Uses [form](https://lilydesignsystem.com/components/form/), [error-summary](https://lilydesignsystem.com/components/error-summary/), [field](https://lilydesignsystem.com/components/field/), [label](https://lilydesignsystem.com/components/label/), [text-input](https://lilydesignsystem.com/components/text-input/), [error-message](https://lilydesignsystem.com/components/error-message/), [radio-group](https://lilydesignsystem.com/components/radio-group/), [radio-input](https://lilydesignsystem.com/components/radio-input/), [button](https://lilydesignsystem.com/components/button/). Tags: form, validation. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/form/complete-form.html).

```html
<!-- On submit with errors: show the summary, link each item to its field, and move focus to the summary. -->
<form
  class="form"
  novalidate
  aria-labelledby="booking-title"
>
  <h2 id="booking-title">Book an appointment</h2>
  <div
    class="error-summary"
    role="alert"
    aria-labelledby="booking-errors"
    tabindex="-1"
  >
    <h2 id="booking-errors">There is a problem</h2>
    <ul>
      <li><a href="#booking-name">Enter your full name</a></li>
    </ul>
  </div>
  <div
    class="field"
    data-required="true"
    data-invalid="true"
  >
    <label
      class="label"
      for="booking-name"
      >Full name</label
    >
    <p
      class="error-message"
      id="booking-name-error"
    >
      Enter your full name
    </p>
    <input
      class="text-input"
      type="text"
      id="booking-name"
      name="name"
      autocomplete="name"
      required
      aria-invalid="true"
      aria-describedby="booking-name-error"
      aria-errormessage="booking-name-error"
    />
  </div>
  <fieldset
    class="radio-group"
    role="radiogroup"
    aria-labelledby="booking-time-legend"
  >
    <legend id="booking-time-legend">Preferred time</legend>
    <input
      class="radio-input"
      type="radio"
      id="booking-morning"
      name="time"
      value="morning"
    />
    <label
      class="label"
      for="booking-morning"
      >Morning</label
    >
    <input
      class="radio-input"
      type="radio"
      id="booking-afternoon"
      name="time"
      value="afternoon"
    />
    <label
      class="label"
      for="booking-afternoon"
      >Afternoon</label
    >
  </fieldset>
  <button
    class="button"
    type="submit"
  >
    Book appointment
  </button>
</form>
```

## Radio group: one choice

Uses [radio-group](https://lilydesignsystem.com/components/radio-group/), [radio-input](https://lilydesignsystem.com/components/radio-input/), [label](https://lilydesignsystem.com/components/label/). Tags: form, choice. [Source](https://github.com/LilyDesignSystem/lily-design-system/blob/main/recipes/radio-group/one-choice.html).

```html
<fieldset
  class="radio-group"
  role="radiogroup"
  aria-labelledby="visit-legend"
>
  <legend id="visit-legend">How would you like your appointment?</legend>
  <input
    class="radio-input"
    type="radio"
    id="visit-in-person"
    name="visit"
    value="in-person"
  />
  <label
    class="label"
    for="visit-in-person"
    >In person</label
  >
  <input
    class="radio-input"
    type="radio"
    id="visit-phone"
    name="visit"
    value="phone"
  />
  <label
    class="label"
    for="visit-phone"
    >By phone</label
  >
  <input
    class="radio-input"
    type="radio"
    id="visit-video"
    name="visit"
    value="video"
  />
  <label
    class="label"
    for="visit-video"
    >By video</label
  >
</fieldset>
```
