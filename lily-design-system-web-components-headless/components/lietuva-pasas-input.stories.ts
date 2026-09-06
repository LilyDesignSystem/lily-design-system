import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./lietuva-pasas-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/LietuvaPasasInput",
    render: (args) => h("lily-lietuva-pasas-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Pasas (Passport Number)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
