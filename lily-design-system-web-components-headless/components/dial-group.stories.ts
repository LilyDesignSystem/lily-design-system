import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./dial-group.js";
import { h } from "../stories/render.js";

const SLOT = '<span>72°</span><span>Humidity 45%</span>';

const meta: Meta = {
    title: "Forms/DialGroup",
    render: (args) => h("lily-dial-group", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Thermostat controls"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
