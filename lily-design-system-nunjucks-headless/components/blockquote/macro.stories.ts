import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<blockquote
  class="blockquote"></blockquote>`;

const meta = {
  title: 'Headless/Blockquote',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
