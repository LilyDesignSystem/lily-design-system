import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./notification.js";
import { h } from "../stories/render.js";

const SLOT = "Your changes have been saved.";

const meta: Meta = {
    title: "Content/Notification",
    render: (args) => h("lily-notification", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Success",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Urgent: Story = {
    args: { label: "Error", urgent: true },
    render: (args) => h("lily-notification", args as Record<string, string | boolean>, "Something went wrong. Please try again."),
};
