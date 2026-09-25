import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./mexico-clave-unica-de-registro-de-poblacion-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/MexicoClaveUnicaDeRegistroDePoblacionInput",
    render: (args) => h("lily-mexico-clave-unica-de-registro-de-poblacion-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Clave Única de Registro de Población (CURP)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
