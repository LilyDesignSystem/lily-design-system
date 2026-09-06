import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./lietuva-pasas-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/LietuvaPasasView",
    render: (args) => h("lily-lietuva-pasas-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Pasas (Passport Number)",
        "value": "12345678"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
