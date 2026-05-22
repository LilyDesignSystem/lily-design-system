import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<form
  class="editable-form"
  aria-label=""
>
  <!-- Consumer provides form fields -->
</form>

<script>
  // EditableForm behavior
  (function() {
    'use strict';
    // EditableForm: consumer implements interactive behavior
    document.querySelectorAll('.editable-form').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/EditableForm',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
