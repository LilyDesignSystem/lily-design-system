import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tile-map.js";
import { h } from "../stories/render.js";

const SLOT =
    '<div class="tile" data-tile tabindex="0" style="grid-column: 11; grid-row: 1">ME</div>' +
    '<div class="tile" data-tile tabindex="0" style="grid-column: 1; grid-row: 2">AK</div>';

const meta: Meta = {
    title: "Content/TileMap",
    render: (args) => h("lily-tile-map", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "US election results by state",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
