import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"menu-group\"\n  role=\"group\"\n  aria-label=\"\"\n>\n  <div class=\"menu-group-heading\" aria-hidden=\"true\"></div>\n  <!-- Consumer inserts menu-item children here -->\n</div>";

const meta = {
  title: 'Headless/Menu Group',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
