import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./brasil-cartao-nacional-de-saude-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/BrasilCartaoNacionalDeSaudeInput",
    render: (args) => h("lily-brasil-cartao-nacional-de-saude-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Cartão Nacional de Saúde (CNS)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
