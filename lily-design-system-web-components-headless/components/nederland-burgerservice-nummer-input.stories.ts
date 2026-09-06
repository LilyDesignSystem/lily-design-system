import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./nederland-burgerservice-nummer-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/NederlandBurgerserviceNummerInput",
    render: (args) => h("lily-nederland-burgerservice-nummer-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Burgerservicenummer (BSN)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
