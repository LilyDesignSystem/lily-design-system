import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<button\n  class=\"action-bar-button\"\n  type=\"button\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides icon and/or text content -->\n</button>";

const meta = {
  title: 'Headless/Action Bar Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
