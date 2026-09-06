import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./australia-individual-healthcare-identifier-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/AustraliaIndividualHealthcareIdentifierInput",
    render: (args) => h("lily-australia-individual-healthcare-identifier-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Individual Healthcare Identifier"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
