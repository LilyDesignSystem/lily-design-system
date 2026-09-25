import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./luxembourg-matricule-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/LuxembourgMatriculeInput",
    render: (args) => h("lily-luxembourg-matricule-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Numéro d\'Identification Nationale (Matricule)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
