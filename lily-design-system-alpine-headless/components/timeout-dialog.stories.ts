import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TimeoutDialog component -->\n<dialog\n  class=\"timeout-dialog\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</dialog>";

const meta = {
  title: 'Headless/Timeout Dialog',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
