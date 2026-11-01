import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./malaysia-kad-pengenalan-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/MalaysiaKadPengenalanView",
    render: (args) =>
        h("lily-malaysia-kad-pengenalan-view", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "MyKad Number (NRIC)",
        value: "900101-14-5678",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
