import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./editable-form.js";
import { h } from "../stories/render.js";

const SLOT = '<input name="name" value="Ada Lovelace"><button type="submit">Save</button>';

const meta: Meta = {
    title: "Forms/EditableForm",
    render: (args) => h("lily-editable-form", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Edit profile",
        "editing": true
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
