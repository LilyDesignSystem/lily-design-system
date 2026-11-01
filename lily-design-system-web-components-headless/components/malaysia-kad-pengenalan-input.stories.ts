import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./malaysia-kad-pengenalan-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/MalaysiaKadPengenalanInput",
    render: (args) =>
        h("lily-malaysia-kad-pengenalan-input", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "MyKad Number (NRIC)",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
