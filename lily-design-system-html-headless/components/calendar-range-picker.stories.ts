import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="calendar-range-picker"
  role="radiogroup"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // CalendarRangePicker behavior
  (function() {
    'use strict';
    // CalendarRangePicker: consumer implements interactive behavior
    document.querySelectorAll('.calendar-range-picker').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/CalendarRangePicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
