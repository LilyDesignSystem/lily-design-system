import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="month-input"
  type="month"
  aria-label=""
>`;

const meta = {
  title: 'Headless/MonthInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
