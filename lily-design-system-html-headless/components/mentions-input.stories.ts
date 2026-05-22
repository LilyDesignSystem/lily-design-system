import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `</div>
    </div>
-->

<div
  class="mentions-input"
  data-trigger-char="@"
>
  <!-- The text input. role="combobox" makes this an autocomplete combobox. -->
  <input
    class="mentions-input-control"
    type="text"
    role="combobox"
    aria-label=""
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-autocomplete="list"
  />

  <!-- The suggestions panel. Hidden until the trigger character is typed. -->
  <div class="mentions-input-suggestions" hidden>
    <!-- Consumer provides the suggestions (typically a listbox) -->
  </div>
</div>

<script>
  // MentionsInput behavior
  // - Opens the suggestions panel when the user types the trigger character.
  // - Closes the suggestions panel on Escape.
  // - Keeps aria-expanded on the input synchronized with the panel's hidden state.
  (function () {
    "use strict";

    var roots = document.querySelectorAll('div.mentions-input');

    roots.forEach(function (root) {
      var input = root.querySelector('input.mentions-input-control');
      var panel = root.querySelector('div.mentions-input-suggestions');
      if (!input || !panel) return;

      // Trigger character is configurable via data-trigger-char (default "@").
      var trigger = root.getAttribute('data-trigger-char') || '@';

      function open() {
        input.setAttribute('aria-expanded', 'true');
        panel.removeAttribute('hidden');
      }

      function close() {
        input.setAttribute('aria-expanded', 'false');
        panel.setAttribute('hidden', '');
      }

      // Listen for input to detect the trigger character.
      input.addEventListener('input', function () {
        // If the most recent character typed is the trigger, open the panel.
        // Consumers can override this logic by replacing the event handler.
        if (input.value.indexOf(trigger) !== -1) {
          open();
        }
      });

      // Escape closes the panel.
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          close();
        }
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/MentionsInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
