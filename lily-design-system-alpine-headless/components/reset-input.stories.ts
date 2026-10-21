import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"reset-input\"\n  type=\"reset\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Reset Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
