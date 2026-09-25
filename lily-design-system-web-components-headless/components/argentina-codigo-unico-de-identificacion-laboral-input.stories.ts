import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./argentina-codigo-unico-de-identificacion-laboral-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/ArgentinaCodigoUnicoDeIdentificacionLaboralInput",
    render: (args) => h("lily-argentina-codigo-unico-de-identificacion-laboral-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Código Único de Identificación Laboral (CUIL)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
