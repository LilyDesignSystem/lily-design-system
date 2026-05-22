import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="date-time-local-input"
  type="datetime-local"
  aria-label=""
>`;

const meta = {
  title: 'Headless/DateTimeLocalInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
