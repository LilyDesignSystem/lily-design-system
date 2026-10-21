import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<select\n  class=\"select\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides option elements -->\n</select>";

const meta = {
  title: 'Headless/Select',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
