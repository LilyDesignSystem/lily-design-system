import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="date-input"
  type="date"
  aria-label=""
>`;

const meta = {
  title: 'Headless/DateInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
