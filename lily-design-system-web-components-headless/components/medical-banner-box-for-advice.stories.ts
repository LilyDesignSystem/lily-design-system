import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./medical-banner-box-for-advice.js";
import { h } from "../stories/render.js";

const SLOT = "<span>GP: Dr Patel</span><span>Care plan: annual review due March</span>";

const meta: Meta = {
    title: "Content/MedicalBannerBoxForAdvice",
    render: (args) => h("lily-medical-banner-box-for-advice", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Care contacts",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
