import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./aotearoa-national-health-index-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/AotearoaNationalHealthIndexView",
    render: (args) => h("lily-aotearoa-national-health-index-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "National Health Index (NHI) Number",
        "value": "ABC1234"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
