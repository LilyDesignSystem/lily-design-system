import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./belgique-numero-de-registre-national-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/BelgiqueNumeroDeRegistreNationalInput",
    render: (args) => h("lily-belgique-numero-de-registre-national-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Numéro de Registre National"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
