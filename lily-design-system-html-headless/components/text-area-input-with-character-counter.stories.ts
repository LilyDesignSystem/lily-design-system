import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="text-area-input-with-character-counter"
>
  <!-- Consumer provides content -->
</div>

<script>
  // TextAreaInputWithCharacterCounter behavior
  (function() {
    'use strict';
    document.querySelectorAll('.text-area-input-with-character-counter').forEach(function(el) {
      var text-area-input = el.querySelector('text-area-input');
      var counter = el.querySelector('[aria-live]');
      if (text-area-input && counter) {
        var maxLength = parseInt(text-area-input.getAttribute('maxlength'), 10) || 0;
        var template = el.getAttribute('data-counter-template') || '{count} of {max} characters';
        function updateCounter() {
          var count = text-area-input.value.length;
          counter.textContent = template.replace('{count}', count).replace('{max}', maxLength);
        }
        text-area-input.addEventListener('input', updateCounter);
        updateCounter();
      }
    });
  })();
</script>`;

const meta = {
  title: 'Headless/TextAreaInputWithCharacterCounter',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
