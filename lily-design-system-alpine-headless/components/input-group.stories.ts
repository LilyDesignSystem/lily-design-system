import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"input-group\"\n  role=\"group\"\n  aria-label=\"\"\n>\n  <!-- Optional prefix addon (e.g., currency symbol, icon) -->\n  <span class=\"input-group-prefix\">\n    <!-- Consumer provides prefix content -->\n  </span>\n\n  <!-- Consumer-supplied input goes here -->\n\n  <!-- Optional suffix addon (e.g., unit, button, icon) -->\n  <span class=\"input-group-suffix\">\n    <!-- Consumer provides suffix content -->\n  </span>\n</div>";

const meta = {
  title: 'Headless/Input Group',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
