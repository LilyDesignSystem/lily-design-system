import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TreeLink component -->\n<!--\n  Description: one link in the tree\n  HTML tag: <a>\n  CSS class: tree-link\n  Keyboard: Tab to focus, Enter to follow link\n  Accessibility: aria-label for accessible name\n-->\n\n<a\n  class=\"tree-link\"\n  aria-label=\"\"\n  href=\"\"\n>\n  <!-- Consumer provides content -->\n</a>";

const meta = {
  title: 'Headless/Tree Link',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
