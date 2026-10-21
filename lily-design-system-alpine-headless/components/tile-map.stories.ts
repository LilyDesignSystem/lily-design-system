import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TileMap component -->\n<!--\n  Description: a tile cartogram map\n  HTML tag: <div>\n  CSS class: tile-map\n  Keyboard: None (passive element)\n  Accessibility: role=\"img\", aria-label for accessible name\n-->\n\n<div\n  class=\"tile-map\"\n  role=\"img\"\n  aria-label=\"\"\n  aria-roledescription=\"tile map\"\n>\n  <!-- Consumer provides [data-tile] elements; consumer JS handles arrow-key navigation -->\n</div>";

const meta = {
  title: 'Headless/Tile Map',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
