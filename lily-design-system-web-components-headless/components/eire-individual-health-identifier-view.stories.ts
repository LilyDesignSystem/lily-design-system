import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./eire-individual-health-identifier-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/EireIndividualHealthIdentifierView",
    render: (args) => h("lily-eire-individual-health-identifier-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Individual Health Identifier (IHI)",
        "value": "1234567890"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
