import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./espana-codigo-de-identificacion-fiscal-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/EspanaCodigoDeIdentificacionFiscalView",
    render: (args) => h("lily-espana-codigo-de-identificacion-fiscal-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Código de Identificación Fiscal",
        "value": "A58818501"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
