import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./australia-individual-healthcare-identifier-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/AustraliaIndividualHealthcareIdentifierView",
    render: (args) => h("lily-australia-individual-healthcare-identifier-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Individual Healthcare Identifier",
        "value": "8003608833357361"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
