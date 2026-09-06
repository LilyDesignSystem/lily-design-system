import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./belgique-numero-de-registre-national-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/BelgiqueNumeroDeRegistreNationalView",
    render: (args) => h("lily-belgique-numero-de-registre-national-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Numéro de Registre National",
        "value": "85073003328"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
