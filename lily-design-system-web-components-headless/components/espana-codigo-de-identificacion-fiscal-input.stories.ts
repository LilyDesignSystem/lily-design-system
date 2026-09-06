import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./espana-codigo-de-identificacion-fiscal-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/EspanaCodigoDeIdentificacionFiscalInput",
    render: (args) => h("lily-espana-codigo-de-identificacion-fiscal-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Código de Identificación Fiscal"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
