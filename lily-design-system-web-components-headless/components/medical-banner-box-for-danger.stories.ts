import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./medical-banner-box-for-danger.js";
import { h } from "../stories/render.js";

const SLOT = "<span>Penicillin: anaphylaxis</span>";

const meta: Meta = {
    title: "Content/MedicalBannerBoxForDanger",
    render: (args) => h("lily-medical-banner-box-for-danger", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Allergies",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
