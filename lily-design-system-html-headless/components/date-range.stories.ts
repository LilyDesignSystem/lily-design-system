import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<fieldset class="date-range" aria-label="Trip dates">
  <input class="date-input" type="date" aria-label="Departure" />
  <input class="date-input" type="date" aria-label="Return" />
</fieldset>`;

const meta = {
  title: 'Headless/DateRange',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
