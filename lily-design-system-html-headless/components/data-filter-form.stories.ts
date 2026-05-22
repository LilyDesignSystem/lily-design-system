import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<form
  class="data-filter-form"
  aria-label=""
>
  <!-- Consumer provides form fields -->
</form>

<script>
  // DataFilterForm behavior
  (function() {
    'use strict';
    // DataFilterForm: consumer implements interactive behavior
    document.querySelectorAll('.data-filter-form').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/DataFilterForm',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
