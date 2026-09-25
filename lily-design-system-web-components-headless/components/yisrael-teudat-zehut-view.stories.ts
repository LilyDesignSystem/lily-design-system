import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./yisrael-teudat-zehut-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/YisraelTeudatZehutView",
    render: (args) => h("lily-yisrael-teudat-zehut-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Teudat Zehut (תעודת זהות)",
        "value": "123456782"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
