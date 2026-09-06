import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./medical-banner.js";
import { h } from "../stories/render.js";

const SLOT = "Patient has a documented penicillin allergy.";

const meta: Meta = {
    title: "Overlays/MedicalBanner",
    render: (args) => h("lily-medical-banner", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Patient alerts",
        "type": "warning",
        "dismissible": true,
        "close-label": "Dismiss alert"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
