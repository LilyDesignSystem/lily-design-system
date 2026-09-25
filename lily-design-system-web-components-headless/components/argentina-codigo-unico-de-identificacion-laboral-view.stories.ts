import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./argentina-codigo-unico-de-identificacion-laboral-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/ArgentinaCodigoUnicoDeIdentificacionLaboralView",
    render: (args) => h("lily-argentina-codigo-unico-de-identificacion-laboral-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Código Único de Identificación Laboral (CUIL)",
        "value": "20-12345678-9"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
