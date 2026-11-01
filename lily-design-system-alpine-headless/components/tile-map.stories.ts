import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div class="tile-map" role="img" aria-label="" aria-roledescription="tile map" x-data="lilyTileMap()" x-bind="map">\n  <!-- Consumer provides focusable [data-tile] elements (tabindex="0") and positions them; it hears tile-activate -->\n</div>';

const meta = {
    title: "Headless/Tile Map",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
