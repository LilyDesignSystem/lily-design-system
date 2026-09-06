import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./task-bar.js";
import "./task-bar-button.js";
import { h } from "../stories/render.js";

const SLOT = "<lily-task-bar-button>New</lily-task-bar-button><lily-task-bar-button>Open</lily-task-bar-button><lily-task-bar-button>Save</lily-task-bar-button><lily-task-bar-button disabled>Discharge</lily-task-bar-button>";

const meta: Meta = {
    title: "Navigation/TaskBar",
    render: (args) => h("lily-task-bar", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Patient record shortcuts"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
