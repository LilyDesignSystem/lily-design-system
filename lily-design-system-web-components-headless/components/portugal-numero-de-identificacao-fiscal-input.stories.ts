import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./portugal-numero-de-identificacao-fiscal-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/PortugalNumeroDeIdentificacaoFiscalInput",
    render: (args) => h("lily-portugal-numero-de-identificacao-fiscal-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Número de Identificação Fiscal (NIF)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
