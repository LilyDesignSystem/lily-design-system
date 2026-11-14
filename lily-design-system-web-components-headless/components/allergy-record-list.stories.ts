import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./allergy-record-list.js";
import "./allergy-record-list-item.js";
import { h } from "../stories/render.js";

const SLOT = `<lily-allergy-record-list-item substance="Penicillin" reaction="Anaphylaxis" severity="severe" severity-label="Severe"></lily-allergy-record-list-item>`;

const meta: Meta = {
    title: "Healthcare/AllergyRecordList",
    render: (args) => h("lily-allergy-record-list", args as Record<string, string | boolean>, SLOT),
    args: { status: "known", "status-label": "Known allergies" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
