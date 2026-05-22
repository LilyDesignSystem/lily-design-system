import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="text-input-with-search"
  role="search"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // TextInputWithSearch behavior
  (function() {
    'use strict';
    document.querySelectorAll('.text-input-with-search').forEach(function(el) {
      var input = el.querySelector('input[type="text"]');
      var searchBtn = el.querySelector('button');
      if (input && searchBtn) {
        searchBtn.addEventListener('click', function() {
          el.dispatchEvent(new CustomEvent('search', { bubbles: true, detail: { value: input.value } }));
        });
        input.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            el.dispatchEvent(new CustomEvent('search', { bubbles: true, detail: { value: input.value } }));
          }
        });
      }
    });
  })();
</script>`;

const meta = {
  title: 'Headless/TextInputWithSearch',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
