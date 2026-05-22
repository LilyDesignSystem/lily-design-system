import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="date-range">
  <time class="date-range-start"></time>
  <span class="date-range-separator" aria-hidden="true">–</span>
  <time class="date-range-end"></time>
</span>`;

const meta = {
  title: 'Headless/DateRange',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
