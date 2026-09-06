import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./portugal-numero-de-identificacao-fiscal-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/PortugalNumeroDeIdentificacaoFiscalView",
    render: (args) => h("lily-portugal-numero-de-identificacao-fiscal-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Número de Identificação Fiscal (NIF)",
        "value": "123456789"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
