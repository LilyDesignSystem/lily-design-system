import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="time-picker-input"
  role="radiogroup"
  type="time"
  aria-label=""
>

<script>
  // TimePickerInput behavior
  (function() {
    'use strict';
    // TimePickerInput: consumer implements interactive behavior
    document.querySelectorAll('.time-picker-input').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/TimePickerInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
