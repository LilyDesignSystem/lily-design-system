import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./allergy-list-item.js";
import { h } from "../stories/render.js";

const SLOT = ``;

const meta: Meta = {
    title: "Healthcare/AllergyListItem",
    render: (args) => h("lily-allergy-list-item", args as Record<string, string | boolean>, SLOT),
    args: {
        substance: "Penicillin",
        reaction: "Anaphylaxis",
        severity: "severe",
        "severity-label": "Severe",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
