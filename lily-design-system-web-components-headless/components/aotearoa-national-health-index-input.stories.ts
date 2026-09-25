import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./aotearoa-national-health-index-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/AotearoaNationalHealthIndexInput",
    render: (args) => h("lily-aotearoa-national-health-index-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "National Health Index (NHI) Number"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
