import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Tile component -->\n<!--\n  Description: a grouping container\n  HTML tag: <div>\n  CSS class: tile\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"tile\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Tile',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
