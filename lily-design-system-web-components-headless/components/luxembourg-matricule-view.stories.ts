import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./luxembourg-matricule-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/LuxembourgMatriculeView",
    render: (args) => h("lily-luxembourg-matricule-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Numéro d\'Identification Nationale (Matricule)",
        "value": "1980010112345"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
