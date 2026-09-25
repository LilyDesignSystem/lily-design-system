import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./yisrael-teudat-zehut-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/YisraelTeudatZehutInput",
    render: (args) => h("lily-yisrael-teudat-zehut-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Teudat Zehut (תעודת זהות)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
