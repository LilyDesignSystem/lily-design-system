import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./nederland-burgerservice-nummer-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/NederlandBurgerserviceNummerView",
    render: (args) => h("lily-nederland-burgerservice-nummer-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Burgerservicenummer (BSN)",
        "value": "123456782"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
