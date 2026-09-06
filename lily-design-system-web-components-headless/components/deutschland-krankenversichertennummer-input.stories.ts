import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./deutschland-krankenversichertennummer-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/DeutschlandKrankenversichertennummerInput",
    render: (args) => h("lily-deutschland-krankenversichertennummer-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Krankenversichertennummer"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
