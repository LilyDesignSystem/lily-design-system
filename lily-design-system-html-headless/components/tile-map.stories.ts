import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="tile-map"
  role="img"
  aria-label=""
  aria-roledescription="tile map"
>
  <!-- Consumer provides [data-tile] elements; consumer JS handles arrow-key navigation -->
</div>`;

const meta = {
  title: 'Headless/TileMap',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
