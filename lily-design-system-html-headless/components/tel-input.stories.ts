import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="tel-input"
  type="tel"
  aria-label=""
>`;

const meta = {
  title: 'Headless/TelInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
