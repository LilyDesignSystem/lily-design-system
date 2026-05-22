import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="text-input"
  type="text"
  aria-label=""
>`;

const meta = {
  title: 'Headless/TextInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
