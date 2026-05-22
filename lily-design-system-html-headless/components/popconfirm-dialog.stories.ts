import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="popconfirm-dialog"
  role="alertdialog"
  aria-modal="false"
  aria-labelledby="popconfirm-dialog-title"
  aria-describedby="popconfirm-dialog-description"
  hidden
>
  <!-- Title: REQUIRED. The id is referenced by aria-labelledby above. -->
  <h2 class="popconfirm-dialog-title" id="popconfirm-dialog-title">
    <!-- Consumer provides the title text -->
  </h2>

  <!-- Description: optional. The id is referenced by aria-describedby above. -->
  <p class="popconfirm-dialog-description" id="popconfirm-dialog-description">
    <!-- Consumer provides the description text (or remove this element if none) -->
  </p>

  <!-- Cancel button: REQUIRED. -->
  <button class="popconfirm-dialog-cancel" type="button">
    <!-- Consumer provides the cancel label text -->
  </button>

  <!-- Confirm button: REQUIRED. -->
  <button class="popconfirm-dialog-confirm" type="button">
    <!-- Consumer provides the confirm label text -->
  </button>
</div>

<script>
  // PopconfirmDialog behavior
  // - Confirm button: dispatches "lily:confirm" custom event on the root and
  //   closes the dialog by setting the hidden attribute.
  // - Cancel button:  dispatches "lily:cancel"  custom event on the root and
  //   closes the dialog the same way.
  (function () {
    "use strict";

    var roots = document.querySelectorAll('div.popconfirm-dialog');

    roots.forEach(function (root) {
      var confirmBtn = root.querySelector('.popconfirm-dialog-confirm');
      var cancelBtn = root.querySelector('.popconfirm-dialog-cancel');

      if (confirmBtn) {
        confirmBtn.addEventListener('click', function () {
          // Notify consumer code that the user confirmed.
          root.dispatchEvent(new CustomEvent('lily:confirm', { bubbles: true }));
          // Close the dialog.
          root.setAttribute('hidden', '');
        });
      }

      if (cancelBtn) {
        cancelBtn.addEventListener('click', function () {
          // Notify consumer code that the user cancelled.
          root.dispatchEvent(new CustomEvent('lily:cancel', { bubbles: true }));
          // Close the dialog.
          root.setAttribute('hidden', '');
        });
      }
    });
  })();
</script>`;

const meta = {
  title: 'Headless/PopconfirmDialog',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
