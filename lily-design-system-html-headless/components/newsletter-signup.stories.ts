import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<form
  class="newsletter-signup"
  aria-label=""
  data-state="idle"
>
  <header class="newsletter-signup-header">
    <h3 class="newsletter-signup-heading">
      <!-- Consumer provides heading text (optional) -->
    </h3>
    <p class="newsletter-signup-description">
      <!-- Consumer provides description text (optional) -->
    </p>
  </header>
  <label class="newsletter-signup-label">
    <!-- Consumer provides email label text -->
    <input
      type="email"
      class="newsletter-signup-email"
      placeholder=""
    >
  </label>
  <button type="submit" class="newsletter-signup-submit">
    <!-- Consumer provides submit button text -->
  </button>
  <p class="newsletter-signup-success" role="status" aria-live="polite" hidden>
    <!-- Consumer provides success message text -->
  </p>
  <p class="newsletter-signup-error" role="alert" hidden>
    <!-- Consumer provides error message text -->
  </p>
</form>

<script>
  // NewsletterSignup behavior
  // Watches the form's data-state attribute and synchronizes:
  //   - the hidden attribute on the success and error messages
  //   - the disabled attribute on the email input and submit button
  // Consumers change data-state externally (e.g., from a fetch handler) to drive the UI.
  (function () {
    "use strict";

    // Apply the visible UI for a given state to one form instance.
    function applyState(form) {
      var state = form.getAttribute('data-state') || 'idle';
      var success = form.querySelector('.newsletter-signup-success');
      var error = form.querySelector('.newsletter-signup-error');
      var email = form.querySelector('.newsletter-signup-email');
      var submit = form.querySelector('.newsletter-signup-submit');

      // Toggle visibility of status messages.
      if (success) {
        if (state === 'success') {
          success.removeAttribute('hidden');
        } else {
          success.setAttribute('hidden', '');
        }
      }
      if (error) {
        if (state === 'error') {
          error.removeAttribute('hidden');
        } else {
          error.setAttribute('hidden', '');
        }
      }

      // Disable inputs while submitting.
      var submitting = state === 'submitting';
      if (email) email.disabled = submitting;
      if (submit) submit.disabled = submitting;
    }

    // Initialize every form on the page.
    var forms = document.querySelectorAll('form.newsletter-signup');
    forms.forEach(function (form) {
      applyState(form);

      // Observe data-state changes so consumers can drive UI by setting the attribute.
      var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          if (mutations[i].attributeName === 'data-state') {
            applyState(form);
            break;
          }
        }
      });
      observer.observe(form, { attributes: true, attributeFilter: ['data-state'] });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/NewsletterSignup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
