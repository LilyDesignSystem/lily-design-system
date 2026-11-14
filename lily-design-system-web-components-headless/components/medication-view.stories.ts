import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./medication-view.js";
import { h } from "../stories/render.js";

const SLOT = ``;

const meta: Meta = {
    title: "Healthcare/MedicationView",
    render: (args) => h("lily-medication-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "name-segments": '[{"text":"hydr"},{"text":"ALAZINE","tallMan":true}]',
        strength: "25 mg",
        form: "tablet",
        route: "oral",
        frequency: "twice daily",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
