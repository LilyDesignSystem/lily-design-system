import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./brasil-cartao-nacional-de-saude-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/BrasilCartaoNacionalDeSaudeView",
    render: (args) => h("lily-brasil-cartao-nacional-de-saude-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Cartão Nacional de Saúde (CNS)",
        "value": "123 4567 8901 234"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
