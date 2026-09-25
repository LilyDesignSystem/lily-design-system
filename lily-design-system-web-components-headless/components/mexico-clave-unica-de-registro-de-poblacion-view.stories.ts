import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./mexico-clave-unica-de-registro-de-poblacion-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/MexicoClaveUnicaDeRegistroDePoblacionView",
    render: (args) => h("lily-mexico-clave-unica-de-registro-de-poblacion-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Clave Única de Registro de Población (CURP)",
        "value": "XAXX010101HNEXXXA4"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
