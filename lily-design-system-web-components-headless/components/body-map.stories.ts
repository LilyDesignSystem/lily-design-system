import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./body-map.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Healthcare/BodyMap",
    render: (args) => h("lily-body-map", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Where is the pain?",
        name: "sites",
        regions: '[{"id":"head","label":"Head"},{"id":"chest","label":"Chest"}]',
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
