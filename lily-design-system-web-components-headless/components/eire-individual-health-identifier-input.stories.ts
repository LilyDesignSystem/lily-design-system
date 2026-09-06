import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./eire-individual-health-identifier-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/EireIndividualHealthIdentifierInput",
    render: (args) => h("lily-eire-individual-health-identifier-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Individual Health Identifier (IHI)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
