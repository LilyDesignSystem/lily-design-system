import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./medical-banner-box.js";
import { h } from "../stories/render.js";

const SLOT = "<span>Patient: John Smith</span><span>NHS: 123 456 7890</span>";

const meta: Meta = {
    title: "Content/MedicalBannerBox",
    render: (args) => h("lily-medical-banner-box", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Patient summary",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
