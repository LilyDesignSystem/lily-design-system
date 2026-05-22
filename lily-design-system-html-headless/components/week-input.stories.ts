import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="week-input"
  type="week"
  aria-label=""
>`;

const meta = {
  title: 'Headless/WeekInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
