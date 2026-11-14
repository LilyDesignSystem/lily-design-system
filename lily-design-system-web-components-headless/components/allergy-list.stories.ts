import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./allergy-list.js";
import "./allergy-list-item.js";
import { h } from "../stories/render.js";

const SLOT = `<lily-allergy-list-item substance="Penicillin" reaction="Anaphylaxis" severity="severe" severity-label="Severe"></lily-allergy-list-item>`;

const meta: Meta = {
    title: "Healthcare/AllergyList",
    render: (args) => h("lily-allergy-list", args as Record<string, string | boolean>, SLOT),
    args: { status: "known", "status-label": "Known allergies" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
