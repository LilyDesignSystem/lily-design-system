import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"context-menu-item\"\n  role=\"menuitem\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Context Menu Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
