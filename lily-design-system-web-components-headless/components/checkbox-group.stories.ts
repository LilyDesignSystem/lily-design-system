import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./checkbox-group.js";
import { h } from "../stories/render.js";

const SLOT = "<label><input type=\"checkbox\" name=\"ch\" value=\"email\"> Email</label><label><input type=\"checkbox\" name=\"ch\" value=\"sms\"> SMS</label>";

const meta: Meta = {
    title: "Forms/CheckboxGroup",
    render: (args) => h("lily-checkbox-group", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Notify me by"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
