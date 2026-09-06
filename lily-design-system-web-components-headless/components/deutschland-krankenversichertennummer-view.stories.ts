import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./deutschland-krankenversichertennummer-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/DeutschlandKrankenversichertennummerView",
    render: (args) => h("lily-deutschland-krankenversichertennummer-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Krankenversichertennummer",
        "value": "A123456789"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
